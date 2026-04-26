import React, { useState } from 'react';
import { Send, MessageSquare, BellRing } from 'lucide-react';

export const Communication: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject || !message) {
      alert("Please fill in both subject and message fields.");
      return;
    }
    alert("Message broadcasted successfully!");
    setSubject('');
    setMessage('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Communication Hub</h1>
        <p className="text-slate-500 text-sm mt-1">Send announcements, SMS, and app notifications to parents and staff.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Compose Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <h3 className="font-semibold text-brand-navy flex items-center"><Send className="w-4 h-4 mr-2" /> Compose Message</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To:</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                <option>All Parents</option>
                <option>Specific Class</option>
                <option>All Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject:</label>
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                placeholder="Message subject..." 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-1">Message:</label>
              <textarea 
                className="w-full flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-4 text-sm">
                <label className="flex items-center"><input type="checkbox" className="mr-2 rounded text-brand-600 focus:ring-brand-500" defaultChecked /> App Notification</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2 rounded text-brand-600 focus:ring-brand-500" /> SMS</label>
              </div>
              <button 
                onClick={handleSend}
                className="bg-brand-800 hover:bg-brand-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <h3 className="font-semibold text-brand-navy flex items-center"><BellRing className="w-4 h-4 mr-2" /> Recent Broadcasts</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">All Parents</span>
                  <span className="text-xs text-slate-400">2 hrs ago</span>
                </div>
                <p className="text-sm font-medium text-brand-navy">Tomorrow is a holiday</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Dear Parents, please note that the school will remain closed tomorrow due to...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
