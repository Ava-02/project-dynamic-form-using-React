import React, { useState, useEffect } from "react";
import "./App.css"; // For styling, adjust as needed

const App = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Simulate API response based on form type
  const fetchFormFields = (type) => {
    const responses = {
      "User Information": {
        fields: [
          { name: "FirstName", type: "text", label: "First Name", required: true },
          { name: "LastName", type: "text", label: "Last Name", required: true },
          { name: "Age", type: "number", label: "Age", required: false },
        ],
      },
      "Address Information": {
        fields: [
          { name: "street", type: "text", label: "Street", required: true },
          { name: "city", type: "text", label: "City", required: true },
          { name: "state", type: "dropdown", label: "State", options: ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
        // Union Territories
          "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"], required: true },
          { name: "zipCode", type: "text", label: "Zip Code", required: false },
        ],
      },
      "Payment Information": {
        fields: [
          { name: "cardNumber", type: "text", label: "Card Number", required: true },
          { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
          { name: "cvv", type: "password", label: "CVV", required: true },
          { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
        ],
      },
    };

    return responses[type] || { fields: [] };
  };

  const handleFormTypeChange = (e) => {
    const type = e.target.value;
    setFormType(type);
    const response = fetchFormFields(type);
    setFormFields(response.fields);
    setFormData({});
    setError("");
    setProgress(0);
  };

  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update progress
    const totalRequired = formFields.filter((f) => f.required).length;
    const filledRequired = formFields.filter((f) => f.required && formData[f.name]).length + (value ? 1 : 0);
    setProgress((filledRequired / totalRequired) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = formFields.filter((field) => field.required && !formData[field.name]);
    if (errors.length) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmittedData([...submittedData, formData]);
    setFormData({});
    setProgress(0);
    setError("");
    alert("Form submitted successfully!");
  };

  const handleDelete = (index) => {
    setSubmittedData(submittedData.filter((_, i) => i !== index));
    alert("Entry deleted successfully!");
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <header>
        <h1>Dynamic React Form</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label>
            Select Form Type:
            <select value={formType} onChange={handleFormTypeChange}>
              <option value="">--Select--</option>
              <option value="User Information">User Information</option>
              <option value="Address Information">Address Information</option>
              <option value="Payment Information">Payment Information</option>
            </select>
          </label>

          {formFields.map((field) => (
            <div key={field.name}>
              <label>
                {field.label}
                {field.required && "*"}
                {field.type === "dropdown" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(e, field)}
                  >
                    <option value="">--Select--</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(e, field)}
                    required={field.required}
                  />
                )}
              </label>
            </div>
          ))}

          {error && <p className="error">{error}</p>}
          <progress value={progress} max="100"></progress>
          <button type="submit">Submit</button>
        </form>

        <h2>Submitted Data</h2>
        {submittedData.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <footer>
        <p>Dynamic Form Implementation</p>
      </footer>
    </div>
  );
};

export default App;
