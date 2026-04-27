import { Student, FeeRecord, DashboardStats, ChartDataPoint, Staff, Vehicle, Exam, User, Homework, Activity, Event, Grade } from './types';

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'Admin User', role: 'Admin', email: 'admin@bvreddyschool.in' },
  { id: 'U2', name: 'Dr. Meera Reddy', role: 'Teacher', email: 'meera.r@bvreddyschool.in', employeeId: 'EMP001' },
  { id: 'U3', name: 'Aarav Sharma', role: 'Student', email: 'aarav.s@student.bvreddyschool.in', studentId: '1' },
  { id: 'U4', name: 'Rajesh Sharma', role: 'Parent', email: 'rajesh.s@parent.com', childIds: ['1'] },
];

export const FIREBASE_LOGIN_IDS = [
  'admin@bvreddyschool.in',
  'meera.r@bvreddyschool.in',
  'aarav.s@student.bvreddyschool.in',
  'rajesh.s@parent.com',
];

export const MOCK_STATS: DashboardStats = {
  totalStudents: 2450,
  totalStaff: 185,
  attendanceToday: 94.5,
  feeCollected: 12500000,
  feePending: 3200000,
};

export const ATTENDANCE_DATA: ChartDataPoint[] = [
  { name: 'Mon', value: 95 },
  { name: 'Tue', value: 94 },
  { name: 'Wed', value: 96 },
  { name: 'Thu', value: 93 },
  { name: 'Fri', value: 95 },
  { name: 'Sat', value: 88 },
];

export const FEE_COLLECTION_DATA: ChartDataPoint[] = [
  { name: 'Term 1', collected: 8000000, pending: 500000 },
  { name: 'Term 2', collected: 4500000, pending: 2700000 },
  { name: 'Term 3', collected: 0, pending: 8500000 },
];

export const MOCK_STUDENTS: Student[] = [
  { id: '1', admissionNo: 'BVR2023001', name: 'Aarav Sharma', class: 'X', section: 'A', rollNo: 1, gender: 'Male', dob: '2008-05-14', parentName: 'Rajesh Sharma', contact: '+91 9876543210', status: 'Active' },
  { id: '2', admissionNo: 'BVR2023045', name: 'Diya Patel', class: 'X', section: 'A', rollNo: 12, gender: 'Female', dob: '2008-08-22', parentName: 'Amit Patel', contact: '+91 9876543211', status: 'Active' },
  { id: '3', admissionNo: 'BVR2021102', name: 'Rohan Gupta', class: 'XII', section: 'Sci-B', rollNo: 34, gender: 'Male', dob: '2006-11-05', parentName: 'Sanjay Gupta', contact: '+91 9876543212', status: 'Active' },
  { id: '4', admissionNo: 'BVR2024012', name: 'Ananya Singh', class: 'VIII', section: 'C', rollNo: 5, gender: 'Female', dob: '2010-02-18', parentName: 'Vikram Singh', contact: '+91 9876543213', status: 'Active' },
  { id: '5', admissionNo: 'BVR2022088', name: 'Kabir Das', class: 'IX', section: 'B', rollNo: 21, gender: 'Male', dob: '2009-07-30', parentName: 'Arun Das', contact: '+91 9876543214', status: 'Inactive' },
];

export const MOCK_FEES: FeeRecord[] = [
  { id: 'F101', studentId: '1', studentName: 'Aarav Sharma', class: 'X-A', totalAmount: 45000, paidAmount: 45000, dueDate: '2023-10-15', status: 'Paid' },
  { id: 'F102', studentId: '2', studentName: 'Diya Patel', class: 'X-A', totalAmount: 45000, paidAmount: 20000, dueDate: '2023-10-15', status: 'Pending' },
  { id: 'F103', studentId: '3', studentName: 'Rohan Gupta', class: 'XII-Sci-B', totalAmount: 60000, paidAmount: 0, dueDate: '2023-09-01', status: 'Overdue' },
];

