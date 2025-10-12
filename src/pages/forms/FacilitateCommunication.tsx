import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { facilitateCommunicationSchema } from "../../components/Forms/form-schemas/FacilitateCommunicationSchema";
import { FormLayout } from "../../components/layouts/FormLayout";

function FacilitateCommunication() {
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
    <FormLayout data-id="facilitate-communication-page">
      <ServiceRequestForm
        schema={facilitateCommunicationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="facilitate-communication"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const FacilitateCommunicationForm = FacilitateCommunication;
export default FacilitateCommunication;
