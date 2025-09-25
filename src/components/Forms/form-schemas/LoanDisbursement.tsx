import * as yup from 'yup'
// Define the form schema for the "Reallocation of Loan Disbursement" form
export const reallocationLoanSchema = {
  formId: 'reallocation-loan-form',
  formTitle: 'Reallocation of Loan Disbursement',
  description:
    'Please complete the form below to proceed with your application.',
  multiStep: true,
  steps: [
    {
      id: 'company-information',
      stepTitle: 'Company and Requestor Information',
      description: 'Please provide company and requestor details',
      groups: [
        {
          id: 'company-details',
          title: 'COMPANY INFORMATION',
          description: 'Provide details about your business entity',
          fields: [
            {
              id: 'companyName',
              label: 'Company Name',
              type: 'text',
              required: true,
              placeholder: 'Enter company name',
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
              label: 'Company Number',
              type: 'text',
              required: true,
              placeholder: 'Enter company number',
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
          title: 'REQUESTOR INFORMATION',
          description: 'Tell us about the person making this request',
          fields: [
            {
              id: 'requestorName',
              label: 'Name of Person Making the Submission',
              type: 'text',
              required: true,
              placeholder: 'Enter name of person making the submission',
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
              placeholder: 'Enter the position of the requestor',
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
              placeholder: 'Enter email address',
              validation: {
                required: 'Email is required',
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                message: 'Invalid email address',
              },
            },
            {
              id: 'telephone',
              label: 'Contact Telephone Number',
              type: 'tel',
              required: true,
              placeholder: 'Enter contact number',
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
      stepTitle: 'Loan Disbursement Details',
      description:
        'Please provide detailed information regarding your reallocation of loan disbursement request. The funding request number is provided below.',
      groups: [
        {
          id: 'funding-details',
          title: 'LOAN DISBURSEMENT DETAILS',
          description:
            'Provide information about your loan disbursement request',
          fields: [
            {
              id: 'fundingRequestNumber',
              label: 'Funding Request Number',
              type: 'text',
              required: true,
              placeholder: 'Enter the funding request number',
              validation: {
                required: 'Funding request number is required',
                pattern: '^[a-zA-Z0-9-]+$',
                message: 'Funding request number must be alphanumeric',
                minLength: 6,
                maxLength: 15,
              },
            },
            {
              id: 'description',
              label: 'Description',
              type: 'textarea',
              required: true,
              placeholder:
                'Enter details related to disburse an approved loan on the received funding from Khalifa Fund for Enterprise Development',
              validation: {
                required: 'Description is required',
                minLength: 20,
                message: 'Description must be at least 20 characters',
              },
            },
          ],
        },
        {
          id: 'document-upload',
          title: 'DOCUMENT UPLOAD',
          description:
            'Please upload the required documents below to support your reallocation of loan disbursement request. You may upload the documents one by one, or zip multiple documents and upload them together.',
          fields: [
            {
              id: 'detailedLetter',
              label: 'Detailed letter from the company',
              type: 'file',
              required: true,
              accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip',
              validation: {
                required: 'Detailed letter is required',
              },
            },
            {
              id: 'supportingDocuments',
              label: 'Supporting Documents (Quotation and Invoices)',
              type: 'file',
              required: true,
              accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip',
              multiple: true,
              validation: {
                required: 'Supporting documents are required',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'data-sharing',
      stepTitle: 'Data Sharing Consent',
      description: 'Review and provide consent for data sharing',
      groups: [
        {
          id: 'consent',
          title: 'DATA SHARING CONSENT',
          description:
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
// Validation schema for the "Reallocation of Loan Disbursement" form
export const reallocationLoanValidationSchema = yup.object({
  // Step 1: Company and Requestor Information
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .matches(
      /^[a-zA-Z0-9&\-.\s]+$/,
      'Company name can only contain letters, numbers, &, -, and . characters',
    ),
  companyNumber: yup
    .string()
    .required('Company number is required')
    .matches(/^[a-zA-Z0-9-]+$/, 'Company number must be alphanumeric')
    .min(6, 'Company number must be at least 6 characters')
    .max(12, 'Company number must not exceed 12 characters'),
  requestorName: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  position: yup
    .string()
    .required('Position is required')
    .matches(/^[a-zA-Z\s]+$/, 'Position can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email address',
    ),
  telephone: yup
    .string()
    .required('Telephone number is required')
    .matches(
      /^\+?[0-9]{10,13}$/,
      'Telephone number must be in international format and contain 10-13 digits',
    ),
  // Step 2: Loan Disbursement Details
  fundingRequestNumber: yup
    .string()
    .required('Funding request number is required')
    .matches(/^[a-zA-Z0-9-]+$/, 'Funding request number must be alphanumeric')
    .min(6, 'Funding request number must be at least 6 characters')
    .max(15, 'Funding request number must not exceed 15 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  detailedLetter: yup.mixed().required('Detailed letter is required'),
  supportingDocuments: yup
    .mixed()
    .required('Supporting documents are required'),
  // Step 3: Data Sharing Consent
  termsAgreed: yup
    .string()
    .oneOf(['confirm'], 'You must confirm to proceed')
    .required('You must confirm to proceed'),
})
