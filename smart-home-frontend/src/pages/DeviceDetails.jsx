// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { get } from "../api";
//
// export default function DeviceDetails() {
//   const { id } = useParams();
//   const [device, setDevice] = useState(null);
//
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await get(`/api/devices/${id}`);
//         setDevice(res);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, [id]);
//
//   if (!device) return <div>Loading...</div>;
//
//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <div className="flex gap-6">
//         <div className="w-1/3">
//           {device.imageUrl ? <img src={device.imageUrl} alt={device.name} className="w-full" /> : <div className="h-64 bg-gray-100 flex items-center justify-center">No image</div>}
//         </div>
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold">{device.name}</h1>
//           <p className="mt-4 text-gray-700">{device.description}</p>
//           <div className="mt-6">
//             <div>Price: {device.price}</div>
//             <div>Rating: {device.rating ?? "—"}</div>
//             <div>Author: {device.author?.username ?? "—"}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaUpload from "../components/MediaUpload";
import MediaList from "../components/MediaList";

const API_BASE = "http://localhost:8080";

export default function DeviceDetails() {
  const { id } = useParams();              // id из /devices/:id
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [versions, setVersions] = useState([]);
  const [archiving, setArchiving] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [error, setError] = useState(null);

  // подгружаем данные устройства
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resDevice = await fetch(`${API_BASE}/api/devices/${id}`);
        if (!resDevice.ok) throw new Error("Ошибка загрузки устройства");
        const dev = await resDevice.json();
        setDevice(dev);

        const resStats = await fetch(`${API_BASE}/api/items/${id}/stats`);
        if (resStats.ok) {
          const st = await resStats.json();
          setStats(st);
        }

        const resVers = await fetch(`${API_BASE}/api/items/${id}/versions`);
        if (resVers.ok) {
          const ver = await resVers.json();
          setVersions(ver);
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const token = localStorage.getItem("token");

  const archive = async () => {
    try {
      setArchiving(true);
      const res = await fetch(`${API_BASE}/api/items/${id}/archive`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Не удалось архивировать");
      const updated = { ...(device || {}), archived: true };
      setDevice(updated);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setArchiving(false);
    }
  };

  const revertToVersion = async (versionId) => {
    if (!window.confirm("Точно откатить к этой версии?")) return;
    try {
      setReverting(true);
      const res = await fetch(`${API_BASE}/api/items/${id}/revert/${versionId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Не удалось откатить версию");

      const resDevice = await fetch(`${API_BASE}/api/devices/${id}`);
      if (resDevice.ok) {
        const dev = await resDevice.json();
        setDevice(dev);
      }

    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setReverting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!device) return <div className="p-4">Device not found</div>;

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded shadow">
        <div className="flex gap-6">
          <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
            {device.imageUrl ? (
              <img
                src={device.imageUrl}
                alt={device.name}
                className="object-contain h-full"
              />
            ) : (
              <div className="text-gray-400">No image</div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{device.name}</h1>
            <div className="text-gray-600 mb-2">{device.type}</div>
            <div className="mb-2">Price: <b>{device.price ?? "—"}</b></div>
            <div className="mb-2">Rating: <b>{device.rating ?? "—"}</b></div>
            <div className="mb-2">
              Status:{" "}
              {device.archived ? (
                <span className="text-red-600 font-semibold">ARCHIVED</span>
              ) : (
                <span className="text-green-600 font-semibold">ACTIVE</span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Version: {device.version ?? "—"}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Location: {device.latitude ?? "—"}, {device.longitude ?? "—"}
            </div>

            {!device.archived && (
              <button
                onClick={archive}
                disabled={archiving}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                {archiving ? "Archiving..." : "Archive device"}
              </button>
            )}
          </div>
        </div>

        {device.description && (
          <div className="mt-4 text-gray-700">
            <h2 className="font-semibold mb-1">Description</h2>
            <p>{device.description}</p>
          </div>
        )}
      </section>

      {/* Статистика */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Statistics</h2>
        {stats ? (
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Views</div>
              <div className="text-2xl font-bold">{stats.views ?? 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Rating</div>
              <div className="text-2xl font-bold">{stats.rating ?? "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Archived</div>
              <div className="text-lg">{String(stats.archived)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Version</div>
              <div className="text-2xl font-bold">{stats.version ?? "—"}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No stats available</div>
        )}
      </section>

      {/* Медиа-блок */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Media</h2>
        <MediaUpload
          deviceId={Number(id)}
          onUpload={() => window.location.reload()}
        />
        <div className="mt-4">
          <MediaList deviceId={Number(id)} />
        </div>
      </section>

      {/* Версии */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Versions</h2>
        {versions && versions.length > 0 ? (
          <ul className="space-y-2">
            {versions.map(v => (
              <li
                key={v.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <div className="text-sm">
                    Version: <b>{v.versionNumber}</b>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created at: {v.createdAt}
                  </div>
                </div>
                <button
                  onClick={() => revertToVersion(v.id)}
                  disabled={reverting}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Revert
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">No versions yet</div>
        )}
      </section>
    </div>
  );
}
