import { useState, useRef } from "react";

export function getApiUrl() {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL;
  // eslint-disable-next-line no-undef
  if (typeof process !== "undefined" && process.env && process.env.API_URL)
    // eslint-disable-next-line no-undef
    return process.env.API_URL;
  return "http://localhost:8000";
}

export const useSupportPageLogic = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const topics = [
    { id: 'order-issue', label: 'Order Issue' },
    { id: 'payment', label: 'Payment & Billing' },
    { id: 'delivery', label: 'Delivery Problem' },
    { id: 'account', label: 'Account & Login' },
    { id: 'refund', label: 'Refund Request' },
    { id: 'feedback', label: 'Feedback & Suggestions' },
    { id: 'product', label: 'Product Inquiry' },
    { id: 'other', label: 'Other' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic_id: "",
    message: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  // File handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();
  const removeFile = () => setFile(null);

  // Validation helpers
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);


  // Form field change handler with real-time sanitization
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Sanitize email input in real-time
    if (name === "email") {
      // Remove unsafe characters commonly used in XSS/SQL injection
      // eslint-disable-next-line no-useless-escape
      sanitizedValue = value.replace(/[<>"'();\\\/]/g, "");
    }

    // Update formData
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Validate field
    let error = "";
    if (name === "name" && !/^[A-Za-z\s]*$/.test(sanitizedValue)) {
      error = "Name can only contain letters";
    }
    if (name === "email" && !validateEmail(sanitizedValue)) {
      error = "Invalid email or unsafe characters detected";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateName(formData.name))
      newErrors.name = "Name can only contain letters and spaces";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.topic_id)
      newErrors.topic_id = "Please select a topic";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("topic_id", formData.topic_id);
      formPayload.append("message", formData.message);

      if (file) {
        formPayload.append("attachment", file);
      }

      const response = await fetch(
        `${getApiUrl()}/api/support`,
        {
          method: "POST",
          body: formPayload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || data.errors ? JSON.stringify(data.errors) : "Submission failed";
        throw new Error(message);
      }

      alert("Support request submitted successfully!");
      setFormData({ name: "", email: "", topic_id: "", message: "" });
      setFile(null);
      setErrors({});
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    }
  };

  return {
    file,
    fileInputRef,
    formData,
    errors,
    topics,
    handleChange,
    handleFileChange,
    handleFileClick,
    handleFileDrop,
    handleDragOver,
    removeFile,
    handleSubmit,
  };
};
