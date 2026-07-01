const BASE = "/api";

function getToken() { return localStorage.getItem("admin_token"); }
function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}
async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const blogAPI = {
  getAll:    ()     => fetch(`${BASE}/blogs`).then(handle),
  getBySlug: (slug) => fetch(`${BASE}/blogs/${slug}`).then(handle),
};

export const authAPI = {
  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),
};

export const analyzeAPI = {
  analyze: (github_url) =>
    fetch(`${BASE}/github/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github_url }),
    }).then(handle),
};

export const adminBlogAPI = {
  getAll:  ()      => fetch(`${BASE}/admin/blogs`,      { headers: authHeaders() }).then(handle),
  getById: (id)    => fetch(`${BASE}/admin/blog/${id}`, { headers: authHeaders() }).then(handle),
  create:  (data)  => fetch(`${BASE}/admin/blogs`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  }).then(handle),
  update:  (id, d) => fetch(`${BASE}/admin/blog/${id}`, {
    method: "PUT",  headers: authHeaders(), body: JSON.stringify(d),
  }).then(handle),
  delete:  (id)    => fetch(`${BASE}/admin/blog/${id}`, {
    method: "DELETE", headers: authHeaders(),
  }).then(handle),
  toggleStatus: (id, current) => fetch(`${BASE}/admin/blog/${id}`, {
    method: "PUT", headers: authHeaders(),
    body: JSON.stringify({ status: current === "published" ? "draft" : "published" }),
  }).then(handle),
};
