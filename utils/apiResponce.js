const BASE_URL = "http://localhost:5000/api";

const isUsableToken = (value) => {
  if (!value) return false;
  const token = String(value).trim();
  return token !== "" && token !== "undefined" && token !== "null";
};

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const rawToken =
      typeof window !== "undefined"
        ? localStorage.getItem("farmizo_token") || localStorage.getItem("token")
        : null;
    const token = isUsableToken(rawToken) ? String(rawToken).trim() : null;

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
      ...options,
    });

    const json = await res.json();

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("farmizo_token");
        localStorage.removeItem("token");
      }

      throw new Error(json.message || "API request failed");
    }

    // 🔥 IMPORTANT: return only actual data
    return json.data;
  } catch (error) {
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : { message: await res.text() };

    console.error("❌ API Fetch Error:", data.message);
    throw error;
  }
}
