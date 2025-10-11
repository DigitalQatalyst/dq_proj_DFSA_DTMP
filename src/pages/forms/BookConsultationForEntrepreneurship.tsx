import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { bookConsultationSchema } from "../../components/Forms/form-schemas/BookConsultation";
import { FormLayout } from "../../components/layouts";

function BookConsultationForEntrepreneurship() {
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
    <FormLayout data-id="book-consultation-for-entrepreneurship-page">
      <ServiceRequestForm
        schema={bookConsultationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="book-consultation-for-entrepreneurship"
      />
    </FormLayout>
  );
}

// Export the specific form name
export const BookConsultationForEntrepreneurshipForm =
  BookConsultationForEntrepreneurship;
export default BookConsultationForEntrepreneurship;
