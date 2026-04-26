export type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  // Role specific references
  studentId?: string; // For Student role
  childIds?: string[]; // For Parent role
  employeeId?: string; // For Teacher/Admin role
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  parentName: string;
  contact: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  attendanceToday: number; // percentage
  feeCollected: number;
  feePending: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface Staff {
  id: string;
  empId: string;
  name: string;
  role: 'Teacher' | 'Admin' | 'Support';
  department: string;
  contact: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface Vehicle {
  id: string;
  busNo: string;
  registrationNo: string;
  capacity: number;
  route: string;
  driverName: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface Exam {
  id: string;
  name: string;
  type: 'Term' | 'Unit Test' | 'Final';
  classes: string[];
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  assignedBy: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  submissions?: number;
  totalStudents?: number;
  grade?: string;
  feedback?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'Holiday' | 'Exam' | 'Event';
}

export interface Grade {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}
