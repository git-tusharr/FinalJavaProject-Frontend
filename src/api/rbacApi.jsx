import api from "./axiosInstance";

// Get permissions for a role
export const getRolePermissions = (roleId) => {
  return api.get(`/rbac/roles/${roleId}/permissions`);
};

// Update permissions for a role
export const updateRolePermissions = (roleId, permissionIds) => {
  return api.put(`/rbac/roles/${roleId}/permissions`, permissionIds);
};
