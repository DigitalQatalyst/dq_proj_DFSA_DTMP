import { useState } from "react";
import { FormLayout } from "../../components/layouts/FormLayout";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { RequestForFundingSchema } from "../../components/Forms/form-schemas/RequestForFundingSchema";

function RequestForFunding() {
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
    <FormLayout data-id="request-for-funding-page">
      <ServiceRequestForm
        schema={RequestForFundingSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-for-funding"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const RequestForFundingForm = RequestForFunding;
export default RequestForFunding;
