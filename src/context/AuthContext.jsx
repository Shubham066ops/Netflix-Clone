import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const USERS_STORAGE_KEY = 'netflix_users_v1';
const SESSION_STORAGE_KEY = 'netflix_session_v1';

const AuthContext = createContext(null);

const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readUsers = () => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  return safeJsonParse(raw, []);
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const readSession = () => {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  return safeJsonParse(raw, null);
};

const writeSession = (session) => {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = readSession();
    if (session?.email) {
      const users = readUsers();
      const existing = users.find((u) => u.email === session.email);
      if (existing) {
        setUser({ name: existing.name, email: existing.email });
      } else {
        writeSession(null);
        setUser(null);
      }
    }
  }, []);

  const signup = async ({ name, email, password }) => {
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, message: 'All fields are required.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const nextUsers = [...users, { name: name.trim(), email: normalizedEmail, password }];
    writeUsers(nextUsers);

    writeSession({ email: normalizedEmail });
    setUser({ name: name.trim(), email: normalizedEmail });

    return { ok: true };
  };

  const login = async ({ email, password }) => {
    if (!email?.trim() || !password) {
      return { ok: false, message: 'Email and password are required.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const existing = users.find((u) => u.email === normalizedEmail);

    if (!existing || existing.password !== password) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    writeSession({ email: normalizedEmail });
    setUser({ name: existing.name, email: existing.email });

    return { ok: true };
  };

  const logout = () => {
    writeSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
