import React, { useState } from 'react';
import { BookOpen, Clock, Users, Plus, Printer, Edit } from 'lucide-react';

const MOCK_TIMETABLE: Record<string, any[]> = {
  'Class X - A': [
    { time: '08:30 - 09:15', mon: 'Mathematics', tue: 'Science', wed: 'English', thu: 'Mathematics', fri: 'Science' },
    { time: '09:15 - 10:00', mon: 'Science', tue: 'Mathematics', wed: 'Hindi', thu: 'Science', fri: 'English' },
    { time: '10:00 - 10:15', mon: 'BREAK', tue: 'BREAK', wed: 'BREAK', thu: 'BREAK', fri: 'BREAK', isBreak: true },
    { time: '10:15 - 11:00', mon: 'English', tue: 'Social Studies', wed: 'Mathematics', thu: 'Hindi', fri: 'Social Studies' },
    { time: '11:00 - 11:45', mon: 'Social Studies', tue: 'Hindi', wed: 'Science', thu: 'English', fri: 'Mathematics' },
    { time: '11:45 - 12:30', mon: 'Physical Ed.', tue: 'Computer Sc.', wed: 'Library', thu: 'Art & Craft', fri: 'Physical Ed.' },
  ],
  'Class X - B': [
    { time: '08:30 - 09:15', mon: 'Science', tue: 'Mathematics', wed: 'Hindi', thu: 'Science', fri: 'English' },
    { time: '09:15 - 10:00', mon: 'Mathematics', tue: 'Science', wed: 'English', thu: 'Mathematics', fri: 'Social Studies' },
    { time: '10:00 - 10:15', mon: 'BREAK', tue: 'BREAK', wed: 'BREAK', thu: 'BREAK', fri: 'BREAK', isBreak: true },
    { time: '10:15 - 11:00', mon: 'Social Studies', tue: 'English', wed: 'Science', thu: 'Social Studies', fri: 'Hindi' },
    { time: '11:00 - 11:45', mon: 'Hindi', tue: 'Social Studies', wed: 'Mathematics', thu: 'Computer Sc.', fri: 'Science' },
    { time: '11:45 - 12:30', mon: 'Library', tue: 'Physical Ed.', wed: 'Art & Craft', thu: 'Physical Ed.', fri: 'Mathematics' },
  ]
};

const MOCK_SUBJECTS = [
  { id: 1, name: 'Mathematics', code: 'MAT101', teacher: 'Suresh Kumar', classes: 'VIII, IX, X' },
  { id: 2, name: 'Science', code: 'SCI102', teacher: 'Dr. Meera Reddy', classes: 'VIII, IX, X' },
  { id: 3, name: 'English', code: 'ENG103', teacher: 'Anita Desai', classes: 'VIII, IX, X' },
  { id: 4, name: 'Social Studies', code: 'SST104', teacher: 'Rajesh Khanna', classes: 'VIII, IX, X' },
  { id: 5, name: 'Hindi', code: 'HIN105', teacher: 'Priya Sharma', classes: 'VIII, IX, X' },
];

export const Academics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [selectedTimetableClass, setSelectedTimetableClass] = useState('Class X - A');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Academic Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage classes, subjects, and timetables.</p>
        </div>
        <button 
          onClick={() => alert("Opening creation modal...")}
          className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-fit mb-6">
        {['classes', 'subjects', 'timetable'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Class X - A', 'Class X - B', 'Class XI - Sci', 'Class XII - Com'].map((cls) => (
            <div key={cls} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-brand-navy">{cls}</h3>
                <span className="bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded font-medium">Active</span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-400" /> 45 Students</div>
                <div className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-slate-400" /> Class Teacher: Dr. Meera</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => alert(`Loading details for ${cls}...`)}
                  className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-slate-700">Select Class:</label>
              <select 
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-48"
                value={selectedTimetableClass}
                onChange={(e) => setSelectedTimetableClass(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Class X - A">Class X - A</option>
                <option value="Class X - B">Class X - B</option>
              </select>
            </div>
            {selectedTimetableClass && (
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center print:hidden"
                >
                  <Printer className="w-4 h-4 mr-2" /> Print
                </button>
                <button 
                  onClick={() => alert('Opening timetable editor...')} 
                  className="px-4 py-2 bg-brand-50 text-brand-800 border border-brand-200 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors flex items-center print:hidden"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Timetable
                </button>
              </div>
            )}
          </div>

          {!selectedTimetableClass ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-brand-navy">No Class Selected</h3>
              <p className="text-slate-500 text-sm mt-1">Please select a class from the dropdown above to view its timetable.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4 border-r border-slate-200">Time</th>
                    <th className="p-4 border-r border-slate-200">Monday</th>
                    <th className="p-4 border-r border-slate-200">Tuesday</th>
                    <th className="p-4 border-r border-slate-200">Wednesday</th>
                    <th className="p-4 border-r border-slate-200">Thursday</th>
                    <th className="p-4">Friday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(MOCK_TIMETABLE[selectedTimetableClass] || MOCK_TIMETABLE['Class X - A']).map((row, idx) => (
                    <tr key={idx} className={row.isBreak ? 'bg-slate-100' : 'hover:bg-slate-50 transition-colors'}>
                      <td className="p-4 border-r border-slate-200 text-sm font-medium text-slate-700 whitespace-nowrap">{row.time}</td>
                      {row.isBreak ? (
                        <td colSpan={5} className="p-4 text-center text-sm font-bold text-slate-500 tracking-widest">BREAK</td>
                      ) : (
                        <>
                          <td className="p-4 border-r border-slate-200 text-sm text-brand-navy font-medium">{row.mon}</td>
                          <td className="p-4 border-r border-slate-200 text-sm text-brand-navy font-medium">{row.tue}</td>
                          <td className="p-4 border-r border-slate-200 text-sm text-brand-navy font-medium">{row.wed}</td>
                          <td className="p-4 border-r border-slate-200 text-sm text-brand-navy font-medium">{row.thu}</td>
                          <td className="p-4 text-sm text-brand-navy font-medium">{row.fri}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-brand-navy">Subject Mapping</h3>
            <button 
              onClick={() => alert('Opening subject creation form...')} 
              className="text-sm bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-medium hover:bg-slate-50 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Subject
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Subject Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Assigned Teacher</th>
                  <th className="p-4">Classes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MOCK_SUBJECTS.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-brand-navy">{sub.name}</td>
                    <td className="p-4 text-sm text-slate-600">{sub.code}</td>
                    <td className="p-4 text-sm text-slate-600">{sub.teacher}</td>
                    <td className="p-4 text-sm text-slate-600">{sub.classes}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => alert(`Editing ${sub.name}...`)} 
                        className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
