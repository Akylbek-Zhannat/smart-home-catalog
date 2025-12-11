import React from "react";
import MediaUploader from "../components/MediaUpload";
import MediaList from "../components/MediaList";

export default function MediaTest() {

  const deviceId = 7; // временно для теста

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Media Test</h1>

      <MediaUploader
        deviceId={deviceId}
        onUpload={() => window.location.reload()}
      />

      <div className="mt-6">
        <MediaList deviceId={deviceId} />
      </div>
    </div>
  );
}
