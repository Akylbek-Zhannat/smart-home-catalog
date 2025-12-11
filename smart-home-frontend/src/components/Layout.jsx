import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-6">
        <div className="text-2xl font-bold text-blue-600 mb-6">SmartHome</div>
        <nav className="space-y-2 text-gray-700">
          <Link to="/" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/devices" className="block p-2 rounded hover:bg-gray-100">Devices</Link>
          <Link to="/recommendations" className="block p-2 rounded hover:bg-gray-100">Recommendations</Link>
          <Link to="/subscriptions" className="block p-2 rounded hover:bg-gray-100">Subscriptions</Link>
          <Link to="/analytics" className="block p-2 rounded hover:bg-gray-100">Analytics</Link>
          <Link to="/activity" className="block p-2 rounded hover:bg-gray-100">Activity</Link>
          <Link to="/bookmarks" className="block p-2 rounded hover:bg-gray-100">Bookmarks</Link>
          <Link to="/events" className="block p-2 rounded hover:bg-gray-100">Events</Link>
          <Link to="/achievements" className="block p-2 rounded hover:bg-gray-100">Achievements</Link>
          <Link to="/top-objects" className="block p-2 rounded hover:bg-gray-100">Top Objects</Link>
          <Link to="/templates" className="block p-2 rounded hover:bg-gray-100">Templates</Link>
          <Link to="/items" className="block p-2 rounded hover:bg-gray-100">Items</Link>
        </nav>
        <div className="mt-8">
          <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div className="text-lg">Welcome, <span className="font-semibold">{username}</span></div>
          <div className="text-sm text-gray-600">Smart Home Catalog</div>
        </header>

        <section>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
