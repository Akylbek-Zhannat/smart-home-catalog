import React, { useState } from "react";
import { uploadMedia } from "../api/mediaApi";

export default function MediaUpload({ deviceId, onUpload }) {
  const [file, setFile] = useState(null);

  const send = async () => {
    if (!file) return alert("Выберите файл");
    const res = await uploadMedia(deviceId, file);
    onUpload(res);
  };

  return (
    <div>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />
      <button onClick={send}>
        Upload
      </button>
    </div>
  );
}
