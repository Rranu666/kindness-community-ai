import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function NotificationPanel({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => user?.email ? base44.entities.Notification.filter({ recipient_email: user.email }, '-created_date', 20) : [],
    enabled: !!user?.email,
    refetchInterval: 5000,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.update(notificationId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const getNotificationIcon = (type) => {
    const icons = {
      message: '💬',
      mention: '@',
      task_assigned: '✓',
      announcement: '📢',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      message: 'border-l-blue-500',
      mention: 'border-l-purple-500',
      task_assigned: 'border-l-green-500',
      announcement: 'border-l-orange-500',
    };
    return colors[type] || 'border-l-slate-500';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-screen sm:w-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-2xl z-50 max-h-80 sm:max-h-96 overflow-y-auto -mr-4 sm:mr-0">
          <div className="sticky top-0 p-3 sm:p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
             <h3 className="font-bold text-white text-sm sm:text-base">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-700">
              {notifications.map((notif) => (
                <div
                   key={notif.id}
                   className={`p-3 sm:p-4 border-l-4 ${getNotificationColor(notif.type)} ${
                     !notif.is_read ? 'bg-slate-700/50' : 'bg-slate-800/30'
                   } hover:bg-slate-700/70 transition-colors group`}
                 >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 flex-1">
                      <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                         <p className="font-semibold text-white text-xs sm:text-sm truncate">{notif.title}</p>
                         <p className="text-xs text-slate-300 mt-1 line-clamp-2">{notif.message}</p>
                        {notif.from_user_name && (
                          <p className="text-xs text-slate-400 mt-1">from {notif.from_user_name}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNotificationMutation.mutate(notif.id)}
                      className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notif.id)}
                      className="text-xs mt-2 text-blue-400 hover:text-blue-300"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}