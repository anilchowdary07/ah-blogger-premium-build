
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateAdminCredentials: (credentials: AdminCredentials) => void;
  getAdminEmail: () => string;
}

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password123",
  name: "Admin User"
};

const ADMIN_STORAGE_KEY = "ah-blogger-admin-credentials";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    // Load admin credentials from localStorage or use defaults
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse stored admin credentials:", error);
        return DEFAULT_ADMIN;
      }
    }
    return DEFAULT_ADMIN;
  });

  useEffect(() => {
    // Check if user is already logged in using localStorage
    const storedUser = localStorage.getItem("ah-blogger-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("ah-blogger-user");
      }
    }
    setIsLoading(false);
  }, []);

  const updateAdminCredentials = (credentials: AdminCredentials) => {
    setAdminCredentials(credentials);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(credentials));
    toast.success("Admin credentials updated successfully!");
  };

  const getAdminEmail = () => {
    return adminCredentials.email;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate against stored admin credentials
    if (email === adminCredentials.email && password === adminCredentials.password) {
      const userData: User = {
        name: adminCredentials.name,
        email: email,
        isAdmin: true,
      };
      
      setUser(userData);
      localStorage.setItem("ah-blogger-user", JSON.stringify(userData));
      toast.success("Successfully logged in!");
      return true;
    }
    
    toast.error("Invalid credentials. Please try again.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ah-blogger-user");
    toast.success("Successfully logged out");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    updateAdminCredentials,
    getAdminEmail,
  };

  if (isLoading) {
    // You could return a loading spinner here
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
