import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 
import { useTranslation } from 'react-i18next';

export default function WriteVitalSigns() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bloodPressureError, setBloodPressureError] = useState("");
  const [heartRateError, setHeartRateError] = useState("");
  const { id } = useParams();
  const [breathsError, setBreathsError] = useState("");

  // Initialize vital signs state
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    breaths: "",
    patientId: id,
  });

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitalSigns((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7127/api/Generic/create-VitalSigns",
        vitalSigns
      );
      console.log("Response:", response.data);
      // Redirect to the vital signs history page upon success
      navigate(`/history-vital-signs/${id}`);
    } catch (error) {
      console.error("Error saving vital signs:", error.response || error);
      alert(t("An error occurred while saving the vital signs."));
    }
  };


  const [error, setError] = useState("");


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center-title">
              <h3>{t("Vital Signs Form")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Temperature Field */}
                <div className="mb-3">
  <label htmlFor="temperature" className="form-label">
    {t("Temperature")} <small className="small">{t("normal range:36.5-37.5")}</small>  
  </label>
  <input
    type="number"
    step="0.1"
    id="temperature"
    name="temperature"
    className="form-control"
    value={vitalSigns.temperature}
    onChange={handleInputChange}
    required
    min="24"
    max="44"
  />
  {vitalSigns.temperature && (vitalSigns.temperature < 24 || vitalSigns.temperature > 44) && (
    <div className="text-danger">
      {t("Temperature must be between 24°C and 44°C.")}
    </div>
  )}
</div>


                {/* Blood Pressure Field */}
                <div className="mb-3">
  {/* Blood Pressure Field */}
  <label htmlFor="bloodPressure" className="form-label">
    {t("Blood Pressure")}{" "}
    <small className="small">{t("normal range: 90/120-60/80")}</small>
  </label>
  <input
    type="text"
    id="bloodPressure"
    name="bloodPressure"
    className="form-control"
    placeholder="high / low"
    value={vitalSigns.bloodPressure}
    onChange={(e) => {
      const value = e.target.value;
      const normalizedValue = value.replace(/\s+/g, ""); // Remove spaces

      // Update the input field immediately
      setVitalSigns({
        ...vitalSigns,
        bloodPressure: value, // Keep raw user input to allow editing
      });

      // Validate the format first
      if (!/^\d{0,3}\/?\d{0,3}$/.test(normalizedValue)) {
        setBloodPressureError(
          t("Blood pressure must be in the format high/low (e.g., 120/80).")
        );
        return; // Stop further validation if format is wrong
      }

      // Parse high/low values after format is valid
      const [high, low] = normalizedValue
        .split("/")
        .map((num) => parseInt(num, 10));

      // Check if values are numbers and within valid ranges
      if (
        isNaN(high) || isNaN(low) || // Ensure both parts are numbers
        high < 40 || low < 60 || // Validate minimum ranges
        high > 250 || low > 150 // Validate maximum ranges
      ) {
        setBloodPressureError(
          t("Blood pressure must be between 40/60 and 250/150.")
        );
      } else {
        setBloodPressureError(""); // Clear error if valid
      }
    }}
    required
    title={t("Blood pressure must be in the format high/low (e.g., 120/80)")}
  />
  {bloodPressureError && (
    <div className="text-danger">{bloodPressureError}</div>
  )}
</div>


<div className="mb-3">
  {/* Heart Rate Field */}
  <label htmlFor="heartRate" className="form-label">
    {t("Heart Rate")}{" "}
    <small className="small">{t("normal range:60-100")}</small>
  </label>
  <input
    type="number"
    id="heartRate"
    name="heartRate"
    className="form-control"
    value={vitalSigns.heartRate}
    onChange={(e) => {
      const value = parseInt(e.target.value, 10);

      // Validate Heart Rate values
      if (isNaN(value) || value < 40 || value > 250) {
        setHeartRateError(t("Heart rate must be between 40 and 250 bpm."));
      } else {
        setHeartRateError(""); // Clear error if valid
      }

      // Update the heart rate value
      setVitalSigns({
        ...vitalSigns,
        heartRate: value || "",
      });
    }}
    required
    min="40"
    max="250"
    title="Heart rate must be between 40 and 250 bpm."
  />
  {heartRateError && <div className="text-danger">{heartRateError}</div>}
</div>


                {/* Respiratory Rate Field */}
                <div className="mb-3">
  <label htmlFor="breaths" className="form-label">
    {t("Respiratory Rate")}{" "}
    <small className="small">{t("normal range:12-20")}</small>
  </label>
  <input
    type="number"
    id="breaths"
    name="breaths"
    className="form-control"
    value={vitalSigns.breaths}
    onChange={(e) => {
      const value = parseInt(e.target.value, 10);

      // Validate Respiratory Rate values
      if (isNaN(value) || value < 6 || value > 40) {
        setBreathsError(t("Respiratory rate must be between 6 and 40 breaths per minute."));
      } else {
        setBreathsError(""); // Clear error if valid
      }

      // Update the respiratory rate value
      setVitalSigns({
        ...vitalSigns,
        breaths: value || "",
      });
    }}
    required
    min="6"
    max="40"
    title="Respiratory rate must be between 6 and 40 breaths per minute."
  />
  {breathsError && <div className="text-danger">{breathsError}</div>}
</div>

                {/* Submit Button */}
                <div className="text-center"> <button type="submit" className="major-btn" style={{justifyItems:"center"}}>
                  {t("Save")}
                </button></div>
               
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
