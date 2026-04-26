import React from 'react';
import { FileEdit, Award, Plus, FileText, Download } from 'lucide-react';
import { MOCK_EXAMS, MOCK_GRADES } from '../constants';
import { useAuth } from '../context/AuthContext';

export const Examinations: React.FC = () => {
  const { user } = useAuth();
  const isStaff = user.role === 'Admin' || user.role === 'Teacher';

  const handlePrint = () => {
    window.print();
  };

  if (!isStaff) {
    // STUDENT / PARENT VIEW: Report Cards
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Academic Results</h1>
            <p className="text-slate-500 text-sm mt-1">View report cards and academic performance.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm print:hidden"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:shadow-none print:border-none">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center print:bg-white">
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Term 1 Examinations</h2>
              <p className="text-sm text-slate-500">Academic Year 2023-24</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Overall Grade</p>
              <p className="text-2xl font-bold text-brand-green">A1</p>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold bg-white">
                <th className="p-4">Subject</th>
                <th className="p-4 text-center">Max Marks</th>
                <th className="p-4 text-center">Marks Obtained</th>
                <th className="p-4 text-center">Grade</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_GRADES.map((grade, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-brand-navy">{grade.subject}</td>
                  <td className="p-4 text-center text-sm text-slate-600">{grade.totalMarks}</td>
                  <td className="p-4 text-center text-sm font-medium text-slate-800">{grade.marksObtained}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 print:border print:border-brand-800">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{grade.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center print:bg-white">
            * Grades are calculated as per CBSE guidelines.
          </div>
        </div>
      </div>
    );
  }

  // ADMIN / TEACHER VIEW: Exam Management
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Examinations & Grading</h1>
          <p className="text-slate-500 text-sm mt-1">Manage exams, enter marks, and generate CBSE compliant report cards.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => alert("Downloading CBSE Guidelines PDF...")}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center shadow-sm"
          >
            <Award className="w-4 h-4 mr-2" />
            CBSE Guidelines
          </button>
          <button 
            onClick={() => alert("Opening Exam Creation Form...")}
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-brand-100 text-brand-600 rounded-lg mr-4"><FileEdit className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Exams</p>
            <p className="text-2xl font-bold text-brand-navy">2</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg mr-4"><FileText className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending Marks Entry</p>
            <p className="text-2xl font-bold text-brand-navy">14</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-brand-navy">Exam Schedule</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4">Exam Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Classes</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {MOCK_EXAMS.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-brand-navy">{exam.name}</td>
                <td className="p-4 text-sm text-slate-600">{exam.type}</td>
                <td className="p-4 text-sm text-slate-600">{exam.classes.join(', ')}</td>
                <td className="p-4 text-sm text-slate-600">{exam.startDate} to {exam.endDate}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    exam.status === 'Completed' ? 'bg-brand-green/10 text-brand-green' : 
                    exam.status === 'Ongoing' ? 'bg-brand-100 text-brand-800' : 'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => alert(`Opening module for ${exam.name}...`)}
                    className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                  >
                    {exam.status === 'Completed' ? 'Generate Reports' : 'Enter Marks'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
