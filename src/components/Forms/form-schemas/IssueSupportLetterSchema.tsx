import { FormSchema } from "../FormPreview";

export const IssueSupportLetterSchema: FormSchema = {
  formId: "issue-support-letter",
  formTitle: "Issue Support Letter",
  formDescription:
    "Please complete the form below to request a support letter from our organization.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Requester Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "Personal Details",
          fields: [
            {
              id: "applicantFullName",
              label: "Full Name",
              type: "text",
              validation: { minLength: 2 },
              //   required: true,
            },
            {
              id: "applicantEmail",
              label: "Email Address",
              type: "email",
              //   required: true,
            },
            {
              id: "applicantPhone",
              label: "Phone Number",
              type: "tel",
              validation: {
                pattern:
                  "^[+]*[0-9]{1,4}[\\s\\-]?[0-9]{1,3}[\\s\\-]?[0-9]{1,4}$",
              },
              //   required: true,
            },
            {
              id: "dateOfBirth",
              label: "Date of Birth",
              type: "date",
            },
            {
              id: "nationality",
              label: "Nationality",
              type: "select",
              globalOptionSet: "countries", // Use global option set
            },
          ],
        },
        {
          groupTitle: "Role & Experience",
          fields: [
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
              id: "yearsOfExperience",
              label: "Years of Business Experience",
              type: "number",
              validation: { min: 0, max: 50 },
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Support Letter Details",
      stepDescription:
        "Provide details about the support letter and its purpose.",
      groups: [
        {
          groupTitle: "Letter Request",
          fields: [
            {
              id: "supportLetterType",
              label: "Type of Support Letter",
              type: "select",
              options: [
                { value: "employment", label: "Employment Verification" },
                { value: "financial", label: "Financial Support" },
                { value: "travel", label: "Travel Support" },
                { value: "education", label: "Education Support" },
                { value: "visa", label: "Visa Support" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "supportLetterPurpose",
              label: "Purpose of the Support Letter",
              type: "textarea",
              placeholder:
                "Please briefly describe the purpose of the letter...",
            },
            {
              id: "letterRecipient",
              label: "Recipient of the Support Letter",
              type: "text",
              validation: { minLength: 2 },
            },
            {
              id: "letterDateNeededBy",
              label: "Date Needed By",
              type: "date",
              //   required: true,
            },
            {
              id: "letterContentSpecifics",
              label: "Letter Content Specifics",
              type: "textarea",
              placeholder:
                "Please provide specific wording or details (optional).",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Attachments & Documentation",
      stepDescription:
        "Upload any required documents to complete your request.",
      groups: [
        {
          groupTitle: "Required Documents",
          fields: [
            {
              id: "supportingDocuments",
              label: "Supporting Documents (optional)",
              type: "file",
              //   maxFileSize: 5000000, // Max 5MB
              required: false,
            },
            {
              id: "additionalNotes",
              label: "Additional Notes or Requests",
              type: "textarea",
              placeholder: "Any additional information or instructions.",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Submit",
      stepDescription: "Review your information and submit the request.",
      groups: [
        {
          groupTitle: "Confirmation",
          fields: [
            {
              id: "reviewSummary",
              label: "Review Your Information",
              type: "text",
              //   display: "summary", // Display the summary of the form data for review
            },
            {
              id: "confirmationCheckbox",
              label:
                "I confirm that the information provided is accurate and complete.",
              type: "checkbox",
              //   required: true,
            },
            {
              id: "termsAndConditions",
              label: "I agree to the Terms and Conditions",
              type: "checkbox-group",
              //   required: true,
            },
          ],
        },
      ],
      //   actions: [
      //     {
      //       buttonLabel: "Submit Request",
      //       buttonAction: "submit", // Submit the form
      //     },
      //   ],
    },
  ],
};
