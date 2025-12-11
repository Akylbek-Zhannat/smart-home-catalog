//const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
//
//function authHeaders() {
//  const token = localStorage.getItem("token");
//  return token ? { Authorization: `Bearer ${token}` } : {};
//}
//
//export async function post(path, body) {
//  const res = await fetch(BASE_URL + path, {
//    method: "POST",
//    headers: { "Content-Type": "application/json", ...authHeaders() },
//    body: JSON.stringify(body),
//  });
//  const json = await res.json().catch(() => ({}));
//  if (!res.ok) throw { status: res.status, body: json };
//  return json;
//}
//
//export async function get(path, params) {
//  let url = BASE_URL + path;
//  if (params) {
//    const q = new URLSearchParams(params);
//    url += "?" + q.toString();
//  }
//  const res = await fetch(url, { headers: { ...authHeaders() } });
//  const json = await res.json().catch(() => ({}));
//  if (!res.ok) throw { status: res.status, body: json };
//  return json;
//}
//
//export async function postForm(path, formData) {
//  const res = await fetch(BASE_URL + path, {
//    method: "POST",
//    headers: { ...authHeaders() }, // do not set content-type
//    body: formData,
//  });
//  const json = await res.json().catch(() => ({}));
//  if (!res.ok) throw { status: res.status, body: json };
//  return json;
//}
//export async function put(path, body) {
//  const res = await fetch(BASE_URL + path, {
//    method: "PUT",
//    headers: { "Content-Type": "application/json", ...authHeaders() },
//    body: body ? JSON.stringify(body) : undefined,
//  });
//  const json = await res.json().catch(() => ({}));
//  if (!res.ok) throw { status: res.status, body: json };
//  return json;
//}
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function get(path, params) {
  let url = BASE_URL + path;
  if (params) {
    const q = new URLSearchParams(params);
    url += "?" + q.toString();
  }
  const res = await fetch(url, { headers: { ...authHeaders() } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}

export async function post(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}

export async function put(path, body) {
  const res = await fetch(BASE_URL + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}

export async function del(path) {
  const res = await fetch(BASE_URL + path, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  return json;
}
