import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import MediaList from './pages/MediaList';
import MediaCreate from './pages/MediaCreate';
import MediaDetail from './pages/MediaDetail';
import { AuthProvider } from './components/KFHeader';
export function AppRouter() {
  return <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/media" element={<MediaList />} />
          <Route path="/media/new" element={<MediaCreate />} />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>;
}