import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { post } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await post("/api/login", { username, password });
     localStorage.setItem("token", res.token);
     localStorage.setItem("username", res.username ?? username);

     // Получаем userId
     const userData = await get("/api/me");
     localStorage.setItem("userId", userData.id);

      nav("/");
    } catch (e) {
      setErr(e?.body?.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {err && <div className="mb-3 text-red-600">{err}</div>}
        <label className="block mb-2 text-sm">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mb-3 border p-2 rounded" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 border p-2 rounded" />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Signing..." : "Sign in"}
        </button>

        <div className="mt-4 text-sm">
          No account? <Link className="text-blue-600" to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
