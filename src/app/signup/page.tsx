"use client";

import { useState, useEffect } from "react";
import { signup } from "@/lib/auth";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // 🚨 Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(email, password);
      toast.success("Signup successful!");

      if (res?.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
        router.replace("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // 🛑 Don’t render form if logged in
  if (isAuthenticated) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">📝 Sign Up</h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={() => router.push("/login")}
            className="btn btn-outline w-full"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}


