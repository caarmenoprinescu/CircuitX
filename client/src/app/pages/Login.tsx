import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useApp } from "../../context/AppContext";

export function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser) {
    navigate(currentUser.role === "organizer" ? "/organizer/dashboard" : "/events");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    const ok = login(email, password);
    if (ok) {
      navigate(currentUser?.role === "organizer" ? "/organizer/dashboard" : "/events");
    } else {
      setError("Invalid email or password.");
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
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && <p className="text-[#E8003D] text-sm">{error}</p>}
            <Button type="submit" variant="primary" className="w-full mt-6">
              Log In
            </Button>
          </form>

          <p className="text-center text-[#888888] mt-6" style={{ fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-[#E8003D] hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-6 p-3 bg-[#0A0A0F] rounded-lg border border-[#2A2A35]">
            <p className="text-[#888888] text-xs mb-1">Test accounts:</p>
            <p className="text-[#888888] text-xs">Pilot: pilot@test.com / test123</p>
            <p className="text-[#888888] text-xs">Organizer: org@test.com / test123</p>
          </div>
        </div>
      </div>
    </div>
  );
}