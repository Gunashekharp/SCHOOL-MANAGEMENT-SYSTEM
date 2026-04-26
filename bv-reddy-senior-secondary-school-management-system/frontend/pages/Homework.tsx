import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle, Clock, Upload, Users, MessageSquare } from 'lucide-react';
import { MOCK_HOMEWORK } from '../constants';
import { useAuth } from '../context/AuthContext';

export const Homework: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  const isTeacher = user.role === 'Teacher' || user.role === 'Admin';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Homework & Assignments</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isTeacher ? 'Assign and track student homework.' : 'View and submit your assignments.'}
          </p>
        </div>
        {isTeacher && (
          <button 
            onClick={() => alert("Opening Assignment Creator...")}
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTeacher ? 'Active Assignments' : 'Pending'}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTeacher ? 'Past Assignments' : 'Completed'}
        </button>
      </div>

      {/* Homework List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_HOMEWORK.filter(hw => 
          activeTab === 'pending' ? hw.status === 'Pending' : hw.status !== 'Pending'
        ).map((hw) => (
          <div key={hw.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded font-medium">{hw.subject}</span>
              {hw.status === 'Pending' ? (
                <span className="flex items-center text-xs font-medium text-brand-gold"><Clock className="w-3 h-3 mr-1"/> Due {hw.dueDate}</span>
              ) : (
                <span className="flex items-center text-xs font-medium text-brand-green"><CheckCircle className="w-3 h-3 mr-1"/> {hw.status}</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-brand-navy mb-1">{hw.title}</h3>
            <p className="text-sm text-slate-500 mb-4">Assigned by: {hw.assignedBy}</p>
            
            {/* Role Specific Details */}
            {isTeacher && hw.submissions !== undefined && (
              <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-600 flex items-center"><Users className="w-4 h-4 mr-1"/> Submissions</span>
                  <span className="font-bold text-brand-navy">{hw.submissions} / {hw.totalStudents}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${(hw.submissions / (hw.totalStudents || 1)) * 100}%` }}></div>
                </div>
              </div>
            )}

            {!isTeacher && hw.grade && (
              <div className="mb-4 bg-brand-50 p-3 rounded-lg border border-brand-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-brand-800">Grade Received:</span>
                  <span className="text-lg font-bold text-brand-navy">{hw.grade}</span>
                </div>
                {hw.feedback && (
                  <p className="text-xs text-slate-600 flex items-start">
                    <MessageSquare className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    {hw.feedback}
                  </p>
                )}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-100">
              {isTeacher ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-medium">Class: {hw.class}</span>
                  <button 
                    onClick={() => alert(`Loading student submissions for ${hw.title}...`)}
                    className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                  >
                    View Submissions
                  </button>
                </div>
              ) : (
                hw.status === 'Pending' ? (
                  <button 
                    onClick={() => alert("Opening file upload dialog...")}
                    className="w-full bg-brand-800 hover:bg-brand-900 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Submit Work
                  </button>
                ) : (
                  <button 
                    onClick={() => alert("Opening your submitted work...")}
                    className="w-full text-slate-500 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 bg-slate-50 border border-slate-200 transition-colors"
                  >
                    View Submission
                  </button>
                )
              )}
            </div>
          </div>
        ))}
        
        {MOCK_HOMEWORK.filter(hw => activeTab === 'pending' ? hw.status === 'Pending' : hw.status !== 'Pending').length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No assignments found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
