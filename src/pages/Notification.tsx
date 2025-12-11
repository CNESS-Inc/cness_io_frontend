import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserNotification, GetUserNotificationCount, MarkNotificationAsRead } from '../Common/ServerAPI';

interface NotificationItem {
  id: string;
  notification_type: string;
  is_read: boolean;
  sender_id: string | null;
  receiver_id: string;
  title: string;
  description: string;
  createdAt: string;
  sender_user: any | null;
  sender_profile: any | null;
  redirection: string | null;
  data_id: string | null;
}

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getNotification = async () => {
    try {
      setLoading(true);
      const res = await GetUserNotification();
      if (res?.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Call API to mark as read
      await MarkNotificationAsRead(notificationId,true);
      
      // Update local state
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      
      // Update selected notification if it's the one being viewed
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(prev => prev ? { ...prev, is_read: true } : null);
      }

        await fetchNotificationCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const res = await GetUserNotificationCount();
      if (res && res.data && res.data.data) {
        localStorage.setItem("notification_count",res.data.data.count)
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const handleNotificationRedirect = (notification: NotificationItem) => {
    // If no redirection configured, try to use sender_id for profile redirect
    if (!notification.redirection && notification.sender_id) {
      // Default: redirect to sender's profile
      navigate(`/dashboard/userprofile/${notification.sender_id}`);
      return;
    }

    if (!notification.redirection || !notification.data_id) {
      return; // No redirection configured for this notification
    }

    // Build query string if needed
    const query = `?openpost=true&dataset=${notification.data_id}`;

    // Handle redirection based on notification type
    switch (notification.redirection) {
      case "profile":
        // Redirect to user profile (use data_id first, fallback to sender_id)
        const profileId = notification.data_id || notification.sender_id;
        if (profileId) {
          navigate(`/dashboard/userprofile/${profileId}`);
        }
        break;

      case "post":
        // Redirect to post
        if (notification.data_id) {
          navigate(`/dashboard/profile${query}`);
        }
        break;

      case "my-connections":
        // Redirect to profile for friend request notifications
        // Works for: friend request received, friend request accepted
        const userId = notification.data_id || notification.sender_id;
        if (userId) {
          navigate(`/dashboard/userprofile/${userId}`);
        }
        break;

      case "order":
      case "order-confirmation":
        // Redirect to order history page for order notifications
        if (notification.data_id) {
          navigate(`/dashboard/order-history/${notification.data_id}`);
        }
        break;

      default:
        // For unknown types, try to redirect to sender's profile if available
        if (notification.sender_id) {
          navigate(`/dashboard/userprofile/${notification.sender_id}`);
        } else {
          console.log("Unknown redirection type:", notification.redirection);
        }
        break;
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="w-[440px] bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg shadow-sm border bg-gray-50 border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        <main className="flex-1 bg-[#F9F9FF] p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-gray-500">Loading notification details...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Notification Panel */}
      <aside className="w-[440px] bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          {notifications?.length > 0 ? (
            notifications?.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`cursor-pointer p-4 rounded-lg shadow-sm border transform transition hover:-translate-y-1 hover:shadow-md ${
                  !notification.is_read
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1 text-gray-900 flex items-center gap-2">
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-purple-600 rounded-full inline-block"></span>
                      )}
                      {notification.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                      {notification.description}
                    </p>
                  </div>
                  <div className="flex items-start flex-col-reverse">
                    {/* <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add delete functionality here
                      }}
                    >
                      <FiX size={14} />
                    </button> */}
                    <span className="text-xs text-gray-500 mb-1">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-700 py-4">
              No notifications found
            </div>
          )}
        </div>
      </aside>

      {/* Content View */}
      <main className="flex-1 bg-[#F9F9FF] p-6 overflow-y-auto">
        {selectedNotification ? (
          <div
            className={`max-w-2xl mx-auto bg-white p-6 rounded-lg shadow ${
              (selectedNotification.redirection && selectedNotification.data_id) || selectedNotification.sender_id
                ? 'cursor-pointer hover:shadow-lg transition-shadow'
                : ''
            }`}
            onClick={() => handleNotificationRedirect(selectedNotification)}
          >
            <h2 className="text-xl font-semibold text-[#222224] mb-2">
              {selectedNotification.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {formatTime(selectedNotification.createdAt)}
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              {selectedNotification.description}
            </p>
            {((selectedNotification.redirection && selectedNotification.data_id) || selectedNotification.sender_id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-purple-600 font-medium flex items-center gap-2">
                  {selectedNotification.redirection === 'my-connections' || !selectedNotification.redirection
                    ? 'Click to view profile'
                    : selectedNotification.redirection === 'order' || selectedNotification.redirection === 'order-confirmation'
                    ? 'Click to view order'
                    : selectedNotification.redirection === 'post'
                    ? 'Click to view post'
                    : 'Click to view'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            {notifications.length > 0
              ? "Select a notification to view details"
              : "You don't have any notifications yet"}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notification;