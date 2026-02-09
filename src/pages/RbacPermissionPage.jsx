import { useEffect, useState } from "react";
import {
  getRolePermissions,
  updateRolePermissions
} from "../api/rbacApi";
import RoleSelector from "../components/RoleSelector";

export default function RbacPermissionPage() {

  const [roleId, setRoleId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // ✅ Read roles from JWT (stored by interceptor)
  const currentUserRoles =
    JSON.parse(localStorage.getItem("roles") || "[]");

  // ✅ RBAC-aware role visibility
  const roles =
    currentUserRoles.includes("SUPER_ADMIN")
      ? [
          { id: 2, name: "ADMIN" },
          { id: 1, name: "SELLER" }
        ]
      : currentUserRoles.includes("ADMIN")
        ? [
            { id: 1, name: "SELLER" }
          ]
        : [];

  // ✅ Prevent invalid role selection
  const onRoleChange = (id) => {
    if (currentUserRoles.includes("ADMIN") && id === 2) {
      alert("Only SUPER_ADMIN can manage ADMIN role");
      return;
    }
    setRoleId(id);
  };

  // 🔄 Load permissions when role changes
  useEffect(() => {
    if (!roleId) return;

    setLoading(true);

    getRolePermissions(roleId)
      .then(res => {
        setPermissions(res.data);

        const assigned = new Set();
        Object.values(res.data)
          .flat()
          .forEach(p => p.assigned && assigned.add(p.id));

        setSelected(assigned);
      })
      .catch(() => {
        alert("You are not allowed to manage this role");
        setPermissions({});
        setSelected(new Set());
      })
      .finally(() => setLoading(false));

  }, [roleId]);

  // 🔁 Toggle permission
  const togglePermission = (id) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  // 💾 Save permissions
  const savePermissions = () => {
    updateRolePermissions(roleId, Array.from(selected))
      .then(() => alert("Permissions updated successfully"))
      .catch(() => alert("Update failed"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h2>Role Permission Management</h2>

      <RoleSelector
        roles={roles}
        value={roleId}
        onChange={onRoleChange}
      />

      {!roleId && <p>Please select a role</p>}

      {loading && <p>Loading permissions...</p>}

      {!loading && roleId && Object.entries(permissions).map(([module, perms]) => (
        <div
          key={module}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px"
          }}
        >
          <h4>{module}</h4>

          {perms.map(p => (
            <label
              key={p.id}
              style={{ display: "block", cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                disabled={p.disabled}
                onChange={() => togglePermission(p.id)}
              />{" "}
              {p.code}
            </label>
          ))}
        </div>
      ))}

      {roleId && (
        <button
          onClick={savePermissions}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
