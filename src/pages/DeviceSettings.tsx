import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Settings, Clock, Battery, Navigation } from 'lucide-react';
import { updateSettings } from '../store/mowerSlice';

interface DeviceSettingsForm {
  scheduledTime: string;
  operatingMode: 'Eco' | 'Standard' | 'Power';
  notificationsEnabled: boolean;
  mowingPattern: 'Spiral' | 'Parallel' | 'Random';
}

const DeviceSettings: React.FC = () => {
  const settings = useSelector((state: RootState) => state.mower.settings);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<DeviceSettingsForm>({
    defaultValues: settings,
  });

  const onSubmit = (data: DeviceSettingsForm) => {
    dispatch(updateSettings(data));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Device Settings</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Scheduled Time
              </div>
            </label>
            <input
              type="time"
              {...register('scheduledTime')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Operating Mode
              </div>
            </label>
            <select
              {...register('operatingMode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Eco">Eco</option>
              <option value="Standard">Standard</option>
              <option value="Power">Power</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Mowing Pattern
              </div>
            </label>
            <select
              {...register('mowingPattern')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Spiral">Spiral</option>
              <option value="Parallel">Parallel</option>
              <option value="Random">Random</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('notificationsEnabled')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Notifications
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeviceSettings;