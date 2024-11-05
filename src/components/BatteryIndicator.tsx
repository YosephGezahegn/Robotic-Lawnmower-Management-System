import React from 'react';
import { Battery, BatteryCharging } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const BatteryIndicator: React.FC = () => {
  const batteryLevel = useSelector((state: RootState) => state.mower.batteryLevel);
  const status = useSelector((state: RootState) => state.mower.status);

  const getBatteryColor = () => {
    if (batteryLevel > 60) return 'text-green-500';
    if (batteryLevel > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center space-x-2">
      {status === 'Charging' ? (
        <BatteryCharging className={`w-6 h-6 ${getBatteryColor()}`} />
      ) : (
        <Battery className={`w-6 h-6 ${getBatteryColor()}`} />
      )}
      <span className="font-semibold">{batteryLevel}%</span>
    </div>
  );
}

export default BatteryIndicator;