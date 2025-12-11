import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    nav("/login");
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-semibold">SmartHome</Link>
        {token && <Link to="/devices" className="text-sm">Devices</Link>}
      </div>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <span className="text-sm">Hi, {username}</span>
            <Link to="/notifications" className="text-sm">Notifications</Link>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
