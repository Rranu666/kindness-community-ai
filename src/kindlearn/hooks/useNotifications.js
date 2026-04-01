import { notificationsApi } from '@/kindlearn/api/notifications';

export const useNotifications = () => {
  const createNotification = async (type, title, message, icon, actionUrl = null) => {
    try {
      await notificationsApi.create({
        type,
        title,
        message,
        icon,
        action_url: actionUrl,
        read: false,
        dismissed: false,
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsApi.update(notificationId, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await notificationsApi.update(notificationId, { dismissed: true });
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  return {
    createNotification,
    markAsRead,
    dismissNotification,
  };
};