import React from 'react';
import { FileBarChart, Download, Calendar, IndianRupee, GraduationCap, Bus } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { MOCK_STUDENTS, MOCK_FEES, MOCK_GRADES } from '../constants';

const ReportCard = ({ title, description, icon: Icon, onDownload }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-brand-50 text-brand-600 rounded-lg group-hover:bg-brand-100 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDownload(); }}
        className="text-slate-400 hover:text-brand-600 transition-colors"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
    <h3 className="text-lg font-semibold text-brand-navy mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

export const Reports: React.FC = () => {
  
  const handleDownloadAttendance = () => {
    downloadCSV(MOCK_STUDENTS.map(s => ({ Name: s.name, Class: s.class, Section: s.section, Attendance: '95%' })), 'Attendance_Report.csv');
  };

  const handleDownloadFees = () => {
    downloadCSV(MOCK_FEES, 'Financial_Fee_Report.csv');
  };

  const handleDownloadAcademic = () => {
    downloadCSV(MOCK_GRADES, 'Academic_Performance_Report.csv');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">System Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate and download comprehensive reports across all modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Attendance Reports" 
          description="Daily, monthly, and term-wise attendance summaries for students and staff."
          icon={Calendar}
          onDownload={handleDownloadAttendance}
        />
        <ReportCard 
          title="Financial & Fee Reports" 
          description="Collection summaries, defaulter lists, and revenue projections."
          icon={IndianRupee}
          onDownload={handleDownloadFees}
        />
        <ReportCard 
          title="Academic Performance" 
          description="Class-wise results, subject averages, and CBSE format report cards."
          icon={GraduationCap}
          onDownload={handleDownloadAcademic}
        />
        <ReportCard 
          title="Transport Logs" 
          description="Route efficiency, fuel consumption, and vehicle maintenance logs."
          icon={Bus}
          onDownload={() => alert("Transport logs data not available for export yet.")}
        />
        <ReportCard 
          title="Custom Analytics" 
          description="Build custom queries and export data to Excel for advanced analysis."
          icon={FileBarChart}
          onDownload={() => alert("Custom analytics builder coming soon.")}
        />
      </div>
    </div>
  );
};
