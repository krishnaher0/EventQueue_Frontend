import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket.IO temporarily disabled - will be implemented later
    // Uncomment this code when backend Socket.IO is ready

    // if (isAuthenticated && user) {
    //   // Connect to WebSocket server
    //   socketRef.current = io('http://localhost:3000', {
    //     auth: {
    //       token: localStorage.getItem('token'),
    //     },
    //   });

    //   socketRef.current.on('connect', () => {
    //     console.log('Connected to notification server');
    //   });

    //   // Listen for notifications
    //   socketRef.current.on('notification', (data) => {
    //     const notification = {
    //       id: Date.now(),
    //       ...data,
    //       read: false,
    //       createdAt: new Date().toISOString(),
    //     };
    //     setNotifications((prev) => [notification, ...prev]);
    //     setUnreadCount((prev) => prev + 1);

    //     // Show toast based on notification type
    //     switch (data.type) {
    //       case 'booking':
    //         toast.success(data.message);
    //         break;
    //       case 'order':
    //         toast.success(data.message);
    //         break;
    //       case 'product':
    //         toast.info(data.message);
    //         break;
    //       case 'event':
    //         toast.info(data.message);
    //         break;
    //       case 'venue':
    //         toast.info(data.message);
    //         break;
    //       case 'review':
    //         toast.success(data.message);
    //         break;
    //       case 'error':
    //         toast.error(data.message);
    //         break;
    //       default:
    //         toast.info(data.message);
    //     }
    //   });

    //   socketRef.current.on('disconnect', () => {
    //     console.log('Disconnected from notification server');
    //   });

    //   return () => {
    //     if (socketRef.current) {
    //       socketRef.current.disconnect();
    //     }
    //   };
    // }
  }, [isAuthenticated, user, toast]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Emit notification to server (for local actions)
  const emitNotification = useCallback((type, message, data = {}) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('activity', { type, message, data });
    }
    // Also show local toast immediately
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  }, [toast]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        emitNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
