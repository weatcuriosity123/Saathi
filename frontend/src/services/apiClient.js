/**
 * API Client — single HTTP gateway for all backend requests.
 *
 * Responsibilities:
 * - Injects Authorization: Bearer <token> on every request
 * - Sends credentials (cookies) so the HttpOnly refresh token is included
 * - On 401: silently calls /auth/refresh-token once, retries original request
 * - On second 401: clears token and redirects to /login
 * - Throws Error with backend's message on any non-OK response
 */

let _accessToken = null;

/** Called by AuthContext after login or silent refresh */
export function setAccessToken(token) {
  _accessToken = token;
}

/** Called by AuthContext on logout */
export function clearAccessToken() {
  _accessToken = null;
}

/** Used by AuthContext to read the token without importing the setter */
export function getAccessToken() {
  return _accessToken;
}

/**
 * Silently refreshes the access token using the HttpOnly refresh cookie.
 * Returns true on success, false if the refresh cookie is expired/missing.
 */
async function _silentRefresh() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      { method: "POST", credentials: "include" }
    );
    if (!res.ok) return false;
    const json = await res.json();
    setAccessToken(json.data.accessToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Core fetch wrapper.
 *
 * @param {string} endpoint  - Path relative to API base, e.g. "/auth/login"
 * @param {RequestInit} options - Standard fetch options (method, body, headers…)
 * @param {boolean} _retry  - Internal flag to prevent infinite refresh loops
 * @returns {Promise<any>} Parsed JSON response body
 */
async function apiClient(endpoint, options = {}, _retry = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    { ...options, headers, credentials: "include" }
  );

  // --- Silent token refresh on 401 ---
  if (res.status === 401 && _retry) {
    const refreshed = await _silentRefresh();
    if (refreshed) {
      // Retry the original request with the new token
      return apiClient(endpoint, options, false);
    }
    // Refresh also failed — user must log in again
    clearAccessToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return;
  }

  // --- Parse error body and throw ---
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let errors = null;
    try {
      const errJson = await res.json();
      message = errJson.message || message;
      errors = errJson.errors || null;
    } catch {
      // response body wasn't JSON — keep default message
    }
    const err = new Error(message);
    err.status = res.status;
    err.errors = errors; // field-level validation errors from backend
    throw err;
  }

  // --- Parse success body ---
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export default apiClient;
