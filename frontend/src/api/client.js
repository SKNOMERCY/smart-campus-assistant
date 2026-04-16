const DEFAULT_DEV_API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_PROD_API_BASE_URL = "https://smart-campus-assistant-d8i1.onrender.com/api";
const DEFAULT_TIMEOUT_MS = 45000;
const FAQ_TIMEOUT_MS = 60000;
const CHAT_TIMEOUT_MS = 45000;
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

function getDefaultApiBaseUrl() {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return DEFAULT_DEV_API_BASE_URL;
    }
  }

  return DEFAULT_PROD_API_BASE_URL;
}

export function normalizeApiBaseUrl(rawBaseUrl) {
  const fallbackBaseUrl = getDefaultApiBaseUrl();
  const trimmedBaseUrl = rawBaseUrl?.trim() || fallbackBaseUrl;

  try {
    const normalizedUrl = new URL(trimmedBaseUrl);
    const cleanPath = normalizedUrl.pathname.replace(/\/+$/, "");

    normalizedUrl.pathname = cleanPath.endsWith("/api")
      ? cleanPath || "/api"
      : `${cleanPath || ""}/api`;

    return normalizedUrl.toString().replace(/\/$/, "");
  } catch {
    return fallbackBaseUrl;
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

function getTimeoutMessage(path) {
  if (path.startsWith("/chat")) {
    return "The assistant is taking too long to respond. Render may still be waking up. Please try again in a few seconds.";
  }

  return "The backend is taking longer than expected to start. If Render is waking up, please wait a moment and refresh.";
}

function getNetworkErrorMessage() {
  return "I couldn't reach the backend service. Please check the Render deployment URL, CORS settings, and server health.";
}

function delay(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

async function parsePayload(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return response.text().catch(() => "");
  }

  return response.json().catch(() => ({}));
}

async function request(path, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = 0,
    retryDelayMs = 0,
    headers,
    ...fetchOptions
  } = options;

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...fetchOptions,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(headers || {})
        },
        signal: controller.signal
      });

      const payload = await parsePayload(response);

      if (!response.ok) {
        const serverMessage =
          typeof payload === "string" ? payload : payload?.error || payload?.message;
        const error = new Error(
          serverMessage || `Request failed with status ${response.status}.`
        );

        error.status = response.status;

        if (attempt < retries && RETRYABLE_STATUS_CODES.has(response.status)) {
          attempt += 1;

          if (retryDelayMs > 0) {
            await delay(retryDelayMs);
          }

          continue;
        }

        throw error;
      }

      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        lastError = new Error(getTimeoutMessage(path));
      } else if (error instanceof TypeError) {
        lastError = new Error(getNetworkErrorMessage());
      } else {
        lastError = error;
      }

      const shouldRetry =
        error.name === "AbortError" ||
        error instanceof TypeError ||
        RETRYABLE_STATUS_CODES.has(error.status);

      if (attempt < retries && shouldRetry) {
        attempt += 1;

        if (retryDelayMs > 0) {
          await delay(retryDelayMs);
        }

        continue;
      }
    } finally {
      globalThis.clearTimeout(timeoutId);
    }

    break;
  }

  throw lastError || new Error("Something went wrong while contacting the server.");
}

export function fetchFaqDirectory(search = "") {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();
  return request(`/faqs${query ? `?${query}` : ""}`, {
    timeoutMs: FAQ_TIMEOUT_MS,
    retries: 1,
    retryDelayMs: 1200
  });
}

export function sendChatMessage(message) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
    timeoutMs: CHAT_TIMEOUT_MS
  });
}
