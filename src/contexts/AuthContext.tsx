
import React, { createContext, useContext, useState, useEffect } from "react";

// Mock data for users
const USERS = [
  {
    id: "1",
    email: "admin@donor.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    bloodGroup: "O+",
    phoneNumber: "555-123-4567",
    address: "123 Main St, New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
    isDonor: true
  },
  {
    id: "2",
    email: "donor@test.com",
    password: "password",
    name: "John Donor",
    role: "user" as const,
    bloodGroup: "B+",
    phoneNumber: "555-987-6543",
    address: "456 Elm St, Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
    isDonor: true
  },
];

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  isDonor: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (userData: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

type RegisterData = {
  email: string;
  password: string;
  name: string;
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  isDonor: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData: RegisterData): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (USERS.some(u => u.email === userData.email)) {
      throw new Error("Email already registered");
    }
    
    // In a real app, this would be an API call to register the user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      email: userData.email,
      name: userData.name,
      role: "user",
      bloodGroup: userData.bloodGroup,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      latitude: userData.latitude,
      longitude: userData.longitude,
      isDonor: userData.isDonor
    };
    
    // Add to mock database
    USERS.push({ ...newUser, password: userData.password });
    
    // Set the current user
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock database
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }
    
    // Remove password before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Set the current user
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update in mock database
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      USERS[userIndex] = { ...USERS[userIndex], ...userData };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
