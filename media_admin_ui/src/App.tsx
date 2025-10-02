import React from 'react';
import { PageLayout, PageSection, SectionHeader, SectionContent, PrimaryButton } from './components/PageLayout';
export function App() {
  return <PageLayout title="Dashboard">
      <PageSection>
        <SectionHeader title="Welcome" description="Your personalized dashboard overview." actions={<PrimaryButton onClick={() => alert('Action clicked!')}>
              Take Action
            </PrimaryButton>} />
        <SectionContent>
          <p className="text-gray-700">
            Welcome to your dashboard. Here you can view and manage your
            information.
          </p>
        </SectionContent>
      </PageSection>
      <PageSection>
        <SectionHeader title="Recent Activity" description="Your latest actions and updates." />
        <SectionContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Document Updated</h3>
              <p className="text-gray-600 text-sm">
                You updated your profile information yesterday
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">
                Application Submitted
              </h3>
              <p className="text-gray-600 text-sm">
                Your application was submitted successfully last week
              </p>
            </div>
          </div>
        </SectionContent>
      </PageSection>
    </PageLayout>;
}