import { useEffect, useState } from "react";
import {
  getRoles,
  getPermissions,
  assignPermissionsToRole
} from "../../services/rbacService";

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getRoles().then(res => setRoles(res.data));
    getPermissions().then(res => setPermissions(res.data));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const save = async () => {
    await assignPermissionsToRole(roleId, selected);
    alert("Permissions updated");
  };

  return (
    <div>
      <h2>Assign Permissions</h2>

      <select onChange={e => setRoleId(e.target.value)}>
        <option value="">Select Role</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      {permissions.map(p => (
        <div key={p.id}>
          <input
            type="checkbox"
            onChange={() => toggle(p.id)}
          />
          {p.code}
        </div>
      ))}

      <button disabled={!roleId} onClick={save}>Save</button>
    </div>
  );
}
