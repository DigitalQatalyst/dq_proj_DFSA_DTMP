import React, { useState } from "react";
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
  PrimaryButton,
} from "../../../components/PageLayout";
import { OnboardingProgress } from "./OnboardingProgress";
import { MetricsOverview } from "./MetricsOverview";
import { ServiceRequestsTable } from "./ServiceRequestsTable";
import { ObligationsDeadlines } from "./ObligationsDeadlines";
import { QuickActions } from "./QuickActions";
import { Announcements } from "./Announcements";
export const Overview: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    // Mock onboarding progress data
    const onboardingData = {
        profileCompletion: 75,
        documentCompletion: 60,
        overallCompletion: 68,
    };
    // Handle retry if data loading fails
    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };
    // Handle new request button click
    const handleNewRequest = () => {
        console.log('Create new request');
    };
    if (hasError) {
        return (
            <PageLayout title="Dashboard Overview">
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Unable to load dashboard data
                    </h3>
                    <p className="text-gray-600 mb-6">
                        We encountered an issue while loading your dashboard. Please try
                        again.
                    </p>
                    <PrimaryButton onClick={handleRetry}>Retry</PrimaryButton>
                </div>
            </PageLayout>
        );
    }
    return (
        <PageLayout
            title="Dashboard Overview"
            headerClassName=""
            titleClassName="text-3xl font-bold text-gray-900"
        >
            <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                    Your central view of business status, requests, and upcoming
                    obligations.
                </p>
                <PrimaryButton onClick={handleNewRequest}>Create Request</PrimaryButton>
            </div>
            {/* New Dashboard Layout Structure */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width on desktop */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Setup Card or Metrics Card (conditional) */}
                    {onboardingData.overallCompletion < 80 ? (
                        <PageSection>
                            <OnboardingProgress
                                profileCompletion={onboardingData.profileCompletion}
                                documentCompletion={onboardingData.documentCompletion}
                                overallCompletion={onboardingData.overallCompletion}
                                isLoading={isLoading}
                            />
                        </PageSection>
                    ) : (
                        <PageSection>
                            <SectionHeader title="Key Metrics">
                                <p className="text-sm text-gray-500 mt-1">
                                    Overview of your business performance indicators
                                </p>
                            </SectionHeader>
                            <SectionContent>
                                <MetricsOverview isLoading={isLoading} />
                            </SectionContent>
                        </PageSection>
                    )}
                    {/* Obligations & Deadlines */}
                    <PageSection>
                        <SectionHeader title="Reporting Obligations">
                            <p className="text-sm text-gray-500 mt-4 px-6">
                                Track important deadlines and required actions
                            </p>
                        </SectionHeader>
                        <SectionContent>
                            <ObligationsDeadlines isLoading={isLoading} />
                        </SectionContent>
                    </PageSection>
                    {/* Service Requests Table */}
                    <PageSection>
                        <SectionHeader title="Recent Service Requests">
                            <p className="text-sm text-gray-500 mt-4 px-6">
                                View and manage your recent service requests
                            </p>
                        </SectionHeader>
                        <SectionContent>
                            <ServiceRequestsTable isLoading={isLoading} />
                        </SectionContent>
                    </PageSection>
                </div>
                {/* Right Column - 1/3 width on desktop */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <PageSection>
                        <SectionHeader title="Quick Actions">
                            <p className="text-sm text-gray-500 mt-4 px-6">
                                Common tasks and shortcuts for your business
                            </p>
                        </SectionHeader>
                        <SectionContent>
                            <QuickActions />
                        </SectionContent>
                    </PageSection>
                    {/* Announcements - Taller to match combined height */}
                    <PageSection className="lg:flex-grow">
                        <SectionHeader title="Announcements">
                            <p className="text-sm text-gray-500 mt-4 px-6">
                                Important updates and notifications
                            </p>
                        </SectionHeader>
                        <SectionContent>
                            <Announcements isLoading={isLoading} />
                        </SectionContent>
                    </PageSection>
                </div>
            </div>
        </PageLayout>
    );
};
