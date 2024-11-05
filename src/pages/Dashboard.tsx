import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateBatteryLevel,
  updateSession,
  addNotification,
  selectCurrentSession,
} from '../store/mowerSlice';
import BatteryIndicator from '../components/BatteryIndicator';
import StatusBadge from '../components/StatusBadge';
import ControlPanel from '../components/ControlPanel';
import BatteryChart from '../components/BatteryChart';
import Notifications from '../components/Notifications';
import Map from '../components/Map';
import { MapPin, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectCurrentSession);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        updateBatteryLevel(Math.max(20, Math.floor(Math.random() * 100)))
      );
      if (session) {
        dispatch(
          updateSession({
            id: session.id, // Ensure to use the session ID
            updates: {
              duration: Math.floor(Math.random() * 120),
              distance: Math.floor(Math.random() * 500),
            },
          })
        );
      }

      if (Math.random() > 0.8) {
        const notifications = [
          { type: 'warning' as const, message: 'Obstacle detected' },
          { type: 'info' as const, message: 'Entering new zone' },
          { type: 'error' as const, message: 'Battery level critical' },
        ];
        dispatch(
          addNotification(
            notifications[Math.floor(Math.random() * notifications.length)]
          )
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, session]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Robotic Lawnmower Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring and control system
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Status</h3>
                <StatusBadge />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Battery</h3>
                <BatteryIndicator />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Current Location
            </h3>
            <div className="h-[300px]">
              <Map />
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Session
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">
                  {session ? session.duration : 0} minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Distance</span>
                <span className="font-semibold">
                  {session ? session.distance : 0} m
                </span>
              </div>
            </div>
          </div>

          {/* Battery Chart */}
          <div className="md:col-span-2">
            <BatteryChart />
          </div>

          {/* Notifications */}
          <div>
            <Notifications />
          </div>
        </div>

        {/* Control Panel */}
        <div className="mt-8">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
