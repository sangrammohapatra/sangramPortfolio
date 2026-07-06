const BASE = "/api";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const blogAPI = {
  getAll:    ()     => fetch(`${BASE}/blogs`).then(handle),
  getBySlug: (slug) => fetch(`${BASE}/blogs/${slug}`).then(handle),
};

// Admin session lives in an httpOnly cookie, so every admin request needs
// credentials: "include" instead of an Authorization header the JS can read.
export const authAPI = {
  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: JSON_HEADERS,
      body: JSON.stringify({ username, password }),
    }).then(handle),
  logout: () =>
    fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" }).then(handle),
  me: () =>
    fetch(`${BASE}/auth/me`, { credentials: "include" }).then(handle),
};

export const analyzeAPI = {
  analyze: (github_url) =>
    fetch(`${BASE}/github/analyze`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ github_url }),
    }).then(handle),
};

export const adminBlogAPI = {
  getAll:  ()      => fetch(`${BASE}/admin/blogs`,      { credentials: "include" }).then(handle),
  getById: (id)    => fetch(`${BASE}/admin/blog/${id}`, { credentials: "include" }).then(handle),
  create:  (data)  => fetch(`${BASE}/admin/blogs`, {
    method: "POST", credentials: "include", headers: JSON_HEADERS, body: JSON.stringify(data),
  }).then(handle),
  update:  (id, d) => fetch(`${BASE}/admin/blog/${id}`, {
    method: "PUT",  credentials: "include", headers: JSON_HEADERS, body: JSON.stringify(d),
  }).then(handle),
  delete:  (id)    => fetch(`${BASE}/admin/blog/${id}`, {
    method: "DELETE", credentials: "include",
  }).then(handle),
  toggleStatus: (id, current) => fetch(`${BASE}/admin/blog/${id}`, {
    method: "PUT", credentials: "include", headers: JSON_HEADERS,
    body: JSON.stringify({ status: current === "published" ? "draft" : "published" }),
  }).then(handle),
};
