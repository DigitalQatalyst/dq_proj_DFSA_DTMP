import React, { useState } from 'react';
import {
  ContentWrapper,
  ContentColumn,
  StyledHeader,
  StyledBody,
  Description,
  HelpLink,
  FeatureContainer,
  FeatureItem,
  FormColumn,
  FormRow,
  FormFieldWrapper,
  FormLabel,
  FormField,
  FormSelectWrapper,
  FormSelect,
  FormTextareaWrapper,
  FormTextarea,
  PrivacyText,
  PrivacyLink,
  SubmitButton,
} from './styles';

// Define props interface for the component
interface EnquiryProps {
  id?: string;
}

export const Enquiry: React.FC<EnquiryProps> = ({ id }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    enquiryType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHelpLinkClick = () => {
    window.location.href = "/faq"; // Replace with React Router if integrated
  };

  const handlePrivacyLinkClick = () => {
    window.location.href = "/development"; // Replace with React Router if integrated
  };

  return (
    <div id={id}>
      <div style={{ width: '100%', padding: '0', margin: '0' }}>
        <ContentWrapper>
          <ContentColumn>
            <StyledHeader>CONTACT OUR TEAM</StyledHeader>
            <StyledBody>Ready to Make an Enquiry?</StyledBody>
            <Description>
              Tell us what you're looking for and we'll get back to you shortly.
              For additional information you can also visit our{" "}
              <HelpLink onClick={handleHelpLinkClick}>Help Center</HelpLink>.
            </Description>
            <FeatureContainer>
              <FeatureItem>
                <span>✓</span> 500+ Tailored Services
              </FeatureItem>
              <FeatureItem>
                <span>✓</span> AI Support for Every Stage of Your Business
              </FeatureItem>
              <FeatureItem>
                <span>✓</span> Simplified access, all in one place
              </FeatureItem>
              <FeatureItem>
                <span>✓</span> Support that grows with your business
              </FeatureItem>
            </FeatureContainer>
          </ContentColumn>

          <FormColumn>
            <FormRow>
              <FormFieldWrapper>
                <FormLabel>First Name</FormLabel>
                <FormField
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </FormFieldWrapper>
              <FormFieldWrapper>
                <FormLabel>Last Name</FormLabel>
                <FormField
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormFieldWrapper>
            </FormRow>

            <FormRow>
              <FormFieldWrapper>
                <FormLabel>Email</FormLabel>
                <FormField
                  type="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormFieldWrapper>
              <FormFieldWrapper>
                <FormLabel>Phone number</FormLabel>
                <FormField
                  type="tel"
                  name="phoneNumber"
                  placeholder="+971 xxx xxxx"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormFieldWrapper>
            </FormRow>

            <FormRow>
              <FormSelectWrapper>
                <FormLabel>Select Enquiry Type</FormLabel>
                <FormSelect
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Funding Request">Funding Request</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Business Consultation">
                    Business Consultation
                  </option>
                  <option value="Event Registration">Event Registration</option>
                  <option value="Legal or Compliance">Legal or Compliance</option>
                  <option value="Product/Service Inquiry">
                    Product/Service Inquiry
                  </option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Feedback/Suggestions">
                    Feedback/Suggestions
                  </option>
                  <option value="Partnership/Collaboration">
                    Partnership/Collaboration
                  </option>
                </FormSelect>
              </FormSelectWrapper>
            </FormRow>

            <FormRow>
              <FormTextareaWrapper>
                <FormLabel>Message</FormLabel>
                <FormTextarea
                  name="message"
                  placeholder="Describe your enquiry in detail"
                  value={formData.message}
                  onChange={handleChange}
                />
              </FormTextareaWrapper>
            </FormRow>

            <PrivacyText>
              <span style={{ color: "#FF4C51" }}>*</span> By submitting this form,
              you agree to our{" "}
              <PrivacyLink onClick={handlePrivacyLinkClick}>
                Privacy Policy
              </PrivacyLink>
              .
            </PrivacyText>

            <SubmitButton type="button">
              Submit Enquiry
            </SubmitButton>
          </FormColumn>
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Enquiry;