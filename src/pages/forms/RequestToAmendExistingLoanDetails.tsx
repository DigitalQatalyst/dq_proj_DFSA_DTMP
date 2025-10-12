import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { amendExistingLoanSchema } from "../../components/Forms/form-schemas/AmendExistingLoanSchema";
import { FormLayout } from "../../components/layouts/FormLayout";

function RequestToAmendExistingLoanDetails() {
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
    <FormLayout data-id="request-to-amend-existing-loan-details-page">
      <ServiceRequestForm
        schema={amendExistingLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-to-amend-existing-loan-details"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const RequestToAmendExistingLoanDetailsForm =
  RequestToAmendExistingLoanDetails;
export default RequestToAmendExistingLoanDetails;
