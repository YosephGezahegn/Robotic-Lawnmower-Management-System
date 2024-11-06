import React, { useState } from 'react';
import { Play, Pause, Square, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus, startSession, endSession } from '../store/mowerSlice';
import { RootState } from '../store';
import ScheduleModal from '../components/ScheduleModal';

const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.mower.status);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);


  const handleStart = () => {
    console.log('Starting the mower...');
    dispatch(updateStatus('active'));
    dispatch(startSession()); // Start a new session here
  };
  
  const handlePause = () => {
    console.log('Pausing the mower...');
    dispatch(updateStatus('idle'));
    // You might want to handle session pause logic here if needed
  };
  
  const handleStop = () => {
    console.log('Stopping the mower...');
    dispatch(updateStatus('charging'));
    dispatch(endSession()); // End the current session here
  };

  const handleSchedule = () => {
    console.log('Opening schedule modal...');
    setIsScheduleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsScheduleModalOpen(false);
  };

  console.log('Current status:', status);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={handleStart}
        disabled={status === 'active'}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4" />
        <span>Start</span>
      </button>
      
      <button
        onClick={handlePause}
        disabled={status === 'idle'}
        className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Pause className="w-4 h-4" />
        <span>Pause</span>
      </button>
      
      <button
        onClick={handleStop}
        disabled={status === 'charging'}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Square className="w-4 h-4" />
        <span>Stop</span>
      </button>
      
      <button
        onClick={handleSchedule}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Calendar className="w-4 h-4" />
        <span>Schedule</span>
      </button>

      {/* Render the modal */}
      {isScheduleModalOpen && <ScheduleModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ControlPanel;