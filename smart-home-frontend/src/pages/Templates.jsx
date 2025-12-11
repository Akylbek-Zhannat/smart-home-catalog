import React, { useState, useEffect } from "react";
import { get, post } from "../api";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  async function load() {
    const res = await get("/templates");
    setTemplates(res);
  }

  async function createTemplate() {
    if (!form.name) return;
    await post("/templates", form);
    setForm({ name: "", description: "" });
    load();
  }

  async function createFromTemplate(id) {
    await post(`/items/from_template/${id}`);
    alert("Item created from template");
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Templates</h2>

      <div className="mb-4 flex gap-2">
        <input type="text" placeholder="Template Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-1 rounded"/>
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-1 rounded"/>
        <button onClick={createTemplate} className="bg-green-500 text-white px-3 py-1 rounded">Create</button>
      </div>

      <ul className="space-y-2">
        {templates.map(t => (
          <li key={t.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-gray-600">{t.description}</div>
            </div>
            <button onClick={() => createFromTemplate(t.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Create Item</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
