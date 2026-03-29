import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Gauge, Flag } from "lucide-react";
import { useApp, Role } from "../../context/AppContext";

export function Register() {
  const navigate = useNavigate();
  const { register, currentUser } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("pilot");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (currentUser) {
    navigate(currentUser.role === "organizer" ? "/organizer/dashboard" : "/events");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const ok = register(fullName, email, password, role);
    if (ok) {
      navigate(role === "organizer" ? "/organizer/dashboard" : "/events");
    } else {
      setErrors({ email: "An account with this email already exists." });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-24">
        <div className="bg-[#1A1A24] rounded-xl p-8 w-full max-w-[480px] border border-[#2A2A35]">
          <div className="text-center mb-8">
            <div className="mb-6">
              <span className="text-white" style={{ fontWeight: 700, fontSize: "28px" }}>Circuit</span>
              <span className="text-[#E8003D]" style={{ fontWeight: 700, fontSize: "28px" }}>X</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
              />
              {errors.fullName && <p className="text-[#E8003D] text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-[#E8003D] text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-[#E8003D] text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-[#E8003D] text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-4">
              <label className="text-[#888888] text-xs mb-3 block">Select Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("pilot")}
                  className={`h-32 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                    role === "pilot"
                      ? "border-[#E8003D] bg-[#E8003D]/5"
                      : "border-[#2A2A35] bg-transparent"
                  }`}
                >
                  <Gauge className={`w-8 h-8 ${role === "pilot" ? "text-[#E8003D]" : "text-[#888888]"}`} />
                  <span className={role === "pilot" ? "text-white" : "text-[#888888]"}>Pilot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`h-32 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                    role === "organizer"
                      ? "border-[#E8003D] bg-[#E8003D]/5"
                      : "border-[#2A2A35] bg-transparent"
                  }`}
                >
                  <Flag className={`w-8 h-8 ${role === "organizer" ? "text-[#E8003D]" : "text-[#888888]"}`} />
                  <span className={role === "organizer" ? "text-white" : "text-[#888888]"}>Organizer</span>
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-6">
              Create Account
            </Button>
          </form>

          <p className="text-center text-[#888888] mt-6" style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" className="text-[#E8003D] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}