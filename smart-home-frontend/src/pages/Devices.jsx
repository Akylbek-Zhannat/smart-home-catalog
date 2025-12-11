import React, { useEffect, useState } from "react";
import { get } from "../api";
import DeviceCard from "../components/DeviceCard";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await get("/api/devices", q ? { search: q } : undefined);
      setDevices(res);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Devices</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border p-2 rounded" />
          <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-3 gap-6">
          {devices.length ? devices.map(d => <DeviceCard key={d.id} device={d} />) : <div>No devices</div>}
        </div>
      )}
    </div>
  );
}
