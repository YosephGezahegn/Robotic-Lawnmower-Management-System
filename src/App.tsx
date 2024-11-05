import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import DeviceSettings from './pages/DeviceSettings';
import AuthGuard from './components/AuthGuard';
import Navigation from './components/Navigation';
import { useSelector } from 'react-redux';
import { RootState } from './store';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/user-settings"
          element={
            <AuthGuard>
              <UserSettings />
            </AuthGuard>
          }
        />
        <Route
          path="/device-settings"
          element={
            <AuthGuard>
              <DeviceSettings />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;