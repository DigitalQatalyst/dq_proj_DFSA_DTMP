import { useState } from "react";
import { TrainingInEntrepreneurshipSchema } from "../../components/Forms/form-schemas/TrainingInEnterprenuershipSchema";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { FormLayout } from "../../components/layouts/FormLayout";

function TrainingInEntrepreneurship() {
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
    <FormLayout data-id="training-in-entrepreneurship-page">
      <ServiceRequestForm
        schema={TrainingInEntrepreneurshipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="training-in-entrepreneurship"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const TrainingInEntrepreneurshipForm = TrainingInEntrepreneurship;
export default TrainingInEntrepreneurship;
