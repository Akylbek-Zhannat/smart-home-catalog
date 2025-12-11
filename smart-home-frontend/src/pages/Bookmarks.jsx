import React, { useState, useEffect } from "react";
import { get, post, put } from "../api";

export default function Bookmarks() {
  const userId = localStorage.getItem("userId");
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ objectId: "", plannedDate: "", priority: "" });

  async function load() {
    if (!userId) return;
    const res = await get(`/users/${userId}/bookmarks`);
    setList(res);
  }

  async function addBookmark(e) {
    e.preventDefault();
    if (!form.objectId) return;

    try {
      await post(`/users/${userId}/bookmarks`, form);
      setForm({ objectId: "", plannedDate: "", priority: "" });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateBookmark(id, field, value) {
    try {
      await put(`/bookmarks/${id}`, { [field]: value });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>

      <form onSubmit={addBookmark} className="mb-4 bg-gray-100 p-3 rounded space-y-2">
        <input type="number" placeholder="Object ID" value={form.objectId} onChange={e=>setForm({...form, objectId:e.target.value})} className="border p-1 rounded w-full"/>
        <input type="date" placeholder="Planned Date" value={form.plannedDate} onChange={e=>setForm({...form, plannedDate:e.target.value})} className="border p-1 rounded w-full"/>
        <input type="number" placeholder="Priority" value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})} className="border p-1 rounded w-full"/>
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
      </form>

      <div className="space-y-2">
        {list.map(b => (
          <div key={b.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div>Object {b.objectId}</div>
              <div className="text-sm text-gray-600">Planned: {b.plannedDate || "—"} • Priority: {b.priority || "—"}</div>
            </div>
            <div className="flex gap-2">
              <input type="date" value={b.plannedDate || ""} onChange={e=>updateBookmark(b.id, "plannedDate", e.target.value)} className="border p-1 rounded"/>
              <input type="number" value={b.priority || ""} onChange={e=>updateBookmark(b.id, "priority", e.target.value)} className="border p-1 rounded w-16"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
