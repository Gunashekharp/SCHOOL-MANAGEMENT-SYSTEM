import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Save, Users } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';

export const Attendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('X-A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local state to track attendance marks: 'present', 'absent', 'late'
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, string>>({});

  const classStudents = MOCK_STUDENTS.filter(s => `${s.class}-${s.section}` === selectedClass || selectedClass === 'X-A');

  const handleMark = (studentId: string, status: string) => {
    setAttendanceMarks(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    alert(`Attendance for ${selectedClass} on ${date} saved successfully!`);
  };

  // Calculate stats based on local state (defaulting to present if unmarked for demo purposes)
  const presentCount = classStudents.filter(s => attendanceMarks[s.id] === 'present' || !attendanceMarks[s.id]).length;
  const absentCount = classStudents.filter(s => attendanceMarks[s.id] === 'absent').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Daily Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Mark and track student attendance. Parents will be notified automatically.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Attendance
        </button>
      </div>

      {/* Controls & Summary */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">Class & Section:</label>
            <select 
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="X-A">Class X - A</option>
              <option value="X-B">Class X - B</option>
              <option value="XII-Sci">Class XII - Science</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">Date:</label>
            <div className="relative">
              <input 
                type="date" 
                className="border border-slate-300 rounded-lg pl-3 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex space-x-6 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-brand-navy">{classStudents.length}</p>
          </div>
          <div>
            <p className="text-xs text-brand-green font-medium uppercase tracking-wider">Present</p>
            <p className="text-xl font-bold text-brand-green">{presentCount}</p>
          </div>
          <div>
            <p className="text-xs text-red-500 font-medium uppercase tracking-wider">Absent</p>
            <p className="text-xl font-bold text-red-500">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-brand-navy flex items-center"><Users className="w-4 h-4 mr-2"/> Student Roster</h3>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-green mr-2"></span> Present</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Absent</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-gold mr-2"></span> Late</div>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4 w-16">Roll</th>
              <th className="p-4">Student Name</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Remarks (Optional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {classStudents.map((student) => {
              const status = attendanceMarks[student.id] || 'present'; // Default to present
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600 font-medium">{student.rollNo}</td>
                  <td className="p-4 text-sm font-medium text-brand-navy">{student.name}</td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleMark(student.id, 'present')}
                        className={`p-2 rounded-full transition-colors ${status === 'present' ? 'bg-brand-green/20 text-brand-green' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleMark(student.id, 'absent')}
                        className={`p-2 rounded-full transition-colors ${status === 'absent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleMark(student.id, 'late')}
                        className={`p-2 rounded-full transition-colors ${status === 'late' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <input type="text" placeholder="Add note..." className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none placeholder-slate-400" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
