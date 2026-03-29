import { Outlet } from "react-router";

export function Root() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Outlet />
    </div>
  );
}
