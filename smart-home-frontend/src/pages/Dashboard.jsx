import React, { useEffect, useState } from "react";
import { get } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get("/api/devices/stats");
        setStats(res);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">Total devices</div>
          <div className="text-2xl font-semibold">{stats?.total_devices ?? "—"}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">Average rating</div>
          <div className="text-2xl font-semibold">{stats?.average_rating ?? "—"}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">Top authors</div>
          <ul className="mt-2">
            {stats?.top_authors && Object.entries(stats.top_authors).map(([k,v]) => (
              <li key={k} className="text-sm">{k} — {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
