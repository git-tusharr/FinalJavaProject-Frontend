import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ padding: "20px" }}>
      <Outlet />
    </div>
  );
}
