import React, { useEffect, useState } from "react";
import { getMediaList, deleteMedia } from "../api/mediaApi";

export default function MediaList({ deviceId }) {
  const [media, setMedia] = useState([]);

  const load = async () => {
    const data = await getMediaList(deviceId);
    setMedia(data);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (mediaId) => {
    await deleteMedia(deviceId, mediaId);
    load();
  };

  return (
    <div>
      <h3>Media list</h3>
      {media.map(m => (
        <div key={m.id} style={{marginBottom: 10}}>
          <p>{m.originalName}</p>

          {/* если картинка */}
          {m.contentType?.startsWith("image") && (
            <img src={`http://localhost:8080/api/items/${deviceId}/media/files/${m.filename}`}
                 alt=""
                 width="200"
            />
          )}

          {/* если видео */}
          {m.contentType?.startsWith("video") && (
            <video width="250" controls>
              <source src={`http://localhost:8080/api/items/${deviceId}/media/files/${m.filename}`} />
            </video>
          )}

          {/* если аудио */}
          {m.contentType?.startsWith("audio") && (
            <audio controls>
              <source src={`http://localhost:8080/api/items/${deviceId}/media/files/${m.filename}`} />
            </audio>
          )}

          <button onClick={() => remove(m.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
