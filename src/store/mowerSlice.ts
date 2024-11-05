import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Location {
  lat: number;
  lng: number;
}

interface MowingSession {
  id: string;
  startTime: string;
  endTime: string | null;
  batteryUsage: number;
  distanceCovered: number; // Consider renaming this to match your updateSession payload
  location: Location;
  duration?: number; // Add this property if you need to update it
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

interface MowerState {
  batteryLevel: number;
  currentLocation: Location;
  operationalStatus: 'active' | 'idle' | 'charging' | 'error';
  currentSession: MowingSession | null;
  sessions: MowingSession[]; // Updated to MowingSession[]
  notifications: Notification[];
  settings: MowerSettings;
  batteryHistory: { timestamp: string; level: number }[]; // Ensure this is correctly typed
}

const initialState: MowerState = {
  batteryHistory: [],
  batteryLevel: 100,
  currentLocation: { lat: 40.7128, lng: -74.006 },
  operationalStatus: 'idle',
  currentSession: null,
  sessions: [],
  notifications: [],
  settings: {
    scheduledTime: [],
    operatingMode: 'standard',
    mowingHeight: 2.5,
    notificationsEnabled: true,
  },
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
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    updateStatus: (
      state,
      action: PayloadAction<MowerState['operationalStatus']>
    ) => {
      state.operationalStatus = action.payload;
    },
    startSession: (state) => {
      const newSession: MowingSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        endTime: null,
        batteryUsage: 0,
        distanceCovered: 0,
        location: state.currentLocation,
      };
      state.currentSession = newSession;
      state.sessions.push(newSession);
      state.operationalStatus = 'active';
    },
    endSession: (state) => {
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
        state.operationalStatus = 'idle';
        // You may want to calculate final batteryUsage and distanceCovered here
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
} = mowerSlice.actions;

// Selectors
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

export default mowerSlice.reducer;
