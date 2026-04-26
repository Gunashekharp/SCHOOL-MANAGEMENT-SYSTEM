import React, { useState } from 'react';
import { IndianRupee, Receipt, CreditCard, Search } from 'lucide-react';
import { MOCK_FEES } from '../constants';

export const FeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredFees = MOCK_FEES.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? fee.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Fee Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track payments, manage fee structures, and generate receipts.</p>
        </div>
        <button 
          onClick={() => alert("Opening Payment Gateway...")}
          className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Collect Payment
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student or receipt no..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4">Receipt ID</th>
              <th className="p-4">Student</th>
              <th className="p-4">Class</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-medium text-brand-navy">{fee.id}</td>
                <td className="p-4 text-sm text-brand-navy">{fee.studentName}</td>
                <td className="p-4 text-sm text-slate-600">{fee.class}</td>
                <td className="p-4 text-sm text-slate-600">₹{fee.totalAmount.toLocaleString()}</td>
                <td className="p-4 text-sm text-slate-600">₹{fee.paidAmount.toLocaleString()}</td>
                <td className="p-4 text-sm text-slate-600">{fee.dueDate}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fee.status === 'Paid' ? 'bg-brand-green/10 text-brand-green' : 
                    fee.status === 'Pending' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-red-100 text-red-800'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => alert(`Downloading Receipt ${fee.id}...`)}
                    className="text-slate-400 hover:text-brand-800 p-1 rounded-md hover:bg-slate-100 transition-colors" 
                    title="Download Receipt"
                  >
                    <Receipt className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredFees.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No fee records found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
