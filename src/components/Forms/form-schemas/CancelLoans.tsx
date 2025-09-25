import * as yup from 'yup'
// Define the form schema for the "Loan Cancellation" form
export const loanCancellationSchema = {
  formId: 'loan-cancellation-form',
  formTitle: 'Loan Cancellation Request',
  description:
    'Please complete this form to request the cancellation of your existing loan. Provide all required information and documentation to process your request.',
  multiStep: true,
  steps: [
    {
      id: 'company-information',
      stepTitle: 'Company Information',
      stepDescription: 'Tell us about yourself and your company',
      groups: [
        {
          id: 'company-details',
          groupTitle: 'COMPANY INFORMATION',
          groupDescription: 'Provide details about your business entity',
          fields: [
            {
              id: 'companyName',
              label: 'Company name',
              type: 'text',
              required: true,
              placeholder: ' Innovate Solutions LLC',
              validation: {
                required: 'Company name is required',
                pattern: '^[a-zA-Z0-9&\\-.\\s]+$',
                message:
                  'Company name can only contain letters, numbers, &, -, and . characters',
                minLength: 2,
              },
            },
            {
              id: 'companyNumber',
              label: 'Company number',
              type: 'text',
              required: true,
              placeholder: ' BUS12345678',
              validation: {
                required: 'Company number is required',
                pattern: '^[a-zA-Z0-9-]+$',
                message: 'Company number must be alphanumeric',
                minLength: 6,
                maxLength: 12,
              },
            },
          ],
        },
        {
          id: 'requestor-information',
          groupTitle: 'REQUESTOR INFORMATION',
          groupDescription: 'Tell us about the person making this request',
          fields: [
            {
              id: 'requestorName',
              label: 'Name of person making the submission',
              type: 'text',
              required: true,
              placeholder: ' Jane Smith',
              validation: {
                required: 'Name is required',
                pattern: '^[a-zA-Z\\s]+$',
                message: 'Name can only contain letters and spaces',
                minLength: 2,
              },
            },
            {
              id: 'position',
              label: 'Position',
              type: 'text',
              required: true,
              placeholder: ' Marketing Director',
              validation: {
                required: 'Position is required',
                pattern: '^[a-zA-Z\\s]+$',
                message: 'Position can only contain letters and spaces',
              },
            },
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              required: true,
              placeholder: ' jane.smith@example.com',
              validation: {
                required: 'Email is required',
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                message: 'Invalid email address',
              },
            },
            {
              id: 'telephone',
              label: 'Contact telephone number',
              type: 'tel',
              required: true,
              placeholder: ' +12025550178',
              validation: {
                required: 'Telephone number is required',
                pattern: '^\\+?[0-9]{10,13}$',
                message:
                  'Telephone number must be in international format and contain 10-13 digits',
              },
            },
          ],
        },
      ],
    },
    {
  id: 'loan-details',
  stepTitle: 'Loan Details',
  stepDescription: 'Provide information about the loan you wish to cancel',
  groups: [
    {
      id: 'cancellation-details',
      groupTitle: 'FILL IN APPLICATION',
      groupDescription: 'Enter details about your loan and reason for cancellation',
      fields: [
        {
          id: 'fundingRequestNumber',
          label: 'Funding Request Number',
          type: 'text',
          required: true,
          placeholder: 'Enter your funding request number',
          validation: {
            required: 'Funding request number is required',
            pattern: '^[A-Za-z0-9-]+$',
            message: 'Funding request number must be alphanumeric',
            minLength: 4,
          },
        },
        {
          id: 'cancellationReason',
          label: 'Cancellation Details',
          type: 'textarea',
          required: true,
          placeholder: 'Please explain in detail why you are requesting to cancel this loan',
          validation: {
            required: 'Cancellation reason is required',
            minLength: 50,
            message: 'Please provide a detailed explanation (at least 50 characters)',
          },
        },
      ],
    },
    {
      id: 'documents',
      groupTitle: 'UPLOAD DOCUMENTS',
      groupDescription: 'Upload the necessary documents to support your cancellation request',
      fields: [
        {
          id: 'cancellationLetter',
          label: 'Confirmation on Loan Cancellation (Official Letter/Email)',
          type: 'file',
          required: true,
          accept: '.pdf,.jpg,.png,.docx',
          validation: {
            required: 'Cancellation letter is required',
          },
          helperText: 'Upload the official letter/email confirming your loan cancellation',
          uploadedFile: {
            fileName: 'Screenshot 2025-09-22 103542.png', // Example uploaded file name
            fileSize: '2 MB', // You can dynamically display the size
          },
          actions: [
            {
              label: 'Change File',
              action: 'changeFile', // Implement function to change file
            },
            {
              label: 'Delete',
              action: 'deleteFile', // Implement function to delete file
            },
          ],
        },
      ],
    },
  ],
},

    {
      id: 'data-sharing',
      stepTitle: 'Data Sharing Consent',
      stepDescription: 'Review and provide consent for data sharing',
      groups: [
        {
          id: 'consent',
          groupTitle: 'DATA SHARING CONSENT',
          groupDescription:
            'Please review our data sharing policy and provide your consent',
          fields: [
            {
              id: 'termsAgreed',
              label:
                'I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.',
              type: 'radio',
              required: true,
              options: [
                {
                  value: 'confirm',
                  label: 'I confirm',
                },
              ],
              validation: {
                required: 'You must confirm to proceed',
              },
            },
          ],
        },
      ],
    },
  ],
}
// Validation schema for the "Loan Cancellation" form
export const loanCancellationValidationSchema = yup.object({
  // Step 1: Company Information
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  companyRegistration: yup
    .string()
    .required('Company registration number is required')
    .matches(/^[a-zA-Z0-9-]+$/, 'Registration number must be alphanumeric')
    .min(4, 'Registration number must be at least 4 characters')
    .max(20, 'Registration number must not exceed 20 characters'),
  tradeLicenseNumber: yup.string().optional(),
  // Step 2: Requestor Information
  requesterName: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+?[0-9]{10,15}$/,
      'Phone number must be in international format with 10-15 digits',
    ),
  // Step 3: Loan Details
  fundingRequestNumber: yup
    .string()
    .required('Funding request number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Funding request number must be alphanumeric')
    .min(4, 'Funding request number must be at least 4 characters'),
  loanAmount: yup
    .number()
    .required('Loan amount is required')
    .min(1, 'Loan amount must be greater than 0'),
  loanApprovalDate: yup.date().required('Loan approval date is required'),
  cancellationReason: yup
    .string()
    .required('Cancellation reason is required')
    .min(50, 'Please provide a detailed explanation (at least 50 characters)'),
  cancellationType: yup.string().required('Cancellation type is required'),
  partialAmount: yup.number().when('cancellationType', {
    is: 'partial',
    then: (schema) =>
      schema
        .required('Partial cancellation amount is required')
        .min(1, 'Amount must be greater than 0'),
    otherwise: (schema) => schema.optional(),
  }),
  // Step 4: Documents
  cancellationLetter: yup.mixed().required('Cancellation letter is required'),
  identityDocument: yup.mixed().required('ID document is required'),
  additionalDocuments: yup.mixed().optional(),
  // Step 5: Consent
  dataConsent: yup
    .boolean()
    .oneOf([true], 'You must confirm to proceed')
    .required('You must confirm to proceed'),
  additionalNotes: yup.string().optional(),
})
