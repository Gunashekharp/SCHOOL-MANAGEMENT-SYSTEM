import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, GraduationCap, IndianRupee, TrendingUp, Calendar, BookOpen, 
  Clock, BellRing, FileEdit, Activity, MapPin, CreditCard, FileText, ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  MOCK_STATS, ATTENDANCE_DATA, FEE_COLLECTION_DATA, MOCK_HOMEWORK, 
  MOCK_ACTIVITIES, MOCK_EVENTS, MOCK_GRADES 
} from '../constants';
import { useAuth } from '../context/AuthContext';
import { downloadCSV } from '../utils/export';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-brand-navy">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-brand-green' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </p>
      )}
    </div>
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleGenerateReport = () => {
    const reportData = [
      { Metric: 'Total Students', Value: MOCK_STATS.totalStudents },
      { Metric: 'Total Staff', Value: MOCK_STATS.totalStaff },
      { Metric: 'Attendance Today (%)', Value: MOCK_STATS.attendanceToday },
      { Metric: 'Fees Collected (INR)', Value: MOCK_STATS.feeCollected },
      { Metric: 'Fees Pending (INR)', Value: MOCK_STATS.feePending },
    ];
    downloadCSV(reportData, 'BVR_System_Summary_Report.csv');
  };

  // --- ADMIN DASHBOARD ---
  if (user.role === 'Admin') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Admin Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleGenerateReport}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </button>
            <button 
              onClick={() => navigate('/students')}
              className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              New Admission
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={MOCK_STATS.totalStudents.toLocaleString()} icon={Users} trend={2.5} colorClass="bg-brand-100 text-brand-600" />
          <StatCard title="Total Staff" value={MOCK_STATS.totalStaff} icon={GraduationCap} colorClass="bg-brand-800/10 text-brand-800" />
          <StatCard title="Today's Attendance" value={`${MOCK_STATS.attendanceToday}%`} icon={TrendingUp} trend={-0.5} colorClass="bg-brand-green/10 text-brand-green" />
          <StatCard title="Fees Collected (YTD)" value={formatCurrency(MOCK_STATS.feeCollected)} icon={IndianRupee} trend={12} colorClass="bg-brand-gold/10 text-brand-gold" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Fee Collection Status</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FEE_COLLECTION_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis tickFormatter={(val) => `₹${val/100000}L`} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar dataKey="collected" name="Collected" fill="#2D7A4F" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="pending" name="Pending" fill="#F2C94C" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-brand-500" /> Recent Activity
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full mr-3 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-brand-green' : 
                    activity.type === 'warning' ? 'bg-brand-gold' : 'bg-brand-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-brand-navy">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert("Opening full activity logs...")}
              className="mt-4 w-full py-2 text-sm text-brand-800 font-medium border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
            >
              View All Logs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TEACHER DASHBOARD ---
  if (user.role === 'Teacher') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Teacher Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user.name}. Have a great day!</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/homework')}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              Assign Homework
            </button>
            <button 
              onClick={() => navigate('/attendance')}
              className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Mark Attendance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="My Classes Today" value="4" icon={BookOpen} colorClass="bg-brand-100 text-brand-600" />
          <StatCard title="Pending Homework to Grade" value="28" icon={FileEdit} colorClass="bg-brand-gold/10 text-brand-gold" />
          <StatCard title="Class Attendance (X-A)" value="96%" icon={Users} colorClass="bg-brand-green/10 text-brand-green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {[
                { time: '08:30 AM - 09:15 AM', subject: 'Science', class: 'Class X-A', room: 'Room 102', status: 'Completed' },
                { time: '10:00 AM - 10:45 AM', subject: 'Science', class: 'Class IX-B', room: 'Room 105', status: 'Ongoing' },
                { time: '11:30 AM - 12:15 PM', subject: 'Chemistry Lab', class: 'Class XI-Sci', room: 'Lab 2', status: 'Upcoming' },
                { time: '01:00 PM - 01:45 PM', subject: 'Science', class: 'Class X-B', room: 'Room 103', status: 'Upcoming' }
              ].map((cls, i) => (
                <div key={i} className={`flex items-center p-4 rounded-lg border ${cls.status === 'Ongoing' ? 'bg-brand-50 border-brand-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-24 flex-shrink-0">
                    <p className="text-xs font-bold text-slate-500">{cls.time.split(' - ')[0]}</p>
                    <p className="text-[10px] text-slate-400">{cls.time.split(' - ')[1]}</p>
                  </div>
                  <div className="w-1 h-10 bg-slate-200 mx-4 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-brand-navy">{cls.subject} <span className="text-slate-500 font-normal">({cls.class})</span></p>
                    <p className="text-xs text-slate-500 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1" /> {cls.room}</p>
                  </div>
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      cls.status === 'Completed' ? 'bg-brand-green/10 text-brand-green' :
                      cls.status === 'Ongoing' ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>{cls.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Recent Announcements</h3>
              <div className="p-4 bg-brand-100 rounded-lg border border-brand-200">
                <p className="text-sm font-bold text-brand-900">Staff Meeting at 3 PM</p>
                <p className="text-xs text-brand-800 mt-1">Please assemble in the main conference room to discuss Term 2 syllabus.</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Quick Tasks</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/homework')}
                  className="w-full flex items-center justify-between p-3 text-sm text-slate-700 hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center"><FileEdit className="w-4 h-4 mr-2 text-brand-500" /> Grade Science Lab Reports</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => alert("Opening leave applications module...")}
                  className="w-full flex items-center justify-between p-3 text-sm text-slate-700 hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-brand-500" /> Review Leave Applications</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT DASHBOARD ---
  if (user.role === 'Student') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Student Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user.name}. Class X-A</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="My Attendance" value="98%" icon={TrendingUp} colorClass="bg-brand-green/10 text-brand-green" />
          <StatCard title="Pending Homework" value={MOCK_HOMEWORK.filter(h => h.status === 'Pending').length} icon={BookOpen} colorClass="bg-brand-gold/10 text-brand-gold" />
          <StatCard title="Upcoming Exams" value="1" icon={Calendar} colorClass="bg-brand-100 text-brand-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-navy">Pending Assignments</h3>
                <button 
                  onClick={() => navigate('/homework')}
                  className="text-sm text-brand-600 font-medium hover:text-brand-800"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_HOMEWORK.filter(h => h.status === 'Pending').map(hw => (
                  <div key={hw.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mr-4">
                        <BookOpen className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy">{hw.title}</p>
                        <p className="text-xs text-slate-500">{hw.subject} • Due: {hw.dueDate}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/homework')}
                      className="text-sm bg-brand-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-900 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Recent Grades</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_GRADES.slice(0, 4).map((grade, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-lg text-center bg-slate-50">
                    <p className="text-xs font-medium text-slate-500 mb-2">{grade.subject}</p>
                    <p className="text-2xl font-bold text-brand-navy">{grade.grade}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{grade.marksObtained}/{grade.totalMarks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {MOCK_EVENTS.map(event => (
                  <div key={event.id} className="flex items-start">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex flex-col items-center justify-center mr-3 flex-shrink-0 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-sm font-bold text-brand-navy">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-bold text-brand-navy">{event.title}</p>
                      <p className="text-xs text-slate-500">{event.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PARENT DASHBOARD ---
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Parent Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome, {user.name}. Here is the overview for your child.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/transport')}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Track Bus
          </button>
          <button 
            onClick={() => navigate('/fees')}
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Fees
          </button>
        </div>
      </div>

      {/* Child Profile Snippet */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xl mr-4 border-2 border-brand-200">
            A
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Aarav Sharma</h2>
            <p className="text-sm text-slate-500">Class X - A | Roll No: 1 | Admission: BVR2023001</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-slate-500">Class Teacher</p>
          <p className="text-sm font-bold text-brand-navy">Dr. Meera Reddy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Attendance (Term 1)" value="98%" icon={TrendingUp} colorClass="bg-brand-green/10 text-brand-green" />
        <StatCard title="Pending Fees" value="₹0" icon={IndianRupee} colorClass="bg-slate-100 text-slate-600" />
        <StatCard title="Latest Grade" value="A1" icon={GraduationCap} colorClass="bg-brand-800/10 text-brand-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center"><BellRing className="w-5 h-5 mr-2 text-brand-500"/> School Notifications</h3>
          <div className="space-y-4">
            <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
              <p className="font-bold text-brand-navy">Term 1 Results Published</p>
              <p className="text-sm text-slate-600 mt-1">The report cards for Term 1 are now available in the Examinations tab.</p>
              <p className="text-xs text-slate-400 mt-2">Yesterday</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
              <p className="font-bold text-brand-navy">Upcoming Parent-Teacher Meeting</p>
              <p className="text-sm text-slate-600 mt-1">Scheduled for next Saturday, 10:00 AM to 1:00 PM.</p>
              <p className="text-xs text-slate-400 mt-2">3 days ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-brand-navy">Recent Academic Performance</h3>
            <button 
              onClick={() => navigate('/exams')}
              className="text-sm text-brand-600 font-medium hover:text-brand-800"
            >
              View Report Card
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_GRADES.slice(0, 3).map((grade, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-brand-navy">{grade.subject}</p>
                  <p className="text-xs text-slate-500">{grade.remarks}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-navy">{grade.grade}</p>
                  <p className="text-[10px] text-slate-400">{grade.marksObtained}/100</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
