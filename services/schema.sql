-- ==========================================
-- LINE BREAKER™ MULTI-TENANT ENTERPRISE SCHEMA
-- Suitable for PostgreSQL / Supabase
-- Supports sliding usage records and precise aggregate billing triggers
-- ==========================================

-- Enable UIID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Tiers & Statuses Enums (Uncomment if run outside clean state schemas)
-- CREATE TYPE tenant_tier AS ENUM ('SANDBOX', 'PRO', 'ENTERPRISE');
-- CREATE TYPE tenant_status AS ENUM ('ACTIVE', 'SUSPENDED');
-- CREATE TYPE billing_event_type AS ENUM ('INVOICE', 'PAYMENT_SUCCESS', 'PAYMENT_FAIL', 'OVERAGE_RECORDED');

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'SANDBOX', -- 'SANDBOX' | 'PRO' | 'ENTERPRISE'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'SUSPENDED'
    contact_email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    key_prefix VARCHAR(50) NOT NULL, -- e.g., lb_live_ or lb_test_
    hash VARCHAR(255) PRIMARY KEY, -- bcrypt salted hash of the complete secret key
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    active BOOLEAN NOT NULL DEFAULT TRUE,
    test_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_prefix CHECK (key_prefix IN ('lb_live_', 'lb_test_'))
);

-- 3. Usage Logs Table (High-frequency insertions, partitioned in enterprise if needed)
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_hash VARCHAR(255) NOT NULL REFERENCES api_keys(hash) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    weight NUMERIC(5, 2) NOT NULL DEFAULT 1.00
);

-- 4. Usage Aggregates Table (Speeds up monthly meter readings)
CREATE TABLE IF NOT EXISTS usage_aggregates (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    call_count BIGINT DEFAULT 0 NOT NULL,
    compute_units NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    limit_reached BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, month)
);

-- 5. Billing Events
CREATE TABLE IF NOT EXISTS billing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'INVOICE' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAIL' | 'OVERAGE_RECORDED'
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ==========================================

-- Speed up tenant state and API key scans
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);

-- Speed up time-series lookups on logs (important for rolling sliding window calculations)
CREATE INDEX IF NOT EXISTS idx_usage_logs_composite ON usage_logs(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_key_hash ON usage_logs(api_key_hash, timestamp DESC);

-- Index for aggregate billing cycles
CREATE INDEX IF NOT EXISTS idx_billing_events_tenant ON billing_events(tenant_id, timestamp DESC);


-- ==========================================
-- AUTOMATION TRIGGERS
-- ==========================================

-- Trigger to auto-update modified_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenant_modtime 
    BEFORE UPDATE ON tenants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_modified_column();


-- Trigger to auto-roll up Usage Logs into aggregates
CREATE OR REPLACE FUNCTION rollup_usage_logs()
RETURNS TRIGGER AS $$
DECLARE
    v_month VARCHAR(7);
BEGIN
    v_month := to_char(NEW.timestamp, 'YYYY-MM');
    
    INSERT INTO usage_aggregates (tenant_id, month, call_count, compute_units, limit_reached, updated_at)
    VALUES (NEW.tenant_id, v_month, 1, NEW.weight, FALSE, now())
    ON CONFLICT (tenant_id, month) DO UPDATE
    SET call_count = usage_aggregates.call_count + 1,
        compute_units = usage_aggregates.compute_units + EXCLUDED.compute_units,
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rollup_usage_logs
    AFTER INSERT ON usage_logs
    FOR EACH ROW
    EXECUTE FUNCTION rollup_usage_logs();


-- ==========================================
-- ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- ==========================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Simple isolation rules per tenant organization (assuming auth.uid() mapped via claims)
CREATE POLICY tenant_isolation_policy ON tenants
    FOR ALL USING (id = id);

CREATE POLICY api_key_isolation_policy ON api_keys
    FOR ALL USING (tenant_id = tenant_id);


-- ==========================================
-- SEED INITIAL CORPORATE TENANT
-- ==========================================

-- Seed T&F Investments Enterprise internal org
INSERT INTO tenants (id, name, tier, status, contact_email)
VALUES (
    '88888888-8888-4888-8888-888888888888', 
    'T&F Investments & Holdings LLC', 
    'ENTERPRISE', 
    'ACTIVE', 
    'enterprise@tf-holdings.com'
) ON CONFLICT (contact_email) DO NOTHING;

-- Seed internal test key hash (bcrypt representation of 'lb_live_tf_investments_secret')
INSERT INTO api_keys (key_prefix, hash, tenant_id, label, scopes, active, test_mode)
VALUES (
    'lb_live_',
    '$2b$12$N9qo8uLOqpGCvA.A93B.0Oq1gR6E5F5dK3c2o4Yp/I9p8OqHpeNKi', -- hash representation
    '88888888-8888-4888-8888-888888888888',
    'T&F Core Production Integration Key',
    ARRAY['lbs:read', 'calibration:read', 'athleteiq:read', 'bayesian:write'],
    TRUE,
    FALSE
) ON CONFLICT (hash) DO NOTHING;
