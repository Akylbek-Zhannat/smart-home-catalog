export async function uploadMedia(deviceId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`http://localhost:8080/api/items/${deviceId}/media`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer test"
    },
    body: formData
  });

  return res.json();
}

export async function getMediaList(deviceId) {
  const res = await fetch(`http://localhost:8080/api/items/${deviceId}/media`);
  return res.json();
}

export async function deleteMedia(deviceId, mediaId) {
  const res = await fetch(`http://localhost:8080/api/items/${deviceId}/media/${mediaId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer test"
    }
  });
  return res.json();
}
