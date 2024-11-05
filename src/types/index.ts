export interface MowerState {
  batteryLevel: number;
  status: 'Active' | 'Idle' | 'Charging';
  location: {
    lat: number;
    lng: number;
  };
  currentSession: {
    startTime: string;
    duration: number;
    distance: number;
  };
  batteryHistory: {
    timestamp: string;
    level: number;
  }[];
  notifications: {
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }[];
  settings: {
    scheduledTime: string;
    operatingMode: 'Eco' | 'Standard' | 'Power';
    notificationsEnabled: boolean;
    mowingPattern: 'Spiral' | 'Parallel' | 'Random';
  };
}

export interface AuthState {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface UserSettings {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}