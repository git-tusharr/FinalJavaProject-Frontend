import { useEffect, useState } from "react";
import {
  createRole,
  getRoles
} from "../../services/rbacService";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await getRoles();
    setRoles(res.data);
  };

  const submit = async () => {
    await createRole({ name });
    setName("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Roles</h2>

      <input
        placeholder="role name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={submit}>Create</button>

      <ul>
        {roles.map(r => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
