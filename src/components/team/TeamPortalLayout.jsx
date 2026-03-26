import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import NotificationPanel from './NotificationPanel';
import GlobalSearch from './GlobalSearch';
import TeamPortalFooter from './TeamPortalFooter';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'directory', label: 'Team Directory', icon: '👥' },
];

export default function TeamPortalLayout({ children, currentView, onViewChange, isAdmin, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0d1b2a] via-indigo-950 to-blue-950 flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-950 to-indigo-950 border-r border-blue-900/50 transition-all duration-300 flex flex-col shadow-2xl hidden md:flex`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-900/30">
          <div className="flex items-center justify-center">
            {sidebarOpen ? (
              <div className="text-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-sky-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  KCF
                </h1>
                <p className="text-xs text-blue-300/50">Team Portal</p>
              </div>
            ) : (
              <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                K
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'text-blue-200/70 hover:bg-blue-900/30'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-blue-900/30 space-y-2">
          <button
            onClick={() => onViewChange('directory')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-blue-200/70 hover:bg-blue-900/30 transition-all duration-200"
          >
            <User size={18} />
            {sidebarOpen && <span className="text-sm">Profile</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-blue-200/70 hover:bg-rose-900/20 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>

        </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-4 text-blue-200/70 hover:bg-blue-900/30 transition-all"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-950 to-indigo-950 border-r border-blue-900/50 flex flex-col shadow-2xl z-50 md:hidden">
          {/* Logo */}
          <div className="p-6 border-b border-blue-900/30">
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                KCF
              </h1>
              <p className="text-xs text-blue-300/50">Team Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/30'
                    : 'text-blue-200/70 hover:bg-blue-900/30'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-blue-900/30 space-y-2">
            <button
              onClick={() => {
                onViewChange('directory');
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-blue-200/70 hover:bg-blue-900/30 transition-all duration-200"
            >
              <User size={18} />
              <span className="text-sm">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-blue-200/70 hover:bg-rose-900/20 hover:text-rose-300 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col w-full">
        {/* Top Bar */}
        <div className="border-b border-blue-900/30 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 p-3 md:p-4 flex justify-between items-center gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <GlobalSearch />
          </div>
          <div className="flex-shrink-0">
            <NotificationPanel user={user} />
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>

        {/* Footer */}
        <TeamPortalFooter />
      </div>
    </div>
  );
}