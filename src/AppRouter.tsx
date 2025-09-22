import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { mockCourses, CourseType } from './utils/mockData';
import { AuthProvider } from './components/Header';
import { MarketplaceRouter } from './pages/marketplace/MarketplaceRouter';
import MarketplaceDetailsPage from './pages/marketplace/MarketplaceDetailsPage';
import DashboardRouter from './pages/dashboard/DashboardRouter';
import { DiscoverAbuDhabi } from './pages/discoverAbuDhabi';
export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (compareCourses.length < 3 && !compareCourses.some(c => c.id === course.id)) {
      setCompareCourses(prev => [...prev, course]);
    }
  };
  return <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/courses" element={<App />} />
        <Route path="/courses/:itemId" element={<MarketplaceDetailsPage marketplaceType="courses" bookmarkedItems={bookmarkedCourses} onToggleBookmark={toggleBookmark} onAddToComparison={handleAddToComparison} />} />
        <Route path="/marketplace/*" element={<MarketplaceRouter />} />
        <Route path="/dashboard/*" element={<DashboardRouter />} />
        <Route path="/discover-abudhabi" element={<DiscoverAbuDhabi />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>;
}