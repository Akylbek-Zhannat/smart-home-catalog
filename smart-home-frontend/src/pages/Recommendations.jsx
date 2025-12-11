import React, { useEffect, useState } from "react";
import { get } from "../api";
import DeviceCard from "../components/DeviceCard";

export default function Recommendations() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // try endpoint: /api/users/{id}/recommendations or a generic /api/recommendations
        const id = localStorage.getItem("userId") ?? "";
        let res;
        try { res = await get(`/api/users/${id}/recommendations`); }
        catch { res = await get("/api/recommendations"); }
        setDevices(res);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <div className="grid grid-cols-3 gap-6">
        {devices.map(d => <DeviceCard key={d.id} device={d} />)}
      </div>
    </div>
  );
}
