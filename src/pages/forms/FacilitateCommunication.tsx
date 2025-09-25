import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
// import { FacilitateCommunicationSchema } from "../../components/Forms/form-schemas/FacilitateCommunicationSchema";

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
    <div>
      {/* Uncomment when schema is ready */}
      {/* <ServiceRequestForm
        schema={FacilitateCommunicationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="facilitate-communication"
      /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Facilitate Communication</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Facilitate Communication form will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export the specific form name
export const FacilitateCommunicationForm = FacilitateCommunication;
export default FacilitateCommunication;
