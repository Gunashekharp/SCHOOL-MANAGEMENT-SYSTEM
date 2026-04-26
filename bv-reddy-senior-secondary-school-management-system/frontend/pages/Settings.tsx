import React, { useState } from 'react';
import { Shield, Users, Building, Plus, X, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { authAccessRequests, setAccessRequestRole, approveAccessRequest, rejectAccessRequest } = useAuth();
  
  // Security State
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [strongPasswords, setStrongPasswords] = useState(true);

  // Roles State
  const [rolesList, setRolesList] = useState([
    { id: 1, name: 'Admin', users: 3, access: 'Full System Access' },
    { id: 2, name: 'Teacher', users: 85, access: 'Academics, Attendance, Homework' },
    { id: 3, name: 'Student', users: 2450, access: 'View Only (Self)' },
    { id: 4, name: 'Parent', users: 4120, access: 'View Only (Child), Payments' },
    { id: 5, name: 'Transport Manager', users: 4, access: 'Transport Module Only' }
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', access: '' });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.name && newRole.access) {
      setRolesList([...rolesList, { 
        id: Date.now(), 
        name: newRole.name, 
        access: newRole.access, 
        users: 0 
      }]);
      setShowRoleModal(false);
      setNewRole({ name: '', access: '' });
    }
  };

  const handleDeleteRole = (id: number) => {
    setRolesList(rolesList.filter(role => role.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">System Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure school details, roles, and system preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'general' ? 'text-brand-800 border-b-2 border-brand-800 bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building className="w-4 h-4 mr-2" /> General
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-4 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'roles' ? 'text-brand-800 border-b-2 border-brand-800 bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Roles & Access
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'security' ? 'text-brand-800 border-b-2 border-brand-800 bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Shield className="w-4 h-4 mr-2" /> Security
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                <input type="text" defaultValue="BV Reddy Senior Secondary School" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Affiliation Number (CBSE)</label>
                <input type="text" defaultValue="1234567" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" rows={3} defaultValue="123 Education Lane, Knowledge City"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Academic Year</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                  <option>2023-2024</option>
                  <option>2024-2025</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-brand-navy">Role Permissions</h3>
                <button 
                  onClick={() => setShowRoleModal(true)} 
                  className="bg-brand-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-900 transition-colors shadow-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Custom Role
                </button>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Role Name</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Users</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Access Level</th>
                        <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rolesList.map(role => (
                        <tr key={role.id} className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-brand-navy">{role.name}</td>
                          <td className="p-4 text-sm text-slate-600">{role.users}</td>
                          <td className="p-4 text-sm text-slate-600">{role.access}</td>
                          <td className="p-4 text-right space-x-3">
                            <button 
                              onClick={() => alert(`Editing permissions for ${role.name}`)} 
                              className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            {role.users === 0 && (
                              <button 
                                onClick={() => handleDeleteRole(role.id)} 
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-brand-navy">Security Policies</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-navy">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-slate-500">Require 2FA for all staff and admin accounts.</p>
                  </div>
                  <button 
                    onClick={() => setMfaEnabled(!mfaEnabled)} 
                    className={`w-12 h-6 rounded-full transition-colors relative ${mfaEnabled ? 'bg-brand-green' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${mfaEnabled ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-navy">Enforce Strong Passwords</p>
                    <p className="text-sm text-slate-500">Require minimum 8 characters, numbers, and symbols.</p>
                  </div>
                  <button 
                    onClick={() => setStrongPasswords(!strongPasswords)} 
                    className={`w-12 h-6 rounded-full transition-colors relative ${strongPasswords ? 'bg-brand-green' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${strongPasswords ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-navy">Auto-Logout</p>
                    <p className="text-sm text-slate-500">Automatically log out inactive users after 30 minutes.</p>
                  </div>
                  <button 
                    onClick={() => setAutoLogout(!autoLogout)} 
                    className={`w-12 h-6 rounded-full transition-colors relative ${autoLogout ? 'bg-brand-green' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoLogout ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-brand-navy">Principal Admin Control: Auth Requests</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Pending: {authAccessRequests.filter((request) => request.status === 'pending').length}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Identifier</th>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Requested</th>
                          <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {authAccessRequests.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-4 text-sm text-slate-500 text-center">
                              No authentication access requests yet.
                            </td>
                          </tr>
                        ) : (
                          authAccessRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-slate-50">
                              <td className="p-3 text-sm text-slate-700 capitalize">{request.method}</td>
                              <td className="p-3 text-sm text-slate-700">{request.displayName}</td>
                              <td className="p-3 text-sm text-slate-600">{request.identifier}</td>
                              <td className="p-3 text-sm text-slate-700">
                                {request.status === 'pending' ? (
                                  <select
                                    value={request.role}
                                    onChange={(e) => setAccessRequestRole(request.id, e.target.value as 'Admin' | 'Teacher' | 'Student' | 'Parent')}
                                    className="border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                                  >
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Admin">Admin</option>
                                  </select>
                                ) : (
                                  request.role
                                )}
                              </td>
                              <td className="p-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs border ${
                                    request.status === 'approved'
                                      ? 'bg-green-50 text-green-700 border-green-200'
                                      : request.status === 'rejected'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-slate-600">{new Date(request.createdAt).toLocaleString()}</td>
                              <td className="p-3 text-right">
                                {request.status === 'pending' ? (
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      onClick={() => approveAccessRequest(request.id)}
                                      className="inline-flex items-center text-green-700 hover:text-green-800 text-sm font-medium"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button
                                      onClick={() => rejectAccessRequest(request.id)}
                                      className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-500">Reviewed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => alert('Downloading Security Audit Log...')} 
                  className="text-brand-800 border border-brand-200 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Download Audit Log
                </button>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button 
              onClick={() => alert("Settings updated successfully!")}
              className="bg-brand-800 hover:bg-brand-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-brand-navy">Create Custom Role</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Librarian"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Level Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Library Module Only"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  value={newRole.access}
                  onChange={(e) => setNewRole({...newRole, access: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
