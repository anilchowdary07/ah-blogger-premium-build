
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you'd validate against a backend
    // For demo, we'll use hardcoded admin credentials
    if (email === "admin@example.com" && password === "password123") {
      const userData: User = {
        name: "Admin User",
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
