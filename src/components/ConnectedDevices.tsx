import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectConnectedDevices, removeDevice, updateDeviceStatus } from '../store/mowerSlice';
import { RootState } from '../store';
import { Battery, Wifi, WifiOff, Trash2, ChevronRight } from 'lucide-react';
import MowerDetails from './MowerDetails';

const ConnectedDevices: React.FC = () => {
  const devices = useSelector(selectConnectedDevices);
  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const handleRemoveDevice = (id: string) => {
    dispatch(removeDevice(id));
    if (selectedDevice === id) {
      setSelectedDevice(null);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return 'text-green-500';
    if (level >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatLastConnected = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Connected Devices</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => {
              alert('Scanning for new devices...');
            }}
          >
            Add Device
          </button>
        </div>
        
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
            >
              <div className="flex items-center space-x-4">
                {device.status === 'online' ? (
                  <Wifi className="text-green-500" size={20} />
                ) : (
                  <WifiOff className="text-gray-400" size={20} />
                )}
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last connected: {formatLastConnected(device.lastConnected)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Battery className={getBatteryColor(device.batteryLevel)} size={20} />
                  <span className={`ml-1 ${getBatteryColor(device.batteryLevel)}`}>
                    {device.batteryLevel}%
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveDevice(device.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove device"
                >
                  <Trash2 size={20} />
                </button>

                <ChevronRight
                  className={`transition-transform ${
                    selectedDevice === device.id ? 'rotate-90' : ''
                  }`}
                  size={20}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show MowerDetails when a device is selected */}
      {selectedDevice && (
        <MowerDetails mowerId={selectedDevice} />
      )}
    </div>
  );
};

export default ConnectedDevices;
