import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './apiKeyAuth';
import { TIER_LIMITS, UsageAggregate } from './tenant.types';

// Sliding window structural record
interface RequestRecord {
  timestamp: number;
  weight: number;
}

// In-Memory sliding store: Key is ApiKey string -> List of request timestamps
const slidingWindowStore: Map<string, RequestRecord[]> = new Map();

// In-Memory monthly accumulator: tenantId -> 'YYYY-MM' -> aggregated metrics
export const monthlyUsageStore: Map<string, Map<string, UsageAggregate>> = new Map();

/**
 * Gets or initializes the monthly aggregate for a tenant
 */
export function getOrCreateAggregate(tenantId: string, month: string): UsageAggregate {
  let tenantMap = monthlyUsageStore.get(tenantId);
  if (!tenantMap) {
    tenantMap = new Map();
    monthlyUsageStore.set(tenantId, tenantMap);
  }

  let aggregate = tenantMap.get(month);
  if (!aggregate) {
    aggregate = {
      tenantId,
      month,
      callCount: 0,
      computeUnits: 0,
      limitReached: false
    };
    tenantMap.set(month, aggregate);
  }

  return aggregate;
}

/**
 * Rate limiting & quota enforcement middleware
 * @param endpointWeight - Resource compute charge for this specific route
 */
export function rateLimiter(endpointWeight: number = 1.0) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tenant = req.tenant;
    const keyRecord = req.apiKeyRecord;

    if (!tenant || !keyRecord) {
      return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Missing tenant auth context.' });
    }

    const limits = TIER_LIMITS[tenant.tier];
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const currentMonth = new Date().toISOString().substring(0, 7); // 'YYYY-MM'

    // 1. Quota Enforcement (Monthly Limit)
    const aggregate = getOrCreateAggregate(tenant.id, currentMonth);
    
    if (aggregate.callCount >= limits.monthlyQuota) {
      aggregate.limitReached = true;
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        message: `Tenant has exceeded the monthly API quota of ${limits.monthlyQuota.toLocaleString()} requests. Upgrade to Pro/Enterprise to unlock more.`
      });
    }

    // 2. Sliding Window Burst Enforcement (Per Minute)
    let requests = slidingWindowStore.get(keyRecord.key) || [];
    
    // Purge requests older than 1 minute
    requests = requests.filter(r => r.timestamp > oneMinuteAgo);
    
    const currentMinuteCount = requests.length;
    const burstLimit = limits.rateLimitMin;

    if (currentMinuteCount >= burstLimit) {
      const oldestRequest = requests[0]?.timestamp || oneMinuteAgo;
      const resetSeconds = Math.ceil(((oldestRequest + 60000) - now) / 1000);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', burstLimit);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', resetSeconds);
      res.setHeader('Retry-After', resetSeconds);

      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too Many Requests. Sliding burst ceiling is ${burstLimit} rpm, you have used ${currentMinuteCount} in the last 60s.`
      });
    }

    // Increment log sliding records
    requests.push({ timestamp: now, weight: endpointWeight });
    slidingWindowStore.set(keyRecord.key, requests);

    // Update aggregate statistics
    aggregate.callCount += 1;
    aggregate.computeUnits += endpointWeight;

    // Append response header indicators
    const remainingLimit = Math.max(0, burstLimit - requests.length);
    const oldestReq = requests[0]?.timestamp || now;
    const resetSec = Math.ceil(((oldestReq + 60000) - now) / 1000);

    res.setHeader('X-RateLimit-Limit', burstLimit);
    res.setHeader('X-RateLimit-Remaining', remainingLimit);
    res.setHeader('X-RateLimit-Reset', resetSec);
    res.setHeader('X-Quota-Limit', limits.monthlyQuota);
    res.setHeader('X-Quota-Remaining', Math.max(0, limits.monthlyQuota - aggregate.callCount));

    next();
  };
}
