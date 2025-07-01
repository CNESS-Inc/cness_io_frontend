import React from 'react';
import { FiX } from 'react-icons/fi';
import cnesslogo from "../assets/logo.png";

const Notification: React.FC = () => {
  // Notification data
 const notifications = [
  {
    id: 1,
    type: 'verification',
    title: 'Verify your email',
    content: 'Please confirm your email to complete your CNESS account setup',
    time: 'Just now',
    unread: true
  },
  {
    id: 2,
    type: 'welcome',
    title: 'Welcome to CNESS!',
    content: 'Begin your conscious certification journey - complete your profile to get started',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 3,
    type: 'certification',
    title: 'Congratulations!',
    content: 'You have successfully completed your Inspired Certification assessment',
    time: '1 day ago',
    unread: false
  },
  {
    id: 4,
    type: 'badge',
    title: 'Badge Earned: Inspired Certification',
    content: 'Download your digital badge and share your achievement with your network',
    time: '2 days ago',
    unread: false
  },
  {
    id: 5,
    type: 'assessment',
    title: 'Assessment Available',
    content: 'Your Inspired Certification assessment template is ready for completion',
    time: '3 days ago',
    unread: true
  },
  {
    id: 6,
    type: 'payment',
    title: 'Payment Successful',
    content: 'Your certification payment was processed - access to premium features unlocked',
    time: '5 days ago',
    unread: false
  },
  {
    id: 7,
    type: 'payment-failed',
    title: 'Payment Unsuccessful',
    content: 'We couldn\'t process your payment - please update your payment method',
    time: '1 week ago',
    unread: true
  },
  {
    id: 8,
    type: 'support',
    title: 'Missing Your Badge?',
    content: 'Having trouble accessing your Inspired badge? Contact our support team',
    time: '1 week ago',
    unread: false
  },
  {
    id: 9,
    type: 'reminder',
    title: 'Reminder: Aspiring Badge',
    content: 'Complete your self-assessment to earn your first certification badge',
    time: '2 weeks ago',
    unread: false
  },
  {
    id: 10,
    type: 'retake',
    title: 'Retake Assessment',
    content: 'You can now retake your Aspiration Badge assessment - attempt #2 available',
    time: '3 weeks ago',
    unread: false
  },
  {
    id: 11,
    type: 'connections',
    title: 'New connections',
    content: 'Poznarsan K S has 24 new connections in your network',
    time: '20m ago',
    unread: true
  },
  {
    id: 12,
    type: 'network',
    title: 'Network suggestions',
    content: 'Lead Data Analyst at Wipro and 9 other recommendations for you',
    time: '50m ago',
    unread: true
  }
];

   return (
  <div className="h-screen flex ml-5 p-4 space-x-6 overflow-hidden">
  
  {/* Logo on the left - stays fixed inside the flex */}
  <div className="sticky top-4 self-start w-64 h-40 bg-white rounded-lg shadow-md flex justify-center items-center border border-gray-200">
    <img src={cnesslogo} alt="CNESS Logo" className="h-20 w-auto" />
  </div>

  {/* Notifications - scroll only this */}
  <div className="flex-1 overflow-y-auto pr-2">
    <div className="max-w-4xl space-y-4">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="p-4 rounded-lg shadow-sm border border-gray-100 transform transition hover:-translate-y-1 hover:shadow-md"
          style={{
            backgroundColor:
              index % 2 === 0
                ? 'rgba(232, 205, 253, 0.5)'
                : 'rgba(207, 199, 255, 0.5)',
            borderLeft: '4px solid #7077FE',
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                {notification.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {notification.content}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-600 mr-2">
                {notification.time}
              </span>
              <button className="text-gray-600 hover:text-gray-800">
                <FiX size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center text-sm text-gray-700 py-4">
        You're all caught up
      </div>
    </div>
  </div>
</div>
  );
};



export default Notification;