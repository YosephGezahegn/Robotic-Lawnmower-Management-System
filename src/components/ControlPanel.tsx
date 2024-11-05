import React from 'react';
import { Play, Pause, Square, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus } from '../store/mowerSlice';
import { RootState } from '../store';

const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.mower.status);

  const handleStart = () => dispatch(updateStatus('Active'));
  const handlePause = () => dispatch(updateStatus('Idle'));
  const handleStop = () => dispatch(updateStatus('Charging'));

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={handleStart}
        disabled={status === 'Active'}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4" />
        <span>Start</span>
      </button>
      
      <button
        onClick={handlePause}
        disabled={status === 'Idle'}
        className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Pause className="w-4 h-4" />
        <span>Pause</span>
      </button>
      
      <button
        onClick={handleStop}
        disabled={status === 'Charging'}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Square className="w-4 h-4" />
        <span>Stop</span>
      </button>
      
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        <Calendar className="w-4 h-4" />
        <span>Schedule</span>
      </button>
    </div>
  );
}

export default ControlPanel;