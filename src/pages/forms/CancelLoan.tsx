import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { loanCancellationSchema } from "../../components/Forms/form-schemas/CancelLoans";
import { FormLayout } from "../../components/layouts/FormLayout";

function CancelLoan() {
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
    <FormLayout data-id="cancel-loan-page">
      <ServiceRequestForm
        schema={loanCancellationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="cancel-loan"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const CancelLoanForm = CancelLoan;
export default CancelLoan;
