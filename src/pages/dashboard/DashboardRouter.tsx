import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { DocumentsPage } from './documents';
import { Overview } from './overview';
import { ServiceRequestsPage } from './serviceRequests';
import { isOnboardingCompleted } from '../../services/DataverseService';
import { OnboardingForm } from './onboarding/OnboardingForm';
import { ReportsPage } from './reportingObligations/ReportsPage';
import { AllReceivedReportsPage } from './reportingObligations/AllReceivedReportsPage';
import { AllSubmittedReportsPage } from './reportingObligations/AllSubmittedReportsPage';
import { AllUpcomingObligationsPage } from './reportingObligations/AllUpcomingObligationsPage';
import BusinessProfilePage from './businessProfile';
import SupportPage from './support';
import SettingsPage from './settings';
import { ChatInterface } from '../../components/Chat/ChatInterface';

// Main Dashboard Router Component
const DashboardRouter = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const completed = await isOnboardingCompleted();
                setOnboardingComplete(!!completed);
                if (!completed) {
                    if (!location.pathname.includes('/dashboard/onboarding')) {
                        navigate('/dashboard/onboarding', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            } finally {
                // no-op
            }
        };
        checkOnboarding();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If onboarding is complete and user is on onboarding route, send to overview
    useEffect(() => {
        if (onboardingComplete && location.pathname.includes('/dashboard/onboarding')) {
            navigate('/dashboard/overview', { replace: true });
        }
    }, [onboardingComplete, location.pathname, navigate]);

    const handleOnboardingComplete = () => {
        setOnboardingComplete(true);
        navigate('/dashboard/overview', { replace: true });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    return (
        <DashboardLayout
            onboardingComplete={true}
            setOnboardingComplete={setOnboardingComplete}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
        >
            <Routes>
                <Route path="/" element={<Navigate to={onboardingComplete ? "/dashboard/overview" : "/dashboard/onboarding"} replace />} />
                <Route path="/onboarding" element={<OnboardingForm onComplete={handleOnboardingComplete} isRevisit={onboardingComplete} />} />
                <Route path="/overview" element={<Overview />} />
                {/* <Route path="/profile" element={<ProfilePage activeSection={activeSection} sidebarOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />} /> */}
                <Route path="/documents" element={<DocumentsPage
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />} />
                <Route path="/requests" element={<ServiceRequestsPage
                    setIsOpen={setIsOpen}
                    isLoggedIn={isLoggedIn}
                />} />
                <Route path="/reporting" element={<Navigate to="/dashboard/reporting-obligations" replace />} />
                <Route path="/reporting-obligations" element={<ReportsPage />} />
                <Route path="/reporting-obligations/obligations" element={<AllUpcomingObligationsPage />} />
                <Route path="/reporting-obligations/submitted" element={<AllSubmittedReportsPage />} />
                <Route path="/reporting-obligations/received" element={<AllReceivedReportsPage />} />
                <Route path="/profile" element={<BusinessProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/chat-support" element={<ChatInterface />} />
                <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DashboardRouter;