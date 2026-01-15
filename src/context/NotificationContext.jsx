import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useSocket } from './SocketContext';
import { notificationAPI } from '../services/notificationApi';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Request browser notification permission
  useEffect(() => {
    if (isAuthenticated && user && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, [isAuthenticated, user]);

  // Fetch initial notifications from API
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (connected && socket && isAuthenticated) {
      console.log('🔔 Setting up notification listener for user:', user?.fullName);

      const handleNotification = (data) => {
        console.log('🔔 Received notification:', data);

        setNotifications((prev) => {
          console.log('📋 Adding notification to list. Current count:', prev.length);
          return [data, ...prev];
        });
        setUnreadCount((prev) => {
          const newCount = prev + 1;
          console.log('🔢 Updating unread count:', prev, '->', newCount);
          return newCount;
        });

        // Show toast based on notification type
        const message = data.message || data.title;
        switch (data.type) {
          case 'event_created':
          case 'event_approved':
          case 'event_booking':
            toast.success(message);
            break;
          case 'order_placed':
          case 'order_confirmed':
          case 'order_shipped':
          case 'order_delivered':
            toast.success(message);
            break;
          case 'payment_received':
            toast.success(message);
            break;
          case 'payment_failed':
          case 'event_rejected':
          case 'event_cancelled':
          case 'order_cancelled':
            toast.error(message);
            break;
          case 'venue_booking':
          case 'venue_approved':
            toast.info(message);
            break;
          case 'venue_rejected':
            toast.error(message);
            break;
          default:
            toast.info(message);
        }

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(data.title || 'New Notification', {
            body: message,
            icon: '/logo.png',
            badge: '/logo.png'
          });
        }
      };

      socket.on('notification', handleNotification);

      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [connected, socket, isAuthenticated, toast]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications(20, 0, false);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      console.log('Unread count response:', response);
      const count = typeof response.data.count === 'number' ? response.data.count : 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      const notification = notifications.find((n) => n._id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
        fetchNotifications,
        fetchUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
