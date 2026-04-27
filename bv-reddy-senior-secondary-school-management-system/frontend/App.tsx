import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentManagement } from './pages/StudentManagement';
import { StaffManagement } from './pages/StaffManagement';
import { Attendance } from './pages/Attendance';
import { Academics } from './pages/Academics';
import { Examinations } from './pages/Examinations';
import { FeeManagement } from './pages/FeeManagement';
import { Communication } from './pages/Communication';
import { Transport } from './pages/Transport';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Homework } from './pages/Homework';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-slate-50 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header onMenuClick={() => setIsSidebarOpen(true)} />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/students" element={<StudentManagement />} />
                      <Route path="/staff" element={<StaffManagement />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/academics" element={<Academics />} />
                      <Route path="/homework" element={<Homework />} />
                      <Route path="/exams" element={<Examinations />} />
                      <Route path="/fees" element={<FeeManagement />} />
                      <Route path="/communication" element={<Communication />} />
                      <Route path="/transport" element={<Transport />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
