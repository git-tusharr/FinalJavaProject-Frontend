import { useState } from "react";
import { authController } from "../../controllers/authController";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await authController.forgotPassword({ email });
    alert("Reset link sent");
  };

  return (
    <>
      <h2>Forgot Password</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={submit}>Send Link</button>
    </>
  );
}
