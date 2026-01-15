import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const TestNotifications = () => {
  const { notifications, unreadCount } = useNotification();
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendTestNotification = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/notifications/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Test notification sent successfully!');
      } else {
        setMessage('❌ Failed to send test notification: ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
      console.error('Test notification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Notification System Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Socket Connected:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {connected ? '✅ Connected' : '❌ Disconnected'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Socket ID:</span>
              <span className="text-slate-600 font-mono text-sm">{socket?.id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">User:</span>
              <span className="text-slate-600">{user?.fullName || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">User ID:</span>
              <span className="text-slate-600 font-mono text-sm">{user?._id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">Room Name:</span>
              <span className="text-slate-600 font-mono text-sm">user_{user?._id || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Test Notification Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Send Test Notification</h2>
          <p className="text-slate-600 mb-4">
            Click the button below to send a test notification to yourself via the backend API.
            This will test the complete flow: API → Database → Socket.IO → Frontend
          </p>
          <button
            onClick={sendTestNotification}
            disabled={loading || !connected}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : '📤 Send Test Notification'}
          </button>
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
          {!connected && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
              ⚠️ Socket is not connected. Make sure the backend server is running and you're logged in.
            </div>
          )}
        </div>

        {/* Current Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Notifications</h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              {unreadCount} Unread
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p>No notifications yet</p>
              <p className="text-sm mt-1">Send a test notification to see it appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border rounded-lg ${
                    !notification.read
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded">{notification.type}</span>
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Make sure the backend server is running on port 3000</li>
            <li>Ensure you're logged in (Socket connection requires authentication)</li>
            <li>Check that "Socket Connected" shows ✅ Connected above</li>
            <li>Click "Send Test Notification" button</li>
            <li>You should see:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>A toast notification appear in the corner</li>
                <li>A browser notification (if permission granted)</li>
                <li>The notification appear in the list below</li>
                <li>The unread count increase</li>
                <li>Console logs showing the notification flow</li>
              </ul>
            </li>
            <li>Check the browser console (F12) for detailed logs</li>
            <li>Check the backend terminal for server-side logs</li>
          </ol>
        </div>

        {/* Console Output */}
        <div className="bg-slate-800 text-green-400 rounded-xl p-6 mt-6 font-mono text-sm">
          <h3 className="font-semibold text-white mb-3">💻 Expected Console Output</h3>
          <div className="space-y-1">
            <p>Frontend:</p>
            <p className="text-slate-400">✅ Socket connected successfully! Socket ID: abc123</p>
            <p className="text-slate-400">🔔 Setting up notification listener for user: John Doe</p>
            <p className="text-slate-400">🔔 Received notification: {'{...}'}</p>
            <p className="text-slate-400">📋 Adding notification to list. Current count: 0</p>
            <p className="text-slate-400">🔢 Updating unread count: 0 -&gt; 1</p>
            <div className="mt-3">
              <p>Backend:</p>
              <p className="text-slate-400">User connected: John Doe (userId123)</p>
              <p className="text-slate-400">User userId123 joined notification room</p>
              <p className="text-slate-400">📤 Creating notification for user: userId123</p>
              <p className="text-slate-400">📡 Emitting to room "user_userId123". Sockets in room: 1</p>
              <p className="text-slate-400">✅ Notification emitted to user_userId123: Test Notification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;
