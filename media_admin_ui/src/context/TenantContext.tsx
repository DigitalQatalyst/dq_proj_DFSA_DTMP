import React, { useEffect, useState, createContext, useContext } from 'react';
interface Tenant {
  id: string;
  name: string;
  slug: string;
}
interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  switchTenant: (tenantId: string) => void;
}
// Provide a default, single-tenant context to deprecate multi-tenancy without breaking consumers
const defaultTenant: Tenant = { id: 'default-tenant', name: 'Default Tenant', slug: 'default' };
const defaultCtx: TenantContextType = {
  currentTenant: defaultTenant,
  tenants: [defaultTenant],
  loading: false,
  switchTenant: () => {},
};
const TenantContext = createContext<TenantContextType>(defaultCtx);
export const useTenant = () => useContext(TenantContext);
// Mock tenants for demo
const mockTenants: Tenant[] = [{
  id: '1',
  name: 'Main Organization',
  slug: 'main-org'
}, {
  id: '2',
  name: 'Secondary Tenant',
  slug: 'secondary'
}, {
  id: '3',
  name: 'Test Environment',
  slug: 'test-env'
}];
// No-op provider that supplies a single default tenant
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state] = useState<TenantContextType>(defaultCtx);
  return <TenantContext.Provider value={state}>{children}</TenantContext.Provider>;
};
