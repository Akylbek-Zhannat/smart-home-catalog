import React, { useEffect, useState } from "react";
import { get } from "../api";

export default function TopObjects() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    get("/items", { sort: "activity" }).then(setItems).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Top Active Objects</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>{item.name}</div>
            <div className="text-gray-600">Activity: {item.activity || 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
