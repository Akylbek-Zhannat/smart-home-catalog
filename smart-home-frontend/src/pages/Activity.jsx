import React, { useState, useEffect } from "react";
import { get } from "../api";

export default function Activity() {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  async function loadActivity() {
    if (!userId) return;
    const params = {};
    if (filterType) params.type = filterType;
    if (filterDate) params.date = filterDate;

    try {
      const res = await get(`/users/${userId}/activity`, params);
      setItems(res);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadActivity();
  }, [userId, filterType, filterDate]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Activity</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="text"
          placeholder="Filter by type"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border p-1 rounded"
        />
        <button onClick={loadActivity} className="bg-blue-500 text-white px-3 py-1 rounded">
          Load
        </button>
      </div>

      <ul className="space-y-3">
        {items.map(a => (
          <li key={a.id} className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()} • {a.type}</div>
            <div className="mt-1">{a.details}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
