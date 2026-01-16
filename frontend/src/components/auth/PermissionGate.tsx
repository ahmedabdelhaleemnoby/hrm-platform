import { useAuth } from '@/contexts/AuthContext';
import React, { ReactNode } from 'react';

interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Check roles
  const hasRole = roles.length === 0 || roles.some((role) => user.roles.includes(role));

  // Check permissions
  const hasPermission =
    permissions.length === 0 ||
    (requireAll
      ? permissions.every((permission) => user.permissions.includes(permission))
      : permissions.some((permission) => user.permissions.includes(permission)));

  if (hasRole && hasPermission) {
    return <>{children}</>;
  }

  return null;
};
