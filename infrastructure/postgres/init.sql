-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create public schema tables (system-wide)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    schema_name VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    max_employees INT NOT NULL DEFAULT 100,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    trial_ends_at TIMESTAMP,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX idx_tenants_status ON public.tenants(status);

-- Create function to initialize tenant schema
CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_name VARCHAR)
RETURNS VOID AS $$
DECLARE
    schema_name VARCHAR := 'tenant_' || tenant_name;
BEGIN
    -- Create schema
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
    
    -- Set search path
    EXECUTE format('SET search_path TO %I', schema_name);
    
    -- Grant permissions
    EXECUTE format('GRANT ALL ON SCHEMA %I TO hrm_user', schema_name);
    
    RAISE NOTICE 'Tenant schema % created successfully', schema_name;
END;
$$ LANGUAGE plpgsql;

-- Insert demo tenant
INSERT INTO public.tenants (name, subdomain, schema_name, plan, max_employees, status)
VALUES ('Demo Company', 'demo', 'tenant_demo', 'premium', 500, 'active')
ON CONFLICT (subdomain) DO NOTHING;

-- Create demo tenant schema
SELECT create_tenant_schema('demo');

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'HRM Platform database initialized successfully';
    RAISE NOTICE 'Public schema: tenants table created';
    RAISE NOTICE 'Demo tenant created with schema: tenant_demo';
END $$;
