import { useState } from "react";
import { assignRoleToUser } from "../../services/rbacService";

export default function AssignRole() {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");

  const submit = async () => {
    await assignRoleToUser(userId, roleId);
    alert("Role assigned");
  };

  return (
    <div>
      <h2>Assign Role to User</h2>

      <input
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <input
        placeholder="Role ID"
        value={roleId}
        onChange={e => setRoleId(e.target.value)}
      />

      <button onClick={submit}>Assign</button>
    </div>
  );
}
