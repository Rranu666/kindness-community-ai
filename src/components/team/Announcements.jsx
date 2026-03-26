import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pin, Trash2 } from 'lucide-react';

export default function Announcements({ isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'medium' });
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery({
    queryKey: ['teamAnnouncements'],
    queryFn: () => base44.entities.TeamAnnouncement.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.TeamAnnouncement.create({
        title: data.title,
        content: data.content,
        priority: data.priority,
        author_email: typeof window !== 'undefined' && localStorage.getItem('user_email') || 'unknown@example.com',
        author_name: typeof window !== 'undefined' && localStorage.getItem('user_name') || 'Unknown',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamAnnouncements'] });
      setFormData({ title: '', content: '', priority: 'medium' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TeamAnnouncement.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamAnnouncements'] });
    },
  });

  const pinMutation = useMutation({
    mutationFn: (id) => {
      const announcement = announcements.find((a) => a.id === id);
      return base44.entities.TeamAnnouncement.update(id, {
        is_pinned: !announcement.is_pinned,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamAnnouncements'] });
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.content) return;
    createMutation.mutate(formData);
  };

  const pinnedAnnouncements = announcements.filter((a) => a.is_pinned);
  const regularAnnouncements = announcements.filter((a) => !a.is_pinned);

  const priorityColors = {
    low: 'from-blue-500 to-cyan-500',
    medium: 'from-yellow-500 to-orange-500',
    high: 'from-red-500 to-rose-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
          <p className="text-slate-400">Stay informed with team updates</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
          >
            <Plus size={20} /> New Announcement
          </button>
        )}
      </div>

      {/* Create Form */}
      {showForm && isAdmin && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Create Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter announcement content"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || !formData.title || !formData.content}
                className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-all duration-200"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Pin size={20} className="text-yellow-400" /> Pinned
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-gradient-to-br ${priorityColors[announcement.priority]} rounded-xl p-6 text-white shadow-lg border border-slate-700 group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{announcement.title}</h3>
                  {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => pinMutation.mutate(announcement.id)}
                        className="text-white/80 hover:text-white transition-all"
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(announcement.id)}
                        className="text-white/80 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-white/90 mb-3">{announcement.content}</p>
                <p className="text-xs text-white/70">By {announcement.author_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Announcements</h2>
        <div className="space-y-3">
          {regularAnnouncements.length > 0 ? (
            regularAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-lg group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          announcement.priority === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-2">{announcement.content}</p>
                    <p className="text-xs text-slate-500">By {announcement.author_name}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => pinMutation.mutate(announcement.id)}
                        className="text-slate-400 hover:text-yellow-400 transition-all"
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(announcement.id)}
                        className="text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No announcements yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}