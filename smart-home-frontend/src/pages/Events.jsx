import React, { useState, useEffect } from "react";
import { get, post, put, del } from "../api";

export default function Events() {
  const userId = localStorage.getItem("userId");
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", datetime: "", objectId: "", description: "", priority: "" });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  async function loadEvents() {
    if (!userId) return;
    try {
      const res = await get(`/events?user_id=${userId}&date=${selectedDate}`);
      console.log(res);
      setEvents(res);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveEvent(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await put(`/events/${form.id}`, { ...form, userId: parseInt(userId) });
      } else {
        await post("/events", { ...form, userId: parseInt(userId) });
      }
      setForm({ title: "", datetime: "", objectId: "", description: "", priority: "" });
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteEvent(id) {
    try {
      await del(`/events/${id}`);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [selectedDate]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Events Calendar</h2>

      <div className="mb-4 flex gap-2">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border p-1 rounded"/>
        <button onClick={loadEvents} className="bg-blue-500 text-white px-3 py-1 rounded">Load</button>
      </div>

      <form onSubmit={saveEvent} className="mb-4 bg-gray-100 p-3 rounded space-y-2">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-1 rounded w-full"/>
        <input type="datetime-local" placeholder="Date & Time" value={form.datetime} onChange={e => setForm({...form, datetime: e.target.value})} className="border p-1 rounded w-full"/>
        <input type="number" placeholder="Object ID" value={form.objectId} onChange={e => setForm({...form, objectId: e.target.value})} className="border p-1 rounded w-full"/>
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-1 rounded w-full"/>
        <input type="number" placeholder="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="border p-1 rounded w-full"/>
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">{form.id ? "Update" : "Add"}</button>
      </form>

      <div className="space-y-2">
        {events.map(ev => (
          <div key={ev.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{ev.title} (Object {ev.objectId})</div>
              <div className="text-sm">{new Date(ev.datetime).toLocaleString()}</div>
              <div className="text-sm text-gray-600">{ev.description}</div>
              <div className="text-sm text-gray-600">Priority: {ev.priority}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(ev)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => deleteEvent(ev.id)} className="bg-red-500 px-2 py-1 rounded text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
