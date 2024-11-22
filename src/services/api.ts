// Mock API response types
export interface Mower {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  batteryLevel: number;
  status: 'mowing' | 'charging' | 'idle' | 'error';
  lastSeen: string;
  firmware: string;
  connected: boolean;
  errorCode?: string;
  errorMessage?: string;
}

export interface MowerMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  read: boolean;
}

export interface StayOutZone {
  id: string;
  name: string;
  points: Array<{ lat: number; lng: number }>;
  active: boolean;
  createdAt: string;
}

export interface WorkArea {
  id: string;
  name: string;
  boundary: Array<{ lat: number; lng: number }>;
  size: number; // in square meters
  lastMowed: string;
  mowingFrequency: number; // days
  priority: 'high' | 'medium' | 'low';
}

export interface DetailedWorkArea extends WorkArea {
  completionRate: number;
  nextScheduledMow: string;
  mowingHistory: Array<{
    date: string;
    duration: number;
    coverage: number;
  }>;
}

// Mock data
const mockMowers: { [key: string]: Mower } = {
  'mower-1': {
    id: 'mower-1',
    name: 'Front Yard Mower',
    model: 'AutoMow 500X',
    serialNumber: 'AM500X-123456',
    batteryLevel: 85,
    status: 'mowing',
    lastSeen: new Date().toISOString(),
    firmware: '2.1.0',
    connected: true
  },
  'mower-2': {
    id: 'mower-2',
    name: 'Backyard Mower',
    model: 'AutoMow 300',
    serialNumber: 'AM300-789012',
    batteryLevel: 30,
    status: 'charging',
    lastSeen: new Date().toISOString(),
    firmware: '2.0.9',
    connected: true
  },
  'mower-3': {
    id: 'mower-3',
    name: 'Side Yard Mower',
    model: 'AutoMow 300',
    serialNumber: 'AM300-345678',
    batteryLevel: 0,
    status: 'idle',
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
    firmware: '2.0.9',
    connected: false
  }
};

const mockMessages: { [key: string]: MowerMessage[] } = {
  'mower-1': [
    {
      id: 'msg-1',
      timestamp: new Date().toISOString(),
      type: 'info',
      message: 'Started mowing in Zone A',
      read: false
    },
    {
      id: 'msg-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'warning',
      message: 'Grass is higher than optimal height',
      read: true
    }
  ]
};

const mockStayOutZones: { [key: string]: StayOutZone[] } = {
  'mower-1': [
    {
      id: 'zone-1',
      name: 'Flower Bed',
      points: [
        { lat: 60.16750, lng: 24.94778 },
        { lat: 60.16755, lng: 24.94785 },
        { lat: 60.16760, lng: 24.94780 },
        { lat: 60.16755, lng: 24.94773 }
      ],
      active: true,
      createdAt: new Date().toISOString()
    }
  ]
};

const mockWorkAreas: { [key: string]: WorkArea[] } = {
  'mower-1': [
    {
      id: 'area-1',
      name: 'Main Lawn',
      boundary: [
        { lat: 60.16740, lng: 24.94768 },
        { lat: 60.16745, lng: 24.94775 },
        { lat: 60.16750, lng: 24.94770 },
        { lat: 60.16745, lng: 24.94763 }
      ],
      size: 500,
      lastMowed: new Date(Date.now() - 86400000).toISOString(),
      mowingFrequency: 2,
      priority: 'high'
    }
  ]
};

const mockDetailedWorkAreas: { [key: string]: { [key: string]: DetailedWorkArea } } = {
  'mower-1': {
    'area-1': {
      ...mockWorkAreas['mower-1'][0],
      completionRate: 85,
      nextScheduledMow: new Date(Date.now() + 86400000).toISOString(),
      mowingHistory: [
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          duration: 120,
          coverage: 95
        }
      ]
    }
  }
};

// Mock API functions
export const getMower = async (id: string): Promise<Mower> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const mower = mockMowers[id];
  if (!mower) throw new Error('Mower not found');
  return mower;
};

export const getMowerMessages = async (id: string): Promise<MowerMessage[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const messages = mockMessages[id] || [];
  return messages;
};

export const getStayOutZones = async (id: string): Promise<StayOutZone[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const zones = mockStayOutZones[id] || [];
  return zones;
};

export const getWorkAreas = async (id: string): Promise<WorkArea[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const areas = mockWorkAreas[id] || [];
  return areas;
};

export const getDetailedWorkArea = async (
  mowerId: string,
  workAreaId: string
): Promise<DetailedWorkArea> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const area = mockDetailedWorkAreas[mowerId]?.[workAreaId];
  if (!area) throw new Error('Work area not found');
  return area;
};

// Additional action APIs
export const startMowing = async (
  mowerId: string,
  workAreaId: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    message: `Started mowing in work area ${workAreaId}`
  };
};

export const stopMowing = async (
  mowerId: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    message: 'Mower stopped successfully'
  };
};

export const updateWorkArea = async (
  mowerId: string,
  workAreaId: string,
  updates: Partial<WorkArea>
): Promise<WorkArea> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const area = mockWorkAreas[mowerId]?.find(a => a.id === workAreaId);
  if (!area) throw new Error('Work area not found');
  return { ...area, ...updates };
};

export const updateStayOutZone = async (
  mowerId: string,
  zoneId: string,
  updates: Partial<StayOutZone>
): Promise<StayOutZone> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const zone = mockStayOutZones[mowerId]?.find(z => z.id === zoneId);
  if (!zone) throw new Error('Stay out zone not found');
  return { ...zone, ...updates };
};
