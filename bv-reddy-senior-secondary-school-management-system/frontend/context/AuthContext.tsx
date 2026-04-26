import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USERS[0]); // Default to Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, pass: string) => {
    // Simulate Firebase Auth network request delay
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && pass) {
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: Role) => {
    const newUser = MOCK_USERS.find(u => u.role === role);
    if (newUser) {
      setUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
