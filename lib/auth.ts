"use client";

import { useState, useEffect } from "react";
import type { User } from "@/lib/types";

// JWT token handling
const TOKEN_KEY = "taskmaster_token";
const USER_KEY = "taskmaster_user";

export async function signUp(userData: {
  name: string;
  email: string;
  password: string;
  country: string;
}): Promise<void> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to sign up");
  }

  return Promise.resolve();
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Invalid email or password");
  }

  const data = await response.json();

  // Store token and user data
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  // Return a resolved promise to indicate success
  return Promise.resolve();
}

export async function logout(): Promise<void> {
  // Clear token and user data
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  return Promise.resolve();
}

export async function checkAuth(): Promise<boolean> {
  // Check if token exists
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return false;
  }

  // Verify token with the server
  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Clear invalid token
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return false;
    }

    const data = await response.json();
    
    if (data.authenticated && data.user) {
      // Update stored user data
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}

// Custom hook to get the current user
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    loadUser();

    // Listen for storage events (for multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { user, loading };
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
