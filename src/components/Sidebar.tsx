import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, Settings, HelpCircle, Activity } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/batch', icon: MessageSquareText, label: 'Batch Processing' },
  ];

  return (
    <div className="w-72 border-r border-slate-200 bg-white h-screen flex flex-col">
      <div className="p-6 flex items-center gap-3 text-slate-900">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
          <Activity size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Sentia API</span>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border ${
                isActive
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-200 space-y-2">
        <button className="flex items-center gap-3 p-3 rounded-lg w-full text-left text-sm font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:text-slate-900 transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-3 p-3 rounded-lg w-full text-left text-sm font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:text-slate-900 transition-colors">
          <HelpCircle size={18} />
          Help & Support
        </button>
      </div>
    </div>
  );
}
