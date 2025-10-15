import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CourseType } from "./utils/mockData";
import { AuthProvider } from "./components/Header";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { App } from "./App";
import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import { DiscoverAbuDhabi } from "./pages/discoverAbuDhabi";
import NotFound from "./pages/NotFound";
import MediaDetailPage from "./pages/media/MediaDetailPage";
// Admin UI (integrated)
import AdminDashboard from "./admin-ui/pages/Dashboard";
import AdminMediaList from "./admin-ui/pages/MediaList";
import MediaCreate from "./admin-ui/pages/MediaCreate";
import AdminMediaDetail from "./admin-ui/pages/MediaDetail2";
import AdminSettings from "./admin-ui/pages/Settings";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import KfBot from "./bot/KfBot";
// Forms
import NeedsAssessmentForm from "./pages/forms/NeedsAssessmentForm";
import RequestForMembership from "./pages/forms/RequestForMembership";
import RequestForFunding from "./pages/forms/RequestForFunding";
import BookConsultationForEntrepreneurship from "./pages/forms/BookConsultationForEntrepreneurship";
import CancelLoan from "./pages/forms/CancelLoan";
import CollateralUserGuide from "./pages/forms/CollateralUserGuide";
import DisburseApprovedLoan from "./pages/forms/DisburseApprovedLoan";
import FacilitateCommunication from "./pages/forms/FacilitateCommunication";
import ReallocationOfLoanDisbursement from "./pages/forms/ReallocationOfLoanDisbursement";
import RequestToAmendExistingLoanDetails from "./pages/forms/RequestToAmendExistingLoanDetails";
import TrainingInEntrepreneurship from "./pages/forms/TrainingInEntrepreneurship";
import IssueSupportLetter from "./pages/forms/IssueSupportLetter";
import GrowthAreasMarketplace from "./pages/GrowthAreasMarketplace";
import GrowthAreasPage from "./pages/GrowthAreasPage";
import BusinessDirectoryMarketplace from "./pages/BusinessDirectoryMarketplace";
import { ComingSoon } from "./pages/ComingSoon";

export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (
      compareCourses.length < 3 &&
      !compareCourses.some((c) => c.id === course.id)
    ) {
      setCompareCourses((prev) => [...prev, course]);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <KfBot />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/courses" element={<App />} />
          <Route
            path="/courses/:itemId"
            element={
              <MarketplaceDetailsPage
                marketplaceType="courses"
                bookmarkedItems={bookmarkedCourses}
                onToggleBookmark={toggleBookmark}
                onAddToComparison={handleAddToComparison}
              />
            }
          />
          <Route path="/marketplace/*" element={<MarketplaceRouter />} />
          <Route
            path="/dashboard/*"
            element={
              // <ProtectedRoute>
              <DashboardRouter />
              // </ProtectedRoute>
            }
          />
          <Route path="/discover-abudhabi" element={<DiscoverAbuDhabi />} />
          <Route path="/growth-areas-marketplace" element={<GrowthAreasMarketplace />} />
          <Route path="/growth-areas" element={<GrowthAreasPage />} />
          <Route path="/business-directory-marketplace" element={<BusinessDirectoryMarketplace />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/coming-soon/:feature" element={<ComingSoon />} />
          
          {/* Documentation routes - redirect to coming soon */}
          <Route path="/documentation" element={<Navigate to="/coming-soon/documentation" replace />} />
          <Route path="/documentation/*" element={<Navigate to="/coming-soon/documentation" replace />} />
          <Route path="/admin-ui/settings" element={<AdminSettings />} />
          {/** Forms routes */}
          <Route
            path="/forms/needs-assessment"
            element={<ProtectedRoute><NeedsAssessmentForm /></ProtectedRoute>}
          />
          <Route
            path="/forms/request-for-membership"
            element={<ProtectedRoute><RequestForMembership /></ProtectedRoute>}
          />
          <Route
            path="/forms/request-for-funding"
            element={<ProtectedRoute><RequestForFunding /></ProtectedRoute>}
          />
          <Route
            path="/forms/book-consultation"
            element={<BookConsultationForEntrepreneurship />}
          />
          <Route path="/forms/cancel-loan" element={<CancelLoan />} />
          <Route
            path="/forms/collateral-user-guide"
            element={<ProtectedRoute><CollateralUserGuide /></ProtectedRoute>}
          />
          <Route
            path="/forms/disburse-approved-loan"
            element={<ProtectedRoute><DisburseApprovedLoan /></ProtectedRoute>}
          />
          <Route
            path="/forms/facilitate-communication"
            element={<ProtectedRoute><FacilitateCommunication /></ProtectedRoute>}
          />
          <Route
            path="/forms/reallocation-of-loan-disbursement"
            element={<ProtectedRoute><ReallocationOfLoanDisbursement /></ProtectedRoute>}
          />
          <Route
            path="/forms/request-to-amend-existing-loan-details"
            element={<ProtectedRoute><RequestToAmendExistingLoanDetails /></ProtectedRoute>}
          />
          <Route
            path="/forms/training-in-entrepreneurship"
            element={<ProtectedRoute><TrainingInEntrepreneurship /></ProtectedRoute>}
          />
          <Route
            path="/forms/issue-support-letter"
            element={<ProtectedRoute><IssueSupportLetter /></ProtectedRoute>}
          />
            <Route path="/media/:type/:id" element={<MediaDetailPage />} />
            {/* Embedded Admin UI */}
            <Route path="/admin-ui/dashboard" element={<AdminDashboard />} />
            <Route path="/admin-ui/media" element={<AdminMediaList />} />
            <Route path="/admin-ui/media/new" element={<MediaCreate />} />
            <Route path="/admin-ui/media/:id" element={<AdminMediaDetail />} />
          <Route path="/404" element={<NotFound />} />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
