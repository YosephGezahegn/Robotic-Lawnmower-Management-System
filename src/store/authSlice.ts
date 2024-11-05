import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface UserProfile {
  username: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  error: string | null;
  loading: boolean;
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  isAuthenticated: true,
  user: null,
  error: null,
  loading: false,
  updateStatus: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.updateStatus = 'idle';
    },
    updateProfileStart: (state) => {
      state.updateStatus = 'loading';
      state.error = null;
    },
    updateProfileSuccess: (
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.updateStatus = 'succeeded';
      state.error = null;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.updateStatus = 'failed';
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.updateStatus = 'idle';
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearError,
} = authSlice.actions;

// Thunk action creator for updating user profile
export const updateUserProfile =
  (profileData: Partial<UserProfile>) => async (dispatch: any) => {
    try {
      dispatch(updateProfileStart());

      // Validate input data
      if (profileData.email && !isValidEmail(profileData.email)) {
        throw new Error('Invalid email format');
      }

      if (profileData.username && !isValidUsername(profileData.username)) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update profile
      dispatch(updateProfileSuccess(profileData));
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error instanceof Error ? error.message : 'Failed to update profile'
        )
      );
    }
  };

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectUpdateStatus = (state: RootState) => state.auth.updateStatus;

// Helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

const isValidUsername = (username: string): boolean => {
  return username.length >= 3;
};

export default authSlice.reducer;
