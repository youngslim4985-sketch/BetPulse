export type TenantTier = 'SANDBOX' | 'PRO' | 'ENTERPRISE';

export interface TierLimits {
  rateLimitMin: number;
  monthlyQuota: number;
  maxKeys: number;
  allowedScopes: string[];
  advancedMetrics: boolean;
  athleteIQ: boolean;
  bayesianPriors: boolean;
}

export const TIER_LIMITS: Record<TenantTier, TierLimits> = {
  SANDBOX: {
    rateLimitMin: 60,
    monthlyQuota: 10000,
    maxKeys: 1,
    allowedScopes: ['lbs:read'],
    advancedMetrics: false,
    athleteIQ: false,
    bayesianPriors: false
  },
  PRO: {
    rateLimitMin: 300,
    monthlyQuota: 100000,
    maxKeys: 3,
    allowedScopes: ['lbs:read', 'calibration:read'],
    advancedMetrics: true,
    athleteIQ: false,
    bayesianPriors: true
  },
  ENTERPRISE: {
    rateLimitMin: 1000,
    monthlyQuota: 1000000,
    maxKeys: 15,
    allowedScopes: ['lbs:read', 'calibration:read', 'athleteiq:read', 'bayesian:write'],
    advancedMetrics: true,
    athleteIQ: true,
    bayesianPriors: true
  }
};

export const TIER_PRICING: Record<TenantTier, { monthlyBase: number; overageUnitCost: number; }> = {
  SANDBOX: {
    monthlyBase: 0,
    overageUnitCost: 0
  },
  PRO: {
    monthlyBase: 499,
    overageUnitCost: 0.005 // $5 per 1k extra calls
  },
  ENTERPRISE: {
    monthlyBase: 2499,
    overageUnitCost: 0.002 // $2 per 1k extra calls
  }
};

export interface Tenant {
  id: string; // uuid
  name: string;
  tier: TenantTier;
  status: 'ACTIVE' | 'SUSPENDED';
  contactEmail: string;
  createdAt: number;
}

export interface ApiKey {
  key: string; // Starts with lb_live_ or lb_test_
  hash: string; // bcrypt/sha256 hash
  tenantId: string;
  label: string;
  scopes: string[];
  active: boolean;
  testMode: boolean;
  createdAt: number;
  lastUsedAt?: number;
}

export interface UsageLog {
  id: string;
  apiKey: string;
  tenantId: string;
  timestamp: number;
  endpoint: string;
  ipAddress: string;
  weight: number;
}

export interface UsageAggregate {
  tenantId: string;
  month: string; // 'YYYY-MM'
  callCount: number;
  computeUnits: number;
  limitReached: boolean;
}

export interface BillingEvent {
  id: string;
  tenantId: string;
  type: 'INVOICE' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAIL' | 'OVERAGE_RECORDED';
  amount: number;
  description: string;
  timestamp: number;
}
