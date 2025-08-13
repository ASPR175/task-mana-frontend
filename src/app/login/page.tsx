"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password); 
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/dashboard"); 
      } else {
        toast.error("No token received from server");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
   <div className="flex justify-center items-center min-h-screen bg-base-200">
  <form
    onSubmit={handleLogin}
    className="card w-96 bg-base-100 shadow-xl p-6"
  >
    <div className="card-body space-y-4">
      <h1 className="card-title text-2xl justify-center">🔑 Login</h1>

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
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <div className="divider">OR</div>

      <button
        type="button"
        className="btn btn-secondary w-full"
        onClick={() => router.push("/signup")}
      >
        Sign up
      </button>
    </div>
  </form>
</div>

  );
}