export const MOCK_STAFF: Staff[] = [
  { id: 'S1', empId: 'EMP001', name: 'Dr. Meera Reddy', role: 'Teacher', department: 'Science', contact: '+91 9876500001', status: 'Active' },
  { id: 'S2', empId: 'EMP042', name: 'Suresh Kumar', role: 'Teacher', department: 'Mathematics', contact: '+91 9876500002', status: 'Active' },
  { id: 'S3', empId: 'EMP015', name: 'Priya Sharma', role: 'Admin', department: 'Office', contact: '+91 9876500003', status: 'On Leave' },
  { id: 'S4', empId: 'EMP088', name: 'Ramesh Singh', role: 'Support', department: 'Transport', contact: '+91 9876500004', status: 'Active' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'V1', busNo: 'Bus 01', registrationNo: 'AP 02 X 1234', capacity: 40, route: 'Route A - City Center', driverName: 'Ramesh Singh', status: 'Active' },
  { id: 'V2', busNo: 'Bus 02', registrationNo: 'AP 02 X 5678', capacity: 40, route: 'Route B - North Suburbs', driverName: 'Ali Khan', status: 'Active' },
  { id: 'V3', busNo: 'Bus 03', registrationNo: 'AP 02 Y 9012', capacity: 30, route: 'Route C - South End', driverName: 'John Doe', status: 'Maintenance' },
];

export const MOCK_EXAMS: Exam[] = [
  { id: 'E1', name: 'Term 1 Examinations', type: 'Term', classes: ['IX', 'X', 'XI', 'XII'], startDate: '2023-09-15', endDate: '2023-09-30', status: 'Completed' },
  { id: 'E2', name: 'Unit Test 2', type: 'Unit Test', classes: ['VI', 'VII', 'VIII'], startDate: '2023-11-10', endDate: '2023-11-15', status: 'Ongoing' },
  { id: 'E3', name: 'Pre-Board Exams', type: 'Final', classes: ['X', 'XII'], startDate: '2024-01-05', endDate: '2024-01-20', status: 'Upcoming' },
];

export const MOCK_HOMEWORK: Homework[] = [
  { id: 'HW1', title: 'Algebra Equations Ex 4.2', subject: 'Mathematics', class: 'X-A', dueDate: '2023-10-25', assignedBy: 'Suresh Kumar', status: 'Pending', submissions: 32, totalStudents: 45 },
  { id: 'HW2', title: 'Chemical Reactions Lab Report', subject: 'Science', class: 'X-A', dueDate: '2023-10-26', assignedBy: 'Dr. Meera Reddy', status: 'Submitted', grade: 'A', feedback: 'Excellent observation details.' },
  { id: 'HW3', title: 'History Chapter 3 Q&A', subject: 'Social Studies', class: 'X-A', dueDate: '2023-10-22', assignedBy: 'Anita Desai', status: 'Graded', grade: 'B+', feedback: 'Good, but elaborate more on the causes.' },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'A1', title: 'New Admission', description: 'Rahul Verma enrolled in Class XI-Sci.', time: '10 mins ago', type: 'success' },
  { id: 'A2', title: 'Fee Payment', description: '₹45,000 collected via Online Gateway.', time: '1 hour ago', type: 'info' },
  { id: 'A3', title: 'Transport Alert', description: 'Bus 03 reported minor delay due to traffic.', time: '2 hours ago', type: 'warning' },
];

export const MOCK_EVENTS: Event[] = [
  { id: 'EV1', title: 'Diwali Holidays', date: 'Nov 10 - Nov 14', type: 'Holiday' },
  { id: 'EV2', title: 'Annual Sports Day', date: 'Dec 05', type: 'Event' },
  { id: 'EV3', title: 'Unit Test 2 Begins', date: 'Nov 10', type: 'Exam' },
];

export const MOCK_GRADES: Grade[] = [
  { subject: 'Mathematics', marksObtained: 92, totalMarks: 100, grade: 'A1', remarks: 'Excellent' },
  { subject: 'Science', marksObtained: 88, totalMarks: 100, grade: 'A2', remarks: 'Very Good' },
  { subject: 'English', marksObtained: 78, totalMarks: 100, grade: 'B1', remarks: 'Good' },
  { subject: 'Social Studies', marksObtained: 85, totalMarks: 100, grade: 'A2', remarks: 'Very Good' },
  { subject: 'Hindi', marksObtained: 90, totalMarks: 100, grade: 'A1', remarks: 'Excellent' },
];
