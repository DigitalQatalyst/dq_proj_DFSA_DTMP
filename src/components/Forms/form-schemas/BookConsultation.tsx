import * as yup from 'yup'
// Define the form schema for the "Book Consultation for Entrepreneurs" form
export const bookConsultationSchema = {
  formId: 'book-consultation-form',
  formTitle: 'Book Consultation for Entrepreneurs',
  description:
    'Please complete the form below to proceed with your application.',
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
          description: 'Provide details about your business entity',
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
          description: 'Tell us about the person making this request',
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
      id: 'support-details',
      stepTitle: 'Support Details',
      stepDescription: 'Tell us what type of support you need',
      groups: [
        {
          id: 'support-information',
          groupTitle: 'ADD SUPPORT DETAILS',
          description: 'Describe the type of support you are seeking',
          fields: [
            {
              id: 'supportType',
              label: 'Support Type',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Select support type',
                  value: '',
                },
                {
                  label: 'Technical',
                  value: 'technical',
                },
                {
                  label: 'Consultation',
                  value: 'consultation',
                },
                {
                  label: 'Business Planning',
                  value: 'business-planning',
                },
                {
                  label: 'Marketing',
                  value: 'marketing',
                },
                {
                  label: 'Other',
                  value: 'other',
                },
              ],
              validation: {
                required: 'Support type is required',
              },
            },
            {
              id: 'otherSupportType',
              label: 'Please specify the support type',
              type: 'text',
              required: true,
              placeholder: ' Financial Restructuring',
              conditionalDisplay: {
                field: 'supportType',
                value: 'other',
              },
              validation: {
                required: 'Please specify the support type',
                minLength: 3,
                message: 'Support type must be at least 3 characters',
              },
            },
            {
              id: 'entityType',
              label: 'Entity Type',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Select entity type',
                  value: '',
                },
                {
                  label: 'Union Co-op',
                  value: 'union-coop',
                },
                {
                  label: 'Private',
                  value: 'private',
                },
                {
                  label: 'Public',
                  value: 'public',
                },
                {
                  label: 'Non-profit',
                  value: 'non-profit',
                },
              ],
              validation: {
                required: 'Entity type is required',
              },
            },
            {
              id: 'supportSubject',
              label: 'Support Subject',
              type: 'text',
              required: true,
              placeholder: ' Market Expansion Strategy',
              validation: {
                required: 'Support subject is required',
                minLength: 5,
                message: 'Subject must be at least 5 characters',
              },
            },
            {
              id: 'financialImpact',
              label: 'Financial Impact',
              type: 'number',
              required: true,
              placeholder: ' 50000',
              validation: {
                required: 'Financial impact is required',
                min: 0,
                message: 'Financial impact must be a positive number',
              },
            },
            {
              id: 'supportDescription',
              label: 'Support Description',
              type: 'textarea',
              required: true,
              placeholder:
                ' Our company is looking to expand into new markets and requires strategic guidance on market research, entry strategy, and potential partnerships.',
              validation: {
                required: 'Description is required',
                minLength: 20,
                message: 'Description must be at least 20 characters',
              },
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
// Validation schema for the "Book Consultation for Entrepreneurs" form
export const bookConsultationValidationSchema = yup.object({
  // Step 1: Company Information
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
  // Step 2: Support Details
  supportType: yup.string().required('Support type is required'),
  otherSupportType: yup.string().when('supportType', {
    is: 'other',
    then: (schema) =>
      schema
        .required('Please specify the support type')
        .min(3, 'Support type must be at least 3 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),
  entityType: yup.string().required('Entity type is required'),
  supportSubject: yup
    .string()
    .required('Support subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  financialImpact: yup
    .number()
    .required('Financial impact is required')
    .min(0, 'Financial impact must be a positive number'),
  supportDescription: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  // Step 3: Data Sharing Consent
  termsAgreed: yup
    .string()
    .oneOf(['confirm'], 'You must confirm to proceed')
    .required('You must confirm to proceed'),
})
