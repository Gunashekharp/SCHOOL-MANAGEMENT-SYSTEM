import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  BookOpen, 
  FileEdit, 
  IndianRupee, 
  MessageSquare, 
  Bus, 
  FileBarChart,
  Settings,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { SchoolBrand } from './SchoolBrand';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles: Role[];
  category: 'core' | 'operations';
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Teacher', 'Student', 'Parent'], category: 'core' },
  { path: '/students', icon: Users, label: 'Student Management', roles: ['Admin'], category: 'core' },
  { path: '/staff', icon: GraduationCap, label: 'Staff Management', roles: ['Admin'], category: 'core' },
  { path: '/attendance', icon: CalendarCheck, label: 'Attendance', roles: ['Admin', 'Teacher', 'Student', 'Parent'], category: 'core' },
  { path: '/academics', icon: BookOpen, label: 'Academics', roles: ['Admin', 'Teacher', 'Student'], category: 'core' },
  { path: '/homework', icon: FileText, label: 'Homework', roles: ['Teacher', 'Student'], category: 'core' },
  { path: '/exams', icon: FileEdit, label: 'Examinations', roles: ['Admin', 'Teacher', 'Student', 'Parent'], category: 'core' },
  
  { path: '/fees', icon: IndianRupee, label: 'Fee Management', roles: ['Admin', 'Parent'], category: 'operations' },
  { path: '/communication', icon: MessageSquare, label: 'Communication', roles: ['Admin', 'Teacher', 'Student', 'Parent'], category: 'operations' },
  { path: '/transport', icon: Bus, label: 'Transport Module', roles: ['Admin'], category: 'operations' },
  { path: '/reports', icon: FileBarChart, label: 'Reports', roles: ['Admin'], category: 'operations' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));
  const coreItems = filteredNavItems.filter(item => item.category === 'core');
  const operationItems = filteredNavItems.filter(item => item.category === 'operations');

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-brand-900 text-slate-300 flex flex-col h-full shadow-xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      {/* Logo Area */}
      <div className="h-24 flex items-center justify-between px-4 bg-white border-b border-slate-200 flex-shrink-0">
        <SchoolBrand size="sm" />
        <button
          type="button"
          className="md:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {coreItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">Core Modules</div>
            {coreItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-800 text-white shadow-md border-l-4 border-brand-gold' 
                      : 'hover:bg-brand-800/50 hover:text-white'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 mr-3 ${({ isActive }: any) => isActive ? 'text-brand-gold' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}

        {operationItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">Operations</div>
            {operationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-800 text-white shadow-md border-l-4 border-brand-gold' 
                      : 'hover:bg-brand-800/50 hover:text-white'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 mr-3 ${({ isActive }: any) => isActive ? 'text-brand-gold' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom Settings (Admin Only) */}
      {user.role === 'Admin' && (
        <div className="p-4 border-t border-brand-800">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-brand-800/50 hover:text-white transition-colors text-sm font-medium"
          >
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            System Settings
          </NavLink>
        </div>
      )}
      </aside>
    </>
  );
};
