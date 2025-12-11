import React, { useState, useEffect } from "react";
import { get } from "../api";

export default function Items() {
  const [items, setItems] = useState([]);
  const [viewsMin, setViewsMin] = useState("");
  const [updatedAfter, setUpdatedAfter] = useState("");

  async function loadItems() {
    const params = {};
    if (viewsMin) params.views_min = viewsMin;
    if (updatedAfter) params.updated_after = updatedAfter;

    try {
      const res = await get("/items", params);
      setItems(res);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { loadItems(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Items / Filters</h2>

      <div className="mb-4 flex gap-2">
        <input type="number" placeholder="Min views" value={viewsMin} onChange={e=>setViewsMin(e.target.value)} className="border p-1 rounded"/>
        <input type="date" placeholder="Updated after" value={updatedAfter} onChange={e=>setUpdatedAfter(e.target.value)} className="border p-1 rounded"/>
        <button onClick={loadItems} className="bg-blue-500 text-white px-3 py-1 rounded">Load</button>
      </div>

      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="bg-white p-3 rounded shadow">
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-gray-600">Views: {i.views} • Updated: {new Date(i.updatedAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
