import { FormSchema } from "../FormPreview";

export const RequestForFundingSchema: FormSchema = {
  formId: "request-for-membership",
  formTitle: "Request for Funding",
  formDescription:
    "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Applicant Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "COMPANY INFORMATION",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
            },
            {
              id: "companyNumber",
              label: "Company Number",
              type: "text",
              required: true,
            },
          ],
        },
        {
          groupTitle: "REQUESTOR INFORMATION",
          fields: [
            {
              id: "applicantFullName",
              label: "Full Name",
              type: "text",
              validation: { minLength: 2 },
            },
            {
              id: "roleInBusiness",
              label: "Role in Business",
              type: "select",
              options: [
                { value: "owner", label: "Owner/Founder" },
                { value: "ceo", label: "CEO" },
                { value: "partner", label: "Partner" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "applicantEmail",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "john.smith@email.com",
            },
            {
              id: "applicantPhone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "+1 234 567 8900",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Funding Details",
      stepDescription: "Provide information about your funding needs.",
      groups: [
        {
          groupTitle: "FUNDING PROGRAM",
          fields: [
            {
              id: "fundingProgram",
              label: "Please select the funding program you want to apply for",
              type: "select",
              options: [
                { label: "Start up", value: "Start up" },
                { label: "Scale up", value: "Scale up" },
              ],
            },
          ],
        },
        {
          groupTitle: "BUSINESS DETAILS",
          fields: [
            {
              id: "projectName",
              label: "Project name",
              type: "text",
            },
            {
              id: "currentInvestment",
              label: "Current investment",
              type: "text",
            },
          ],
        },
        {
          groupTitle: "SETUP YOUR LOAN",
          fields: [
            {
              id: "loanAmount",
              label: "Loan amount",
              type: "text",
            },
            {
              id: "currentInvestment",
              label: "Current investment",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Supporting documents",
      stepDescription:
        "Tell us about your business offerings and funding needs.",
      groups: [
        {
          groupTitle: "UPLOAD DOCUMENTS",
          fields: [
            {
              id: "tradeLicense",
              label: "Valid trade license of the enterprise",
              type: "file",
            },
            {
              id: "scoredReport",
              label:
                "Entrepreneur's Scored Report from Al Etihad Credit Bureau (AECB)",
              type: "file",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Data Sharing Consent",
      stepDescription:
        "Consent for sharing your information with the platform and third parties.",
      groups: [
        {
          groupTitle: "Consent",
          fields: [
            {
              id: "dataSharingConsent",
              label:
                "I consent to the sharing of my business information with third parties for partnership opportunities and platform services.",
              type: "consent",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
