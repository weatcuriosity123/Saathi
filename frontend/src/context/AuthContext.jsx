"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient, { setAccessToken, clearAccessToken } from "@/services/apiClient";

/**
 * AuthContext — global authentication state.
 *
 * Provides:
 *  user       - The authenticated user object (null if logged out)
 *  loading    - True while the initial session-restore check is running
 *  isLoggedIn - Boolean shorthand for !!user
 *  login()    - Call after a successful /auth/login or /auth/register response
 *  logout()   - Clears token + cookie, resets user to null
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount: attempt to restore session using the HttpOnly refresh cookie.
   * This handles the case where the user refreshes the browser — the access
   * token (held in memory) is lost, but the cookie is still there.
   */
  useEffect(() => {
    (async () => {
      try {
        // 1. Try to get a fresh access token from the refresh cookie
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { method: "POST", credentials: "include" }
        );

        if (!refreshRes.ok) {
          // No valid cookie — user is logged out
          setLoading(false);
          return;
        }

        const refreshJson = await refreshRes.json();
        setAccessToken(refreshJson.data.accessToken);

        // 2. Fetch the full user profile
        const meJson = await apiClient("/auth/me");
        setUser(meJson.data.user);
      } catch {
        // Any error means we treat the user as logged out
        clearAccessToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Call this immediately after a successful login or register API response.
   * @param {object} userData    - The user object returned by the backend
   * @param {string} accessToken - The access token returned by the backend
   */
  const login = useCallback((userData, accessToken) => {
    setAccessToken(accessToken);
    setUser(userData);
  }, []);

  /**
   * Logs the user out: calls the backend to clear the cookie, then
   * wipes the in-memory token and user state.
   */
  const logout = useCallback(async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch {
      // Even if the request fails, clear local state
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth state anywhere in the app.
 * Must be used inside a component wrapped by AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
