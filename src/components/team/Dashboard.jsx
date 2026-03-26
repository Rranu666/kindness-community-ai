import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Users, FileText, MessageSquare, Megaphone } from 'lucide-react';

export default function Dashboard({ user }) {
  useEffect(() => {
    // Component receives user from parent, no need to fetch again
  }, []);

  const { data: messages = [] } = useQuery({
    queryKey: ['teamMessages'],
    queryFn: () => base44.entities.TeamMessage.list('-created_date', 5),
    initialData: [],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['teamDocuments'],
    queryFn: () => base44.entities.TeamDocument.list('-created_date', 5),
    initialData: [],
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['teamAnnouncements'],
    queryFn: () => base44.entities.TeamAnnouncement.list('-created_date', 3),
    initialData: [],
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      try {
        return await base44.entities.TeamMember.list();
      } catch (error) {
        return [];
      }
    },
    initialData: [],
  });

  const stats = [
    { label: 'Team Members', value: teamMembers.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Documents', value: documents.length, icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { label: 'Announcements', value: announcements.length, icon: Megaphone, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-rose-500/20">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.full_name || 'Team Member'}!</h1>
          <p className="text-blue-50">Stay connected and productive with your team</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl p-6 border border-blue-900/30 hover:border-blue-800/50 transition-all duration-300 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-blue-300/60 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="group relative overflow-hidden rounded-xl p-6 border border-blue-900/30 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950"></div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <span className="text-2xl">📢</span> Recent Announcements
          </h2>
          <div className="space-y-3 relative z-10">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30 hover:border-blue-700/50 transition-all"
                >
                  <h3 className="text-white font-semibold mb-1">{announcement.title}</h3>
                  <p className="text-blue-200/60 text-sm line-clamp-2">{announcement.content}</p>
                  <p className="text-blue-300/40 text-xs mt-2">{announcement.author_name}</p>
                </div>
              ))
            ) : (
              <p className="text-blue-300/50 text-center py-6">No announcements yet</p>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="group relative overflow-hidden rounded-xl p-6 border border-blue-900/30 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950"></div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <span className="text-2xl">📄</span> Recent Documents
          </h2>
          <div className="space-y-3 relative z-10">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30 hover:border-blue-700/50 transition-all"
                  >
                  <h3 className="text-white font-semibold mb-1">{doc.title}</h3>
                  <p className="text-blue-200/60 text-sm line-clamp-2">{doc.description}</p>
                  <p className="text-blue-300/40 text-xs mt-2">{doc.uploaded_by_name}</p>
                </div>
              ))
            ) : (
              <p className="text-blue-300/50 text-center py-6">No documents yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}