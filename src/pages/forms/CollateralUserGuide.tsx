import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { collateralGuideSchema } from "../../components/Forms/form-schemas/CollateralUserGuide";
import { FormLayout } from "../../components/layouts/FormLayout";

function CollateralUserGuide() {
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
    <FormLayout data-id="collateral-user-guide-page">
      <ServiceRequestForm
        schema={collateralGuideSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="collateral-user-guide"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const CollateralUserGuideForm = CollateralUserGuide;
export default CollateralUserGuide;
