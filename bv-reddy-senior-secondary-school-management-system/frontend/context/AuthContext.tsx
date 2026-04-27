import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { AuthAccessRequest, AuthMethod, User, Role } from '../types';
import { MOCK_USERS } from '../constants';
import { auth, googleProvider } from '../firebase';

const AUTH_REQUEST_STORAGE_KEY = 'school.authAccessRequests';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  requestPhoneOtp: (phone: string, verifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  authAccessRequests: AuthAccessRequest[];
  setAccessRequestRole: (requestId: string, role: Role) => void;
  approveAccessRequest: (requestId: string) => void;
  rejectAccessRequest: (requestId: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(MOCK_USERS[0]); // Default to Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authAccessRequests, setAuthAccessRequests] = useState<AuthAccessRequest[]>(() => {
    const stored = localStorage.getItem(AUTH_REQUEST_STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as AuthAccessRequest[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(AUTH_REQUEST_STORAGE_KEY, JSON.stringify(authAccessRequests));
  }, [authAccessRequests]);

  const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

  const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser, role: Role): User => {
    const matchedMock = MOCK_USERS.find((mockUser) => {
      if (firebaseUser.email) {
        return mockUser.email.toLowerCase() === firebaseUser.email.toLowerCase();
      }
      return false;
    });

    if (matchedMock) {
      return { ...matchedMock, role };
    }

    const email = firebaseUser.email || `${firebaseUser.uid}@school.local`;
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'School User',
      role,
      email,
      avatar: firebaseUser.photoURL || undefined,
    };
  };

  const getApprovedRequest = (identifier: string) => {
    const normalized = normalizeIdentifier(identifier);
    return authAccessRequests.find(
      (request) =>
        request.identifier.toLowerCase() === normalized &&
        request.status === 'approved',
    );
  };

  const queueAccessRequest = ({
    method,
    identifier,
    displayName,
  }: {
    method: AuthMethod;
    identifier: string;
    displayName: string;
  }) => {
    const normalized = normalizeIdentifier(identifier);

    setAuthAccessRequests((previous) => {
      const alreadyPending = previous.some(
        (request) =>
          request.identifier.toLowerCase() === normalized &&
          request.status === 'pending',
      );

      if (alreadyPending) {
        return previous;
      }

      return [
        {
          id: `REQ-${Date.now()}`,
          method,
          identifier: normalized,
          displayName,
          role: 'Teacher',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        ...previous,
      ];
    });
  };

  const requestApprovalError =
    'Your login request has been sent to Principal Admin for approval.';

  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      throw new Error('Email and password are required.');
    }

    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const firebaseUser = credential.user;
    const matched = MOCK_USERS.find(
      (mockUser) =>
        firebaseUser.email && mockUser.email.toLowerCase() === firebaseUser.email.toLowerCase(),
    );
    const role = matched?.role || 'Teacher';

    setUser(mapFirebaseUserToAppUser(firebaseUser, role));
    setIsAuthenticated(true);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const identifier = normalizeIdentifier(firebaseUser.email || firebaseUser.uid);
    const approvedRequest = getApprovedRequest(identifier);

    if (!approvedRequest) {
      queueAccessRequest({
        method: 'google',
        identifier,
        displayName: firebaseUser.displayName || firebaseUser.email || 'Google User',
      });
      await signOut(auth);
      throw new Error(requestApprovalError);
    }

    setUser(mapFirebaseUserToAppUser(firebaseUser, approvedRequest.role));
    setIsAuthenticated(true);
  };

  const requestPhoneOtp = async (phone: string, verifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phone, verifier);
  };

  const verifyPhoneOtp = async (confirmationResult: ConfirmationResult, code: string) => {
    const verified = await confirmationResult.confirm(code);
    const firebaseUser = verified.user;
    const identifier = normalizeIdentifier(firebaseUser.phoneNumber || firebaseUser.uid);
    const approvedRequest = getApprovedRequest(identifier);

    if (!approvedRequest) {
      queueAccessRequest({
        method: 'phone',
        identifier,
        displayName: firebaseUser.phoneNumber || 'Phone User',
      });
      await signOut(auth);
      throw new Error(requestApprovalError);
    }

    setUser(mapFirebaseUserToAppUser(firebaseUser, approvedRequest.role));
    setIsAuthenticated(true);
  };

  const approveAccessRequest = (requestId: string) => {
    setAuthAccessRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, status: 'approved', reviewedAt: new Date().toISOString() }
          : request,
      ),
    );
  };

  const setAccessRequestRole = (requestId: string, role: Role) => {
    setAuthAccessRequests((previous) =>
      previous.map((request) =>
        request.id === requestId ? { ...request, role } : request,
      ),
    );
  };

  const rejectAccessRequest = (requestId: string) => {
    setAuthAccessRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, status: 'rejected', reviewedAt: new Date().toISOString() }
          : request,
      ),
    );
  };

  const logout = () => {
    void signOut(auth);
    setIsAuthenticated(false);
  };

  const switchRole = (role: Role) => {
    const newUser = MOCK_USERS.find(u => u.role === role);
    if (newUser) {
      setUser(newUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        requestPhoneOtp,
        verifyPhoneOtp,
        authAccessRequests,
        setAccessRequestRole,
        approveAccessRequest,
        rejectAccessRequest,
        logout,
        switchRole,
      }}
    >
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
