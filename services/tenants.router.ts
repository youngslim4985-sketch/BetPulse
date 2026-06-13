import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { tenantDb, authenticateApiKey, AuthenticatedRequest } from './apiKeyAuth';
import { getOrCreateAggregate, monthlyUsageStore } from './rateLimiter';
import { TenantTier, ApiKey, Tenant, TIER_LIMITS } from './tenant.types';

const router = Router();

/**
 * UTILITY: Helper to generate a random cryptographically secure string
 */
function createSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * POST /api/v1/tenants
 * Register a new Tenant Organization
 */
router.post('/tenants', (req: Request, res: Response) => {
  const { name, contactEmail, tier = 'SANDBOX' } = req.body;

  if (!name || !contactEmail) {
    return res.status(400).json({
      error: 'MISSING_FIELDS',
      message: 'Name and contactEmail are required to establish a tenant organization.'
    });
  }

  // Check if tenant already exists for email
  const existing = Array.from(tenantDb.tenants.values()).find(t => t.contactEmail === contactEmail);
  if (existing) {
    return res.status(409).json({
      error: 'TENANT_EXISTS',
      message: `A tenant with the email ${contactEmail} already exists.`,
      tenantId: existing.id
    });
  }

  const tenantId = crypto.randomUUID();
  const newTenant: Tenant = {
    id: tenantId,
    name,
    tier: tier as TenantTier,
    status: 'ACTIVE',
    contactEmail,
    createdAt: Date.now()
  };

  tenantDb.tenants.set(tenantId, newTenant);

  // Generate initial credentials matching tier scopes
  const rawKey = `lb_${tier === 'SANDBOX' ? 'test' : 'live'}_${createSecureToken(16)}`;
  const hash = tenantDb.hashKey(rawKey);
  const limits = TIER_LIMITS[tier as TenantTier];

  const defaultKey: ApiKey = {
    key: rawKey,
    hash,
    tenantId,
    label: 'Primary Integration Key',
    scopes: [...limits.allowedScopes],
    active: true,
    testMode: tier === 'SANDBOX',
    createdAt: Date.now()
  };

  tenantDb.apiKeys.set(hash, defaultKey);

  res.status(201).json({
    message: 'Tenant successfully registered.',
    tenant: {
      id: newTenant.id,
      name: newTenant.name,
      tier: newTenant.tier,
      status: newTenant.status,
      contactEmail: newTenant.contactEmail,
      createdAt: newTenant.createdAt
    },
    apiKey: {
      raw_key_view_once: rawKey,
      label: defaultKey.label,
      scopes: defaultKey.scopes,
      testMode: defaultKey.testMode
    }
  });
});

/**
 * GET /api/v1/tenants/me
 * Fetch authenticated tenant and key info
 */
router.get('/tenants/me', authenticateApiKey, (req: AuthenticatedRequest, res: Response) => {
  const currentMonth = new Date().toISOString().substring(0, 7);
  const stats = getOrCreateAggregate(req.tenant!.id, currentMonth);

  res.json({
    tenant: req.tenant,
    apiKey: {
      label: req.apiKeyRecord?.label,
      scopes: req.apiKeyRecord?.scopes,
      testMode: req.apiKeyRecord?.testMode,
      createdAt: req.apiKeyRecord?.createdAt,
      lastUsedAt: req.apiKeyRecord?.lastUsedAt
    },
    usage: {
      month: currentMonth,
      calls: stats.callCount,
      computeUnits: stats.computeUnits,
      limitReached: stats.limitReached,
      limitMax: TIER_LIMITS[req.tenant!.tier].monthlyQuota
    }
  });
});

/**
 * GET /api/v1/tenants/keys
 * List active keys for a tenant (simulated admin list via tenant query header or token)
 */
router.get('/tenants/:tenantId/keys', (req: Request, res: Response) => {
  const { tenantId } = req.params;
  const tenant = tenantDb.tenants.get(tenantId);
  if (!tenant) return res.status(404).json({ error: 'NOT_FOUND', message: 'Tenant not found' });

  const keys = Array.from(tenantDb.apiKeys.values())
    .filter(k => k.tenantId === tenantId)
    .map(k => ({
      label: k.label,
      prefix: k.key.substring(0, 8) + '...' + k.key.substring(k.key.length - 4),
      scopes: k.scopes,
      active: k.active,
      testMode: k.testMode,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      id: k.hash.substring(0, 8) // pseudo ID for referencing
    }));

  res.json({ keys });
});

