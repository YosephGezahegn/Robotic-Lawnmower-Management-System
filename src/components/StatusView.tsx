import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import BatteryIndicator from './BatteryIndicator';
import StatusBadge from './StatusBadge'; // Assuming these components exist in the same directory
const StatusView: React.FC = () => {
  const batteryLevel = useSelector((state: RootState) => state.mower.batteryLevel);
  const status = useSelector((state: RootState) => state.mower.operationalStatus);
  const currentSession = useSelector((state: RootState) => state.mower.currentSession);
  const notifications = useSelector((state: RootState) => state.mower.notifications);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Current Status Overview</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Battery Level</h3>
        <BatteryIndicator level={batteryLevel} />
        <p className="text-gray-600">Current Level: {batteryLevel}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Operational Status</h3>
        <StatusBadge status={status} />
        <p className="text-gray-600">Status: {status}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Current Session</h3>
        {currentSession ? (
          <div>
            <p className="text-gray-600">Session ID: {currentSession.id}</p>
            <p className="text-gray-600">Duration: {currentSession.duration} minutes</p>
            <p className="text-gray-600">Distance Covered: {currentSession.distanceCovered} m</p>
          </div>
        ) : (
          <p className="text-gray-600">No active session.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">Notifications</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className={`text-${notification.type}`}>
                {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No notifications.</p>
        )}
      </div>
    </div>
  );
};

export default StatusView;