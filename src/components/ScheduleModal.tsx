import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { scheduleMowing } from '../store/mowerSlice'; // Action to be created
import { X } from 'lucide-react';

interface ScheduleModalProps {
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

  const handleDayToggle = (day: string) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch the scheduling action
    dispatch(scheduleMowing({ startTime, endTime, daysOfWeek }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Schedule Mowing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Time */}
          <div>
            <label className="block text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Days of the Week */}
          <div>
            <label className="block text-gray-700 mb-1">Days of the Week</label>
            <div className="grid grid-cols-3 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    value={day}
                    checked={daysOfWeek.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="mr-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;