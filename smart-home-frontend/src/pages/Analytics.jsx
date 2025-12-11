import React, { useEffect, useState } from "react";
import { get } from "../api";

export default function Analytics(){
  const [stats, setStats] = useState(null);
  useEffect(()=>{ (async ()=>{ try{ const r = await get("/api/analytics"); setStats(r); }catch(e){ console.error(e);} })(); },[]);
  if(!stats) return <div>Loading analytics...</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <pre className="bg-white p-4 rounded shadow">{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
