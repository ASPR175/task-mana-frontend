
import apiFetch from "@/lib/api";

export async function login(email: string, password: string) {
  const res = await apiFetch("/api/user/login", {
    method: "POST",
    body: { email, password },
  });

  if (res.token) {
    localStorage.setItem("token", res.token); // store token
  }

  return res;
}

export async function signup(email: string, password: string) {
  const res = await apiFetch("/api/user/signup", {
    method: "POST",
    body: { email, password },
  });

  if (res.token) {
    localStorage.setItem("token", res.token);
  }

  return res;
}

export async function logout() {
  localStorage.removeItem("token"); // remove token
  return apiFetch("/api/user/logout", { method: "POST" });
}
