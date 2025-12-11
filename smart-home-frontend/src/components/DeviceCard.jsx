import React from "react";
import { Link } from "react-router-dom";

export default function DeviceCard({ device }) {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {device.imageUrl ? (
          <img src={device.imageUrl} alt={device.name} className="object-contain h-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{device.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{device.description?.slice(0, 100)}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">Price: {device.price ?? "—"}</div>
          <Link to={`/devices/${device.id}`} className="text-blue-600 text-sm">Open</Link>
        </div>
      </div>
    </div>
  );
}
