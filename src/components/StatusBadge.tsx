import React from 'react';
import { Circle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const StatusBadge: React.FC = () => {
  const status = useSelector((state: RootState) => state.mower.status);

  const getStatusColor = () => {
    switch (status) {
      case 'Active':
        return 'text-green-500';
      case 'Idle':
        return 'text-yellow-500';
      case 'Charging':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Circle className={`w-3 h-3 ${getStatusColor()} fill-current`} />
      <span className="font-medium">{status}</span>
    </div>
  );
}

export default StatusBadge;