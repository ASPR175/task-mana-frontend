const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = {
  method?: string;
  body?: any;
  token?: string;
};

export default async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  
  const storedToken = localStorage.getItem("token");
  if (options.token || storedToken) {
    headers["Authorization"] = `Bearer ${options.token || storedToken}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "API request failed");
  }

  return res.json();
}




