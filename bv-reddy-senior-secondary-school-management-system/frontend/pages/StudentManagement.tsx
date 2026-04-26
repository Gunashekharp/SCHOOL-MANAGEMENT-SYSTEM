import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Download } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { downloadCSV } from '../utils/export';

export const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? student.class === classFilter : true;
    const matchesSection = sectionFilter ? student.section === sectionFilter : true;
    return matchesSearch && matchesClass && matchesSection;
  });

  const handleExport = () => {
    downloadCSV(filteredStudents, 'BVR_Students_List.csv');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Student Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage admissions, profiles, and class assignments.</p>
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
            onClick={() => alert("Opening New Admission Form...")}
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Admission
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or admission no..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <select 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="VIII">Class VIII</option>
            <option value="IX">Class IX</option>
            <option value="X">Class X</option>
            <option value="XI">Class XI</option>
            <option value="XII">Class XII</option>
          </select>
          <select 
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="Sci-B">Sci-B</option>
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
                <th className="p-4">Student</th>
                <th className="p-4">Admission No</th>
                <th className="p-4">Class & Sec</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs mr-3">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-navy">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{student.admissionNo}</td>
                  <td className="p-4 text-sm text-slate-600">{student.class} - {student.section}</td>
                  <td className="p-4 text-sm text-slate-600">{student.rollNo}</td>
                  <td className="p-4">
                    <p className="text-sm text-brand-navy">{student.parentName}</p>
                    <p className="text-xs text-slate-500">{student.contact}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => alert(`Opening options for ${student.name}`)}
                      className="text-slate-400 hover:text-brand-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filteredStudents.length} of {MOCK_STUDENTS.length} entries</span>
          <div className="flex space-x-1">
            <button onClick={() => alert("Loading previous page...")} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Prev</button>
            <button className="px-3 py-1 border border-slate-300 rounded bg-brand-50 text-brand-800 font-medium">1</button>
            <button onClick={() => alert("Loading next page...")} className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
