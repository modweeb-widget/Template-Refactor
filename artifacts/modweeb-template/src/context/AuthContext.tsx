import { createContext, useContext, useState, useCallback } from "react";

export interface User {
  name: string;
  email: string;
  picture: string;
  joinDate: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (data: { name: string; email: string; image: string }) => void;
  logout: () => void;
  updateProfile: (data: { name?: string; picture?: string }) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
});

function readUserFromStorage(): User | null {
  try {
    if (localStorage.getItem("userLoggedIn") !== "true") return null;
    const name = localStorage.getItem("userName");
    if (!name) return null;
    return {
      name,
      email: localStorage.getItem("userEmail") || "",
      picture: localStorage.getItem("userPicture") || "",
      joinDate: localStorage.getItem("userJoinDate") || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(readUserFromStorage);

  const login = useCallback(
    (data: { name: string; email: string; image: string }) => {
      const joinDate =
        localStorage.getItem("userJoinDate") || new Date().toISOString();
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userPicture", data.image);
      localStorage.setItem("userJoinDate", joinDate);
      setUser({
        name: data.name,
        email: data.email,
        picture: data.image,
        joinDate,
      });
    },
    []
  );

  const logout = useCallback(() => {
    [
      "userLoggedIn",
      "userName",
      "userEmail",
      "userPicture",
      "userJoinDate",
      "userSessions",
    ].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: { name?: string; picture?: string }) => {
      if (data.name !== undefined) localStorage.setItem("userName", data.name);
      if (data.picture !== undefined)
        localStorage.setItem("userPicture", data.picture);
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
