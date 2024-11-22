import React, { useEffect, useState } from 'react';
import {
  getMower,
  getMowerMessages,
  getStayOutZones,
  getWorkAreas,
  getDetailedWorkArea,
  Mower,
  MowerMessage,
  StayOutZone,
  WorkArea,
  DetailedWorkArea,
  startMowing,
  stopMowing
} from '../services/api';
import { AlertTriangle, Check, Info, MapPin, Clock, Battery, Wifi, WrenchIcon, Settings } from 'lucide-react';

interface MowerDetailsProps {
  mowerId: string;
}

const MowerDetails: React.FC<MowerDetailsProps> = ({ mowerId }) => {
  const [mower, setMower] = useState<Mower | null>(null);
  const [messages, setMessages] = useState<MowerMessage[]>([]);
  const [stayOutZones, setStayOutZones] = useState<StayOutZone[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [selectedWorkArea, setSelectedWorkArea] = useState<DetailedWorkArea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mowerData, messagesData, zonesData, areasData] = await Promise.all([
          getMower(mowerId),
          getMowerMessages(mowerId),
          getStayOutZones(mowerId),
          getWorkAreas(mowerId)
        ]);

        setMower(mowerData);
        setMessages(messagesData);
        setStayOutZones(zonesData);
        setWorkAreas(areasData);

        if (areasData.length > 0) {
          const detailedArea = await getDetailedWorkArea(mowerId, areasData[0].id);
          setSelectedWorkArea(detailedArea);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mowerId]);

  const handleStartMowing = async (workAreaId: string) => {
    try {
      const result = await startMowing(mowerId, workAreaId);
      if (result.success) {
        // Refresh mower data
        const updatedMower = await getMower(mowerId);
        setMower(updatedMower);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start mowing');
    }
  };

  const handleStopMowing = async () => {
    try {
      const result = await stopMowing(mowerId);
      if (result.success) {
        // Refresh mower data
        const updatedMower = await getMower(mowerId);
        setMower(updatedMower);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop mowing');
    }
  };

  if (loading) return <div className="p-4">Loading mower details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!mower) return <div className="p-4">No mower found</div>;

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="text-red-500" />;
      default:
        return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Mower Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{mower.name}</h2>
            <p className="text-gray-500">{mower.model} - {mower.serialNumber}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Battery className={`${mower.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
              <span className="ml-1">{mower.batteryLevel}%</span>
            </div>
            <div className="flex items-center">
              <Wifi className={mower.connected ? 'text-green-500' : 'text-gray-400'} />
              <span className="ml-1">{mower.connected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2">
          <Settings className="text-gray-400" />
          <span>Firmware: {mower.firmware}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {messages.map(message => (
            <div
              key={message.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md"
            >
              {getMessageIcon(message.type)}
              <div>
                <p className="font-medium">{message.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Areas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Work Areas</h3>
        <div className="space-y-4">
          {workAreas.map(area => (
            <div
              key={area.id}
              className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{area.name}</h4>
                  <p className="text-sm text-gray-500">
                    Size: {area.size}m² | Priority: {area.priority}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last mowed: {new Date(area.lastMowed).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleStartMowing(area.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Start Mowing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stay Out Zones */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Stay Out Zones</h3>
        <div className="space-y-4">
          {stayOutZones.map(zone => (
            <div
              key={zone.id}
              className="p-4 border rounded-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(zone.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    zone.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {zone.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Work Area Details */}
      {selectedWorkArea && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Work Area Details - {selectedWorkArea.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold">{selectedWorkArea.completionRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Scheduled Mow</p>
              <p className="text-2xl font-semibold">
                {new Date(selectedWorkArea.nextScheduledMow).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Mowing History</h4>
            <div className="space-y-2">
              {selectedWorkArea.mowingHistory.map((history, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span>{new Date(history.date).toLocaleDateString()}</span>
                  <span>{history.duration} minutes</span>
                  <span>{history.coverage}% coverage</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MowerDetails;
