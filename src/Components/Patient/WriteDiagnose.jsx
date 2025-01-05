import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios
import { useTranslation } from "react-i18next"; // Import for translations

export default function WriteDiagnosis() {
  const { id } = useParams();
  const { t } = useTranslation(); // Use translation hook

  const [formData, setFormData] = useState({
    symptoms: "",
    description: "",
    notes: "",
    patientId: id, // Ensure patientId is initialized correctly
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7127/api/Generic/Create-Diagnosis", formData);
      alert(t("Diagnosis Submitted Successfully!"));
      setFormData((prev) => ({
        ...prev,
        symptoms: "",
        diagnosis: "",
        notes: "",
      }));
      navigate(`/diagnosis/${id}`)
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
     
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <h2 className="text-center mb-4">{t("Diagnosis Form")}</h2>

        <div className="mb-3">
          <label htmlFor="symptoms" className="form-label">
            {t("Symptoms:")}
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            className="form-control"
            placeholder={t("Describe symptoms")}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="diagnosis" className="form-label">
            {t("Diagnosis:")}
          </label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="form-control"
            placeholder={t("Enter diagnosis")}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">
            {t("Notes:")}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            placeholder={t("Add any additional notes (mandatory)")}
          ></textarea>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            {t("Submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
