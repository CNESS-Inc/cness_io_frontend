import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const Notification: React.FC = () => {
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const notifications = [
    {
      id: 1,
      type: 'verification',
      title: 'Verify your email',
      content: 'Please confirm your email to complete your CNESS account setup',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      type: 'welcome',
      title: 'Welcome to CNESS!',
      content: 'Begin your conscious certification journey - complete your profile to get started',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      type: 'certification',
      title: 'Congratulations!',
      content: 'You have successfully completed your Inspired Certification assessment',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      type: 'badge',
      title: 'Badge Earned: Inspired Certification',
      content: 'Download your digital badge and share your achievement with your network',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 5,
      type: 'assessment',
      title: 'Assessment Available',
      content: 'Your Inspired Certification assessment template is ready for completion',
      time: '3 days ago',
      unread: true,
    },
    {
      id: 6,
      type: 'payment',
      title: 'Payment Successful',
      content: 'Your certification payment was processed - access to premium features unlocked',
      time: '5 days ago',
      unread: false,
    },
    {
      id: 7,
      type: 'payment-failed',
      title: 'Payment Unsuccessful',
      content: "We couldn't process your payment - please update your payment method",
      time: '1 week ago',
      unread: true,
    },
    {
      id: 8,
      type: 'support',
      title: 'Missing Your Badge?',
      content: 'Having trouble accessing your Inspired badge? Contact our support team',
      time: '1 week ago',
      unread: false,
    },
    {
      id: 9,
      type: 'reminder',
      title: 'Reminder: Aspiring Badge',
      content: 'Complete your self-assessment to earn your first certification badge',
      time: '2 weeks ago',
      unread: false,
    },
    {
      id: 10,
      type: 'retake',
      title: 'Retake Assessment',
      content: 'You can now retake your Aspiration Badge assessment - attempt #2 available',
      time: '3 weeks ago',
      unread: false,
    },
    {
      id: 11,
      type: 'connections',
      title: 'New connections',
      content: 'Poznarsan K S has 24 new connections in your network',
      time: '20m ago',
      unread: true,
    },
    {
      id: 12,
      type: 'network',
      title: 'Network suggestions',
      content: 'Lead Data Analyst at Wipro and 9 other recommendations for you',
      time: '50m ago',
      unread: true,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Notification Panel */}
      <aside className="w-[440px] bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className={`cursor-pointer p-4 rounded-lg shadow-sm border transform transition hover:-translate-y-1 hover:shadow-md ${
                notification.unread
                  ? 'bg-purple-100 border-purple-500'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium mb-1 text-gray-900 flex items-center gap-2">
                    {notification.unread && (
                      <span className="w-2 h-2 bg-purple-600 rounded-full inline-block"></span>
                    )}
                    {notification.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {notification.content}
                  </p>
                </div>
                <div className="flex items-start flex-col-reverse">
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiX size={14} />
                  </button>
                  <span className="text-xs text-gray-500 mb-1">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-700 py-4">
            You're all caught up
          </div>
        </div>
      </aside>

      {/* Content View */}
      <main className="flex-1 bg-[#F9F9FF] p-6 overflow-y-auto">
        {selectedNotification ? (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-[#222224] mb-2">
              {selectedNotification.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedNotification.time}
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              {selectedNotification.content}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Select a notification to view details
          </div>
        )}
      </main>
    </div>
  );
};

export default Notification;
