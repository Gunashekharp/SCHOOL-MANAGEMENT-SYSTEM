import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Download, Mail } from 'lucide-react';
import { MOCK_STAFF } from '../constants';
import { downloadCSV } from '../utils/export';

export const StaffManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredStaff = MOCK_STAFF.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? staff.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    downloadCSV(filteredStaff, 'BVR_Staff_List.csv');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Staff Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage teacher profiles, subject allocation, and attendance.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => alert("Opening Add Staff Form...")}
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or department..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <select 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
            <option value="Support">Support</option>
          </select>
          <button 
            onClick={() => alert("Advanced filters applied.")}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Emp ID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs mr-3">
                        {staff.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-brand-navy">{staff.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{staff.empId}</td>
                  <td className="p-4 text-sm text-slate-600">{staff.role}</td>
                  <td className="p-4 text-sm text-slate-600">{staff.department}</td>
                  <td className="p-4 text-sm text-slate-600">{staff.contact}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      staff.status === 'Active' ? 'bg-brand-green/10 text-brand-green' : 
                      staff.status === 'On Leave' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end space-x-2">
                    <button 
                      onClick={() => alert(`Opening email composer for ${staff.name}...`)}
                      className="text-slate-400 hover:text-brand-500 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => alert(`Opening options for ${staff.name}...`)}
                      className="text-slate-400 hover:text-brand-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No staff found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
