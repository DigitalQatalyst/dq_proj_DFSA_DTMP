import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { RequestForMembershipSchema } from "../../components/Forms/form-schemas/RequestForMembershipSchema";
import { FormLayout } from "../../components/layouts/FormLayout";

function RequestForMembership() {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };
  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    alert("Form saved successfully!");
  };

  return (
    <FormLayout data-id="request-for-membership-page">
      <ServiceRequestForm
        schema={RequestForMembershipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-for-membership"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const RequestForMembershipForm = RequestForMembership;
export default RequestForMembership;
