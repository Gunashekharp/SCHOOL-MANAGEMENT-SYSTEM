import React from 'react';
import { Bus, MapPin, Users, AlertTriangle } from 'lucide-react';
import { MOCK_VEHICLES } from '../constants';

export const Transport: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Transport Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage fleet, routes, and monitor live GPS tracking.</p>
        </div>
        <button 
          onClick={() => alert("Opening full-screen live map...")}
          className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Live Map View
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-brand-100 text-brand-600 rounded-lg mr-4"><Bus className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Fleet</p>
            <p className="text-2xl font-bold text-brand-navy">12</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg mr-4"><MapPin className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Routes</p>
            <p className="text-2xl font-bold text-brand-navy">8</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg mr-4"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">In Maintenance</p>
            <p className="text-2xl font-bold text-brand-navy">1</p>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-brand-navy">Vehicle Status</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4">Bus Details</th>
              <th className="p-4">Route</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Live Tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {MOCK_VEHICLES.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-medium text-brand-navy">{vehicle.busNo}</p>
                  <p className="text-xs text-slate-500">{vehicle.registrationNo}</p>
                </td>
                <td className="p-4 text-sm text-slate-600">{vehicle.route}</td>
                <td className="p-4 text-sm text-slate-600">{vehicle.driverName}</td>
                <td className="p-4 text-sm text-slate-600">{vehicle.capacity} Seats</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'Active' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {vehicle.status === 'Active' ? (
                    <button 
                      onClick={() => alert(`Connecting to GPS tracker for ${vehicle.busNo}...`)}
                      className="text-brand-600 hover:text-brand-800 text-sm font-medium flex items-center justify-end w-full"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-green mr-2 animate-pulse"></span>
                      Track
                    </button>
                  ) : (
                    <span className="text-slate-400 text-sm">Offline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
