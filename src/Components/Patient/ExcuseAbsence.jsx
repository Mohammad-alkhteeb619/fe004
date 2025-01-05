import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ExcuseAbsence = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    duration: "",
    startDate: "",
    endDate: "",
    reason: "",
    patientId: id,
  });
  const [patient, setPatient] = useState(null);

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Patient/GetById/${id}`
        );
        setPatient(response.data.patient);
        
      } catch (error) {
        console.error("Error fetching patient data:", error);
       
      }
    };
    fetchPatient();
  }, [id, t]);

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
      await axios.post(
        `https://localhost:7127/api/Generic/create-SickLeave`,
        formData
      );
     navigate(`/sick-leave/${id}`)
      setFormData({
        duration: "",
        startDate: "",
        endDate: "",
        reason: "",
        patientId: id,
      });
    } catch (error) {
      alert(t("Failed to submit excuse. Please try again later."));
      console.error("Submission error:", error);
    }
  };


  return (
    <div className="container mt-4">
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h2 className="text-center mb-4">{t("Sick Leave Form")}</h2>

        <div className="mb-3">
          <label htmlFor="patientName" className="form-label">
            {t("Patient Name:")}
          </label>
          {patient ? (
            <h4>
              {patient.firstName} {patient.lastName}
            </h4>
          ) : (
            <p>{t("Loading patient data...")}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            {t("Duration")} ({t("days")}):
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min={1}
            className="form-control"
            placeholder={t("Enter duration of absence")}
          />
        </div>

        <div className="mb-3 row">
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label">
              {t("Start Date:")}
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="form-control"
              min={new Date(new Date().setDate(new Date().getDate() +1))
                .toISOString()
                .split("T")[0]} // Calculate tomorrow's date
                
                onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label">
              {t("End Date:")}
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="form-control"
              min={new Date(new Date().setDate(new Date().getDate() + 2))
                .toISOString()
                .split("T")[0]} // Calculate tomorrow's date
                
                onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="reason" className="form-label">
            {t("Absence Reason:")}
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="form-control"
            placeholder={t("Enter reason for absence")}
            style={{ minHeight: "100px" }}
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
};

export default ExcuseAbsence;
