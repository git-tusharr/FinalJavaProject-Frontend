import { useEffect, useState } from "react";
import {
  createPermission,
  getPermissions
} from "../../services/rbacService";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [code, setCode] = useState("");
  const [module, setModule] = useState("");

  const load = async () => {
    const res = await getPermissions();
    setPermissions(res.data);
  };

  const submit = async () => {
    await createPermission({ code, module });
    setCode("");
    setModule("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Permissions</h2>

      <input
        placeholder="permission code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <input
        placeholder="module"
        value={module}
        onChange={e => setModule(e.target.value)}
      />
      <button onClick={submit}>Create</button>

      <ul>
        {permissions.map(p => (
          <li key={p.id}>
            {p.code} ({p.module})
          </li>
        ))}
      </ul>
    </div>
  );
}
