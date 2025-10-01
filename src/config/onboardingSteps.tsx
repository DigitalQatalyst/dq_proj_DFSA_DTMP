// config/onboardingSteps.js
import {
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  BanknoteIcon,
  CheckIcon,
} from "lucide-react";

export const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome",
    type: "welcome",
    icon: <BuildingIcon size={20} />,
  },
  {
    id: "business",
    title: "Business Details",
    type: "form",
    icon: <BuildingIcon size={20} />,
    sections: [
      {
        title: "Company Identity",
        description: "Basic information about your business",
        fields: [
          {
            id: "registrationNumber",
            label: "Registration Number",
            fieldName: "RegistrationNumber",
            required: true,
            minLength: 3,
            pattern: "^[a-zA-Z0-9-]+$",
            patternErrorMessage:
              "Registration number can only contain letters, numbers, and hyphens",
            helpText: "Your official business registration number",
          },
          {
            id: "establishmentDate",
            label: "Establishment Date",
            fieldName: "EstablishmentDate",
            required: true,
            type: "date",
            helpText: "The date your company was officially established",
          },
          {
            id: "businessSize",
            label: "Business Size",
            fieldName: "BusinessSize",
            required: true,
            type: "select",
            options: [
              { value: "", label: "Select business size" },
              { value: "Micro", label: "Micro (1-9 employees)" },
              { value: "Small", label: "Small (10-49 employees)" },
              { value: "Medium", label: "Medium (50-249 employees)" },
              { value: "Large", label: "Large (250+ employees)" },
            ],
            tooltip:
              "Business size determines eligibility for certain programs and support services",
          },
        ],
      },
    ],
  },
  {
    id: "profile",
    title: "Business Profile",
    type: "form",
    icon: <BuildingIcon size={20} />,
    sections: [
      {
        title: "Business Description",
        description: "Help us understand your business better",
        fields: [
          {
            id: "businessPitch",
            label: "Business Pitch",
            fieldName: "BusinessPitch",
            required: true,
            type: "textarea",
            placeholder: "Briefly describe what your business does",
            minLength: 20,
            maxLength: 500,
            helpText: "A concise description of your business proposition",
          },
          {
            id: "problemStatement",
            label: "Problem Statement",
            fieldName: "ProblemStatement",
            required: true,
            type: "textarea",
            placeholder: "What problem does your business solve?",
            minLength: 20,
            maxLength: 500,
            helpText:
              "Describe the market gap or problem your business addresses",
          },
        ],
      },
    ],
  },
  {
    id: "location",
    title: "Location & Contact",
    type: "form",
    icon: <MapPinIcon size={20} />,
    sections: [
      {
        title: "Business Location",
        description: "Where your business is based",
        fields: [
          {
            id: "address",
            label: "Address",
            fieldName: "Address",
            required: true,
            minLength: 5,
            helpText: "Your business street address",
          },
          {
            id: "city",
            label: "City",
            fieldName: "City",
            required: true,
            pattern: "^[a-zA-Z\\s-]+$",
            patternErrorMessage:
              "City name can only contain letters, spaces, and hyphens",
            helpText: "City where your business is located",
          },
          {
            id: "country",
            label: "Country",
            fieldName: "Country",
            required: true,
            type: "select",
            options: [
              { value: "", label: "Select country" },
              { value: "UAE", label: "United Arab Emirates" },
              { value: "KSA", label: "Saudi Arabia" },
              { value: "Qatar", label: "Qatar" },
              { value: "Bahrain", label: "Bahrain" },
              { value: "Kuwait", label: "Kuwait" },
              { value: "Oman", label: "Oman" },
              { value: "Other", label: "Other" },
            ],
            helpText: "Country where your business is registered",
          },
        ],
      },
      {
        title: "Online Presence",
        description: "Your business on the web",
        fields: [
          {
            id: "website",
            label: "Website",
            fieldName: "Website",
            required: false,
            pattern:
              "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$",
            patternErrorMessage: "Please enter a valid website URL",
            placeholder: "https://www.example.com",
            helpText: "Your business website (if available)",
          },
        ],
      },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    type: "form",
    icon: <UsersIcon size={20} />,
    sections: [
      {
        title: "Team & History",
        description: "Information about your team and founding",
        fields: [
          {
            id: "employeeCount",
            label: "Employee Count",
            fieldName: "EmployeeCount",
            required: true,
            type: "number",
            min: 1,
            helpText: "Current number of employees in your company",
          },
          {
            id: "founders",
            label: "Founders",
            fieldName: "Founders",
            required: true,
            placeholder: "Names of founders, separated by commas",
            minLength: 3,
            helpText: "Names of all company founders",
          },
          {
            id: "foundingYear",
            label: "Founding Year",
            fieldName: "FoundingYear",
            required: true,
            type: "date",
            helpText: "Date when your company was founded",
          },
        ],
      },
    ],
  },
  {
    id: "funding",
    title: "Funding",
    type: "form",
    icon: <BanknoteIcon size={20} />,
    sections: [
      {
        title: "Financial Information",
        description: "Details about your business finances",
        fields: [
          {
            id: "initialCapital",
            label: "Initial Capital (USD)",
            fieldName: "InitialCapitalUSD",
            required: true,
            type: "number",
            min: 0,
            helpText: "Initial investment used to start the business",
          },
          {
            id: "fundingNeeds",
            label: "Funding Needs (USD)",
            fieldName: "FundingNeedsUSD",
            required: false,
            type: "number",
            min: 0,
            helpText:
              "Additional funding you are currently seeking (if applicable)",
          },
        ],
      },
      {
        title: "Business Requirements",
        description: "What your business needs to grow",
        fields: [
          {
            id: "businessRequirements",
            label: "Business Requirements",
            fieldName: "BusinessRequirements",
            required: true,
            type: "textarea",
            placeholder:
              "List your top business requirements (e.g., marketing, technology, mentorship)",
            minLength: 10,
            helpText: "Describe what your business requires to succeed and grow",
          },
          {
            id: "businessNeeds",
            label: "Business Needs",
            fieldName: "BusinessNeeds",
            required: true,
            type: "textarea",
            placeholder:
              "Describe your business needs for growth and scale",
            minLength: 10,
            helpText: "What does your business need to achieve its goals",
          },
        ],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    type: "review",
    icon: <CheckIcon size={20} />,
  },
];
