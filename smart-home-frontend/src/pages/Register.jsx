import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { post } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await post("/api/register", { username, email, password });
      nav("/login");
    } catch (e) {
      setErr(e?.body?.message || "Register failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {err && <div className="mb-3 text-red-600">{err}</div>}
        <label className="block mb-2 text-sm">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mb-3 border p-2 rounded" />
        <label className="block mb-2 text-sm">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-3 border p-2 rounded" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 border p-2 rounded" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>

        <div className="mt-4 text-sm">
          Already have an account? <Link className="text-blue-600" to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
