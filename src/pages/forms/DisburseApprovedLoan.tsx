import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { DisburseApprovedLoanSchema } from "../../components/Forms/form-schemas/DisburseApprovedLoanSchema";
import { FormLayout } from "../../components/layouts/FormLayout";

function DisburseApprovedLoan() {
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
    <FormLayout data-id="disburse-approved-loan-page">
      <ServiceRequestForm
        schema={DisburseApprovedLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="disburse-approved-loan"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const DisburseApprovedLoanForm = DisburseApprovedLoan;
export default DisburseApprovedLoan;
