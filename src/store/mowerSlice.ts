import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Location {
  lat: number;
  lng: number;
}

interface BatteryHistoryEntry {
  timestamp: string;
  level: number;
}

interface Schedule {
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
}

interface MowingSession {
  distance: number;
  id: string;
  startTime: string;
  endTime: string | null;
  batteryUsage: number;
  distanceCovered: number; 
  location: Location;
  duration: number; 
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

interface MowerSettings {
  scheduledTime: string[];
  operatingMode: 'eco' | 'standard' | 'power';
  mowingHeight: number;
  notificationsEnabled: boolean;
}

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  batteryLevel: number;
  lastConnected: string;
  model: string;
  serialNumber: string;
  firmware: string;
  connected: boolean;
  operationalStatus: 'mowing' | 'charging' | 'idle' | 'error';
}

interface MowerState {
  batteryLevel: number;
  currentLocation: Location;
  operationalStatus: 'active' | 'idle' | 'charging' | 'error'; 
  status: string;
  currentSession: MowingSession | null;
  sessions: MowingSession[];
  notifications: Notification[];
  settings: MowerSettings;
  batteryHistory: BatteryHistoryEntry[];
  schedule: Schedule | null;
  connectedDevices: Device[];
}

const initialState: MowerState = {
  batteryLevel: 100,
  currentLocation: {
    lat: 60.16750,
    lng: 24.94778,
  },
  operationalStatus: 'idle',
  status: 'idle', 
  currentSession: null,
  sessions: [],
  notifications: [],
  settings: {
    scheduledTime: [],
    operatingMode: 'standard',
    mowingHeight: 2.5,
    notificationsEnabled: true,
  },
  batteryHistory: [],
  schedule: null,
  connectedDevices: [
    {
      id: 'mower-1',
      name: 'Front Yard Mower',
      status: 'online',
      batteryLevel: 85,
      lastConnected: new Date().toISOString(),
      model: 'AutoMow 500X',
      serialNumber: 'AM500X-123456',
      firmware: '2.1.0',
      connected: true,
      operationalStatus: 'mowing'
    },
    {
      id: 'mower-2',
      name: 'Backyard Mower',
      status: 'online',
      batteryLevel: 30,
      lastConnected: new Date(Date.now() - 3600000).toISOString(),
      model: 'AutoMow 300',
      serialNumber: 'AM300-789012',
      firmware: '2.0.9',
      connected: true,
      operationalStatus: 'charging'
    },
    {
      id: 'mower-3',
      name: 'Side Yard Mower',
      status: 'offline',
      batteryLevel: 0,
      lastConnected: new Date(Date.now() - 86400000).toISOString(),
      model: 'AutoMow 300',
      serialNumber: 'AM300-345678',
      firmware: '2.0.9',
      connected: false,
      operationalStatus: 'idle'
    }
  ]
};

const mowerSlice = createSlice({
  name: 'mower',
  initialState,
  reducers: {
    updateBatteryLevel: (state, action: PayloadAction<number>) => {
      state.batteryLevel = action.payload;
      if (action.payload < 20) {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'warning',
          message: 'Battery level is low',
          timestamp: new Date().toISOString(),
          read: false,
        };
        state.notifications.push(notification);
      }
      state.batteryHistory.push({
        timestamp: new Date().toISOString(),
        level: action.payload,
      });
    },
    scheduleMowing: (state, action: PayloadAction<Schedule>) => {
      state.schedule = action.payload;
      console.log('Scheduled mowing:', action.payload);
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload.toLowerCase(); 
    },
    startSession: (state) => {
      const newSession: MowingSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        endTime: null,
        batteryUsage: 0,
        distanceCovered: 0, 
        location: state.currentLocation,
        duration: 20, 
        distance:10
      };
      state.currentSession = newSession;
      state.sessions.push(newSession);
      state.operationalStatus = 'active';
    },
    endSession: (state) => {
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
        state.operationalStatus = 'idle';
        state.currentSession = null;
      }
    },
    updateSession: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<MowingSession> }>
    ) => {
      const { id, updates } = action.payload;
      const sessionIndex = state.sessions.findIndex(
        (session) => session.id === id
      );
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = {
          ...state.sessions[sessionIndex],
          ...updates,
        };
        if (state.currentSession?.id === id) {
          state.currentSession = state.sessions[sessionIndex];
        }
      }
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.push(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    updateSettings: (state, action: PayloadAction<Partial<MowerSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    addDevice: (state, action: PayloadAction<Device>) => {
      state.connectedDevices.push(action.payload);
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.connectedDevices = state.connectedDevices.filter(
        device => device.id !== action.payload
      );
    },
    updateDeviceStatus: (state, action: PayloadAction<{ id: string; status: 'online' | 'offline' }>) => {
      const device = state.connectedDevices.find(d => d.id === action.payload.id);
      if (device) {
        device.status = action.payload.status;
        device.lastConnected = new Date().toISOString();
      }
    }
  },
});

export const {
  updateBatteryLevel,
  updateLocation,
  updateStatus,
  startSession,
  endSession,
  updateSession,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  updateSettings,
  scheduleMowing,
  addDevice,
  removeDevice,
  updateDeviceStatus
} = mowerSlice.actions;

export const selectBatteryLevel = (state: RootState) =>
  state.mower.batteryLevel;
export const selectLocation = (state: RootState) => state.mower.currentLocation;
export const selectStatus = (state: RootState) => state.mower.operationalStatus;
export const selectCurrentSession = (state: RootState) =>
  state.mower.currentSession;
export const selectSessions = (state: RootState) => state.mower.sessions;
export const selectSession = (state: RootState, sessionId: string) =>
  state.mower.sessions.find((session) => session.id === sessionId);
export const selectNotifications = (state: RootState) =>
  state.mower.notifications;
export const selectSettings = (state: RootState) => state.mower.settings;
export const selectConnectedDevices = (state: RootState) => state.mower.connectedDevices;

export default mowerSlice.reducer;