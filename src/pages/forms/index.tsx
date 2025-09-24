import { useState } from "react";
import { generalServiceRequestSchema } from "../../components/Forms/form-schemas/SingleStep";
import { ServiceRequestForm } from "../../components/Forms/ServiceRequestForm";

function Forms() {
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
    <div>
      <ServiceRequestForm
        schema={generalServiceRequestSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="general-service-request"
      />
    </div>
  );
}

export default Forms;
