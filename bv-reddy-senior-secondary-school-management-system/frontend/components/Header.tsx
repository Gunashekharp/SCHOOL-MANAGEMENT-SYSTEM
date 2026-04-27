import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, UserCircle, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: Role) => {
    void role;
    setIsDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-10 shadow-sm gap-3">
      <div className="flex items-center min-w-0 gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 lg:w-80 border border-slate-200 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full text-brand-navy placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6 flex-shrink-0">
        {/* Academic Year Selector */}
        <div className="hidden md:flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-100">
          <span>AY 2023-24</span>
          <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
        </div>

        {/* Notifications */}
        <button 
          onClick={() => alert("Opening notifications panel...")}
          className="relative p-2 text-slate-400 hover:text-brand-800 transition-colors rounded-full hover:bg-slate-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile & Role Switcher */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center cursor-pointer pl-2 sm:pl-4 border-l border-slate-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-bold border border-brand-200">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-semibold text-brand-navy leading-none">{user.name}</p>
              <p className="text-xs text-brand-600 font-medium mt-1">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role (Demo)</p>
              </div>
              {(['Admin', 'Teacher', 'Student', 'Parent'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                    user.role === role ? 'bg-brand-50 text-brand-800 font-medium' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UserCircle className={`w-4 h-4 mr-3 ${user.role === role ? 'text-brand-600' : 'text-slate-400'}`} />
                  {role} View
                </button>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
