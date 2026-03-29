import { Link, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-[#2A2A35] bg-[#0A0A0F]">
      <div className="mx-auto px-8 py-4 flex items-center justify-between max-w-[1400px]">
        <Link to="/" className="flex items-center gap-0">
          <span className="text-white" style={{ fontWeight: 700, fontSize: "20px" }}>Circuit</span>
          <span className="text-[#E8003D]" style={{ fontWeight: 700, fontSize: "20px" }}>X</span>
        </Link>

        <div className="flex items-center gap-8">
          {currentUser?.role === "pilot" && (
            <>
              <Link to="/events" className="text-white hover:text-[#E8003D] transition-colors">
                Browse Events
              </Link>
              <Link to="/garage" className="text-white hover:text-[#E8003D] transition-colors">
                My Garage
              </Link>
              <Link to="/profile" className="text-white hover:text-[#E8003D] transition-colors">
                My Profile
              </Link>
            </>
          )}
          {currentUser?.role === "organizer" && (
            <>
              <Link to="/organizer/dashboard" className="text-white hover:text-[#E8003D] transition-colors">
                My Events
              </Link>
              <Link to="/profile" className="text-white hover:text-[#E8003D] transition-colors">
                My Profile
              </Link>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/login">
                <button className="h-12 px-6 rounded-lg border border-white text-white hover:bg-white hover:text-[#0A0A0F] transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="h-12 px-6 rounded-lg bg-[#E8003D] text-white hover:bg-[#c00034] transition-colors">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="h-12 px-6 rounded-lg border border-white text-white hover:bg-white hover:text-[#0A0A0F] transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}