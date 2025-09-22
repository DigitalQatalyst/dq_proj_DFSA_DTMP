import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, redirect } from 'react-router-dom';
import {
    Building2,
    FileText,
    Users,
    DollarSign,
    CheckCircle,
    Lock,
    ChevronDown,
    Edit3,
    MapPin,
    BarChart3,
    Settings,
    HelpCircle,
    Grid3X3
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { mockDocumentData } from '../../components/DocumentWallet/mockDocumentData';
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

// Dashboard Layout Component
// const DashboardLayout = ({ children }: { children: React.ReactNode; }) => {
//     const [sidebarOpen] = useState(true);
//     const location = useLocation();

//     const navigationItems = [
//         {
//             section: 'Essentials',
//             items: [
//                 { name: 'Overview', path: '/dashboard/overview', icon: Grid3X3, locked: true },
//                 { name: 'Onboarding', path: '/dashboard/onboarding', icon: CheckCircle, locked: false, active: location.pathname.includes('onboarding') }
//             ]
//         },
//         {
//             section: 'Transactions',
//             items: [
//                 { name: 'Profile', path: '/dashboard/profile', icon: Users, locked: true },
//                 { name: 'Documents', path: '/dashboard/documents', icon: FileText, locked: true },
//                 { name: 'Requests', path: '/dashboard/requests', icon: FileText, locked: true },
//                 { name: 'Insights', path: '/dashboard/insights', icon: BarChart3, locked: true },
//                 { name: 'Reporting Obligations', path: '/dashboard/reporting', icon: FileText, locked: true }
//             ]
//         },
//         {
//             section: 'Settings & Support',
//             items: [
//                 { name: 'Settings', path: '/dashboard/settings', icon: Settings, locked: true },
//                 { name: 'Support', path: '/dashboard/support', icon: HelpCircle, locked: true }
//             ]
//         }
//     ];

//     const sidebarTransform = sidebarOpen ? 'translate-x-0' : '-translate-x-full';
//     const mainContentMargin = sidebarOpen ? 'lg:ml-64' : 'ml-0';

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Sidebar */}
//             <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarTransform} lg:translate-x-0`}>
//                 <div className="flex flex-col h-full">
//                     {/* Company Header */}
//                     <div className="p-6 border-b border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">FutureTech LLC</h2>
//                                 <p className="text-sm text-gray-500">Company Profile</p>
//                             </div>
//                             <ChevronDown className="w-5 h-5 text-gray-400" />
//                         </div>
//                     </div>

//                     {/* Onboarding Alert */}
//                     <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
//                         <div className="flex">
//                             <div className="ml-3">
//                                 <p className="text-sm text-yellow-800">
//                                     Complete the onboarding process to unlock all sections of the platform.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Navigation */}
//                     <nav className="flex-1 px-4 py-6 space-y-8">
//                         {navigationItems.map((section) => (
//                             <div key={section.section}>
//                                 <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                                     {section.section}
//                                 </h3>
//                                 <div className="space-y-1">
//                                     {section.items.map((item) => {
//                                         const Icon = item.icon;
//                                         const isActive = item.active;
//                                         const isLocked = item.locked;

//                                         // Determine CSS classes
//                                         let linkClasses = 'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200';
//                                         if (isActive) {
//                                             linkClasses += ' bg-blue-100 text-blue-700';
//                                         } else if (isLocked) {
//                                             linkClasses += ' text-gray-400 cursor-not-allowed';
//                                         } else {
//                                             linkClasses += ' text-gray-700 hover:bg-gray-100 hover:text-gray-900';
//                                         }

//                                         let iconClasses = 'mr-3 h-5 w-5';
//                                         if (isActive) {
//                                             iconClasses += ' text-blue-500';
//                                         } else if (isLocked) {
//                                             iconClasses += ' text-gray-300';
//                                         } else {
//                                             iconClasses += ' text-gray-400 group-hover:text-gray-500';
//                                         }

//                                         return (
//                                             <a
//                                                 key={item.name}
//                                                 href={item.path}
//                                                 className={linkClasses}
//                                             >
//                                                 <Icon className={iconClasses} />
//                                                 {item.name}
//                                                 {isLocked && <Lock className="ml-auto h-4 w-4 text-gray-300" />}
//                                             </a>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         ))}
//                     </nav>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className={`transition-all duration-300 ${mainContentMargin}`}>
//                 <div className="min-h-screen">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// Onboarding Step Component
const OnboardingStep = ({
    stepNumber,
    totalSteps,
    title,
    description,
    children
}: {
    stepNumber: number;
    totalSteps: number;
    title: string;
    description: string;
    children: React.ReactNode;
}) => {
    const steps = [
        { number: 1, title: 'Welcome', icon: Building2 },
        { number: 2, title: 'Business Details', icon: Building2 },
        { number: 3, title: 'Business Profile', icon: Building2 },
        { number: 4, title: 'Location & Contact', icon: MapPin },
        { number: 5, title: 'Operations', icon: Users },
        { number: 6, title: 'Funding', icon: DollarSign },
        { number: 7, title: 'Review', icon: CheckCircle }
    ];

    return (
        <div className="p-8">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = step.number === stepNumber;
                        const isCompleted = step.number < stepNumber;

                        // Determine step circle classes
                        let circleClasses = 'w-12 h-12 rounded-full flex items-center justify-center mb-2';
                        if (isActive) {
                            circleClasses += ' bg-blue-500 text-white';
                        } else if (isCompleted) {
                            circleClasses += ' bg-green-500 text-white';
                        } else {
                            circleClasses += ' bg-gray-200 text-gray-500';
                        }

                        // Determine step title classes
                        let titleClasses = 'text-sm font-medium';
                        if (isActive) {
                            titleClasses += ' text-blue-600';
                        } else if (isCompleted) {
                            titleClasses += ' text-green-600';
                        } else {
                            titleClasses += ' text-gray-500';
                        }

                        return (
                            <div key={step.number} className="flex flex-col items-center">
                                <div className={circleClasses}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={titleClasses}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="text-center">
                    <span className="text-sm text-gray-600">Step {stepNumber} of {totalSteps}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
                </div>

                {children}

                {/* Bottom Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        We'll guide you through a few steps to complete your business profile. Your progress will be saved automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Welcome Step Component
const WelcomeStep = () => {
    return (
        <OnboardingStep
            stepNumber={1}
            totalSteps={7}
            title="Welcome to Enterprise Journey"
            description="We already have some information from your sign-up. Please review it and complete a few additional details to get started."
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Information
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Company Name:</span>
                        <span className="font-medium text-gray-900">FutureTech</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Industry:</span>
                        <span className="font-medium text-gray-900">Information Technology</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Company Stage:</span>
                        <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">Growth</span>
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Contact Name:</span>
                        <span className="font-medium text-gray-900">John Smith</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">john.smith@futuretech.com</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">+971 50 123 4567</span>
                    </div>
                </div>
            </div>
        </OnboardingStep>
    );
};

// Placeholder Components for other pages
// const OverviewPage = () => (
//     <div className="p-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-4">Overview</h1>
//         <p className="text-gray-600">This section is locked. Complete onboarding to access.</p>
//     </div>
// );

// const ProfilePage = () => (
//     <div className="p-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
//         <p className="text-gray-600">This section is locked. Complete onboarding to access.</p>
//     </div>
// );

// const DocumentsPage = () => (
//     <div className="p-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-4">Documents</h1>
//         <p className="text-gray-600">This section is locked. Complete onboarding to access.</p>
//     </div>
// );



// Main Dashboard Router Component
const DashboardRouter = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                // const completed = await isOnboardingCompleted();
                // TODO: Simulate API call to check if profile data exists and remove the following bellow
                const completed = true;
                setOnboardingComplete(completed);
                // If onboarding is not complete, force activeSection to be 'onboarding'
                if (!completed) {
                    setActiveSection('onboarding');
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            } finally {
                setLoading(false);
            }
        };
        checkOnboarding();
    }, []);
    const handleOnboardingComplete = () => {
        setOnboardingComplete(true);
        setActiveSection('overview');
    };

    useEffect(() => {
        setActiveSection(location.pathname.split('/')[2]);
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            redirect('/');
        }
    }, []);

    return (
        <DashboardLayout
            onboardingComplete={onboardingComplete}
            setOnboardingComplete={setOnboardingComplete}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
        >
            <Routes>
                <Route path="/" element={<Navigate to={onboardingComplete ? "/dashboard/overview" : "/dashboard/onboarding"} replace />} />
                <Route path="/onboarding" element={<OnboardingForm onComplete={onboardingComplete} isRevisit={true} />} />
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
                <Route path="/reporting-obligations" element={<ReportsPage />} />
                <Route path="/reporting-obligations/obligations" element={<AllUpcomingObligationsPage />} />
                <Route path="/reporting-obligations/submitted" element={<AllSubmittedReportsPage />} />
                <Route path="/reporting-obligations/received" element={<AllReceivedReportsPage />} />
                <Route path="/profile" element={<BusinessProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<SupportPage />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DashboardRouter;