import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateBatteryLevel,
  updateSession,
  addNotification,
  selectCurrentSession,
  startSession,
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
      const newBatteryLevel = Math.max(20, Math.floor(Math.random() * 100));
      dispatch(updateBatteryLevel(newBatteryLevel));
      if (session) {
        dispatch(
          startSession(),
          updateSession({
            id: session.id,
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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Robotic Lawnmower Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Real-time monitoring and control system
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Cards */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Status</h3>
                <StatusBadge />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Battery</h3>
                <BatteryIndicator />
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Current Location
            </h3>
            <div className="h-64 md:h-72 lg:h-[300px]">
              <Map />
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Session
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm md:text-base">Duration</span>
                <span className="font-semibold text-sm md:text-base">
                  {/* Replace with dynamic value */}
                  10 minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm md:text-base">Distance</span>
                <span className="font-semibold text-sm md:text-base">
                  {/* Replace with dynamic value */}
                  200 m
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
        <div className="mt-6">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;