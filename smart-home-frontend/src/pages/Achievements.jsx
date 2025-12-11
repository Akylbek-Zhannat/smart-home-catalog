import React, { useState, useEffect } from "react";
import { get, post } from "../api";

export default function Achievements() {
  const userId = localStorage.getItem("userId");
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ title: "", points: 0 });

  async function load() {
    if (!userId) return;
    const res = await get(`/users/${userId}/achievements`);
    setAchievements(res);
  }

  async function add() {
    if (!form.title) return;
    try {
      await post(`/users/${userId}/achievements`, form);
      setForm({ title: "", points: 0 });
      load();
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении достижения");
    }
  }

  useEffect(() => { load(); }, [userId]);

  const totalPoints = achievements.reduce((a,b) => a + (b.points||0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Achievements & Gamification</h2>

      <div className="mb-4 flex gap-2">
        <input type="text" placeholder="Achievement" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-1 rounded"/>
        <input type="number" placeholder="Points" value={form.points} onChange={e => setForm({...form, points: parseInt(e.target.value)})} className="border p-1 rounded w-24"/>
        <button onClick={add} className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
      </div>

      <div className="mb-4">Total Points: {totalPoints}</div>

      <ul className="space-y-2">
        {achievements.map(a => (
          <li key={a.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>{a.title}</div>
            <div className="text-gray-600">{a.points} pts</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