/**
 * POST /api/v1/tenants/keys (Insert key)
 */
router.post('/tenants/:tenantId/keys', (req: Request, res: Response) => {
  const { tenantId } = req.params;
  const { label, testMode = false, scopes } = req.body;

  const tenant = tenantDb.tenants.get(tenantId);
  if (!tenant) return res.status(404).json({ error: 'NOT_FOUND', message: 'Tenant not found' });

  const limits = TIER_LIMITS[tenant.tier];
  const activeKeys = Array.from(tenantDb.apiKeys.values()).filter(k => k.tenantId === tenantId && k.active);

  if (activeKeys.length >= limits.maxKeys) {
    return res.status(400).json({
      error: 'KEY_LIMIT_REACHED',
      message: `Your current "${tenant.tier}" tier restricts key counts to a maximum of ${limits.maxKeys}.`
    });
  }

  const cleanScopes = Array.isArray(scopes) 
    ? scopes.filter(s => limits.allowedScopes.includes(s))
    : [...limits.allowedScopes];

  const rawKey = `lb_${cleanScopes.includes('bayesian:write') ? 'live' : (testMode ? 'test' : 'live')}_${createSecureToken(16)}`;
  const hash = tenantDb.hashKey(rawKey);

  const newKey: ApiKey = {
    key: rawKey,
    hash,
    tenantId,
    label: label || `API Key ${activeKeys.length + 1}`,
    scopes: cleanScopes,
    active: true,
    testMode: testMode || cleanScopes.includes('bayesian:write') ? false : testMode,
    createdAt: Date.now()
  };

  tenantDb.apiKeys.set(hash, newKey);

  res.status(201).json({
    message: 'API Key successfully generated.',
    raw_key_view_once: rawKey,
    keySummary: {
      label: newKey.label,
      scopes: newKey.scopes,
      testMode: newKey.testMode,
      createdAt: newKey.createdAt
    }
  });
});

/**
 * POST /api/v1/tenants/upgrade
 * Simulate a Tenant Tier Plan Upgrade
 */
router.post('/tenants/:tenantId/upgrade', (req: Request, res: Response) => {
  const { tenantId } = req.params;
  const { tier } = req.body;

  const tenant = tenantDb.tenants.get(tenantId);
  if (!tenant) return res.status(404).json({ error: 'NOT_FOUND', message: 'Tenant not found' });

  if (!['SANDBOX', 'PRO', 'ENTERPRISE'].includes(tier)) {
    return res.status(400).json({ error: 'INVALID_TIER', message: 'Supported plan tiers: SANDBOX, PRO, ENTERPRISE.' });
  }

  tenant.tier = tier as TenantTier;

  // Upgrade key scopes dynamically to match original default allowances
  const limits = TIER_LIMITS[tier as TenantTier];
  const keys = Array.from(tenantDb.apiKeys.values()).filter(k => k.tenantId === tenantId);
  keys.forEach(k => {
    // Elevate scopes to limits scope
    k.scopes = Array.from(new Set([...k.scopes, ...limits.allowedScopes]));
  });

  res.json({
    message: `Tenant upgraded successfully to ${tier}. All associated active keys have inherited enhanced tiers capabilities.`,
    tenant
  });
});

/**
 * DELETE /api/v1/tenants/keys/:hash_prefix
 * Revoke key
 */
router.delete('/tenants/:tenantId/keys/:pseudoId', (req: Request, res: Response) => {
  const { tenantId, pseudoId } = req.params;
  
  const keyToRevoke = Array.from(tenantDb.apiKeys.values())
    .find(k => k.tenantId === tenantId && k.hash.startsWith(pseudoId));

  if (!keyToRevoke) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Key not found.' });
  }

  keyToRevoke.active = false;
  res.json({ message: 'API Key successfully revoked. All incoming microservices calls signed with this token will now be rejected.' });
});

export default router;
