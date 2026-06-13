import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { ApiKey, Tenant, TIER_LIMITS, TierLimits } from './tenant.types';

// Mock DB Store for API operations (synchronized with frontend simulator)
export class TenantDatabase {
  public tenants: Map<string, Tenant> = new Map();
  public apiKeys: Map<string, ApiKey> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed T&F Investments
    const tfTenantId = '88888888-8888-4888-8888-888888888888';
    this.tenants.set(tfTenantId, {
      id: tfTenantId,
      name: 'T&F Investments & Holdings LLC',
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      contactEmail: 'enterprise@tf-holdings.com',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
    });

    // Hash representation of 'lb_live_tf_investments_secret'
    const tfRawKey = 'lb_live_tf_investments_secret';
    const tfHash = this.hashKey(tfRawKey);
    this.apiKeys.set(tfHash, {
      key: 'lb_live_tf_investments_secret',
      hash: tfHash,
      tenantId: tfTenantId,
      label: 'T&F Core Production',
      scopes: ['lbs:read', 'calibration:read', 'athleteiq:read', 'bayesian:write'],
      active: true,
      testMode: false,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    });

    // Seed a couple more for Sandbox and Pro testing
    const proTenantId = '44444444-4444-4444-4444-444444444444';
    this.tenants.set(proTenantId, {
      id: proTenantId,
      name: 'Beta Syndicate Pro',
      tier: 'PRO',
      status: 'ACTIVE',
      contactEmail: 'bets@betasyndicate.io',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000
    });

    const proRawKey = 'lb_live_pro_secret_key';
    const proHash = this.hashKey(proRawKey);
    this.apiKeys.set(proHash, {
      key: 'lb_live_pro_secret_key',
      hash: proHash,
      tenantId: proTenantId,
      label: 'Main Production Pulse Key',
      scopes: ['lbs:read', 'calibration:read'],
      active: true,
      testMode: false,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000
    });

    const sandboxId = '11111111-1111-1111-1111-111111111111';
    this.tenants.set(sandboxId, {
      id: sandboxId,
      name: 'Sandbox Developer Space',
      tier: 'SANDBOX',
      status: 'ACTIVE',
      contactEmail: 'dev@sandbox.com',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    });

    const sandboxRawKey = 'lb_test_sandbox_key';
    const sandboxHash = this.hashKey(sandboxRawKey);
    this.apiKeys.set(sandboxHash, {
      key: 'lb_test_sandbox_key',
      hash: sandboxHash,
      tenantId: sandboxId,
      label: 'Default Sandbox Test Key',
      scopes: ['lbs:read'],
      active: true,
      testMode: true,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    });
  }

  public hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }
}

export const tenantDb = new TenantDatabase();

// In-Memory Fast Cache targeting 5min TTL to avoid database hits
interface CacheEntry {
  tenant: Tenant;
  apiKey: ApiKey;
  expiresAt: number;
}
const authCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes

export interface AuthenticatedRequest extends Request {
  tenant?: Tenant;
  apiKeyRecord?: ApiKey;
}

/**
 * Express middleware to authenticate APIs via custom key header
 */
export async function authenticateApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing authorization header.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Bearer token format required (Bearer <api_key>).'
    });
  }

  const apiKeyStr = parts[1];
  
  // Verify prefix
  if (!apiKeyStr.startsWith('lb_live_') && !apiKeyStr.startsWith('lb_test_')) {
    return res.status(401).json({
      error: 'INVALID_KEY',
      message: 'API Key must start with "lb_live_" or "lb_test_".'
    });
  }

  // Check Fast Cache
  const now = Date.now();
  const cached = authCache.get(apiKeyStr);
  if (cached && cached.expiresAt > now) {
    req.tenant = cached.tenant;
    req.apiKeyRecord = cached.apiKey;
    return next();
  }

  // Database Match
  const hash = tenantDb.hashKey(apiKeyStr);
  const apiKeyRecord = tenantDb.apiKeys.get(hash);

  if (!apiKeyRecord || !apiKeyRecord.active) {
    return res.status(401).json({
      error: 'INVALID_KEY',
      message: 'The provided API Key is invalid or has been revoked.'
    });
  }

  const tenant = tenantDb.tenants.get(apiKeyRecord.tenantId);
  if (!tenant || tenant.status !== 'ACTIVE') {
    return res.status(403).json({
      error: 'TENANT_INACTIVE',
      message: 'The associated tenant account is suspended or blocked.'
    });
  }

  // Update Last Used
  apiKeyRecord.lastUsedAt = now;

  // Add back to Cache
  authCache.set(apiKeyStr, {
    tenant,
    apiKey: apiKeyRecord,
    expiresAt: now + CACHE_TTL_MS
  });

  req.tenant = tenant;
  req.apiKeyRecord = apiKeyRecord;
  next();
}

/**
 * Access Control Scope Checker Guard Factory
 */
export function requireScope(scope: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const key = req.apiKeyRecord;
    if (!key) {
      return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Auth context missing.' });
    }

    if (!key.scopes.includes(scope)) {
      return res.status(403).json({
        error: 'INSUFFICIENT_SCOPES',
        message: `This operation requires the "${scope}" permission scope.`
      });
    }
    next();
  };
}

/**
 * Feature Guard Checker matching Limits of Key Tenant Tier
 */
export function requireTierFeature(feature: keyof TierLimits) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tenant = req.tenant;
    if (!tenant) {
      return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Tenant context missing.' });
    }

    const limits = TIER_LIMITS[tenant.tier];
    if (!limits || !limits[feature]) {
      return res.status(403).json({
        error: 'FEATURE_RESTRICTED',
        message: `The "${String(feature)}" capability is restricted on your current "${tenant.tier}" tier plan.`
      });
    }
    next();
  };
}
