import React from 'react';
import { Bell, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format, parseISO } from 'date-fns';

const Notifications: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.mower.notifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Notifications
      </h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(parseISO(notification.timestamp), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;