import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function VitalSignsHistory() {
  const { id } = useParams();
  const [vitalSignsHistory, setVitalSignsHistory] = useState([]);
  const { t } = useTranslation(); // Use translation hook

  // Fetch vital signs history on component mount
  useEffect(() => {
    const fetchVitalSignsHistory = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/VitalSigns?id=${id}`
        );
        setVitalSignsHistory(response.data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching vital signs history:", error);
        
      }
    };

    fetchVitalSignsHistory();
  }, [id]); // Re-run the effect when `id` changes

  // Check if the history is loaded and contains data
  if (!vitalSignsHistory.length) {
    return <div>{t("There is no vital signs history to display")}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center-title">
              <h3>{t("Vital Signs History")}</h3>
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>{t("Date")}</th>
                    <th>{t("Temperature")}</th>
                    <th>{t("Blood Pressure")} </th>
                    <th>{t("Heart Rate")} </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {vitalSignsHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.dateRecorded}</td>
                      <td>{entry.temperature}</td>
                      <td>{entry.bloodPressure}</td>
                      <td>{entry.heartRate}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="">
                <h2 className="text-center-title mb-4 text-white bg-primary py-2 rounded-top">{t("Statistics")}</h2>
                <p>
                  <strong className="form-label">{t("Average Temperature:")}</strong> {vitalSignsHistory[0].temperatureAVG} 
                </p>
                <p>
                  <strong className="form-label">{t("Average Heart Rate:")}</strong> {vitalSignsHistory[0].heartRateAVG} 
                </p>
                <p>
                  <strong className="form-label">{t("Average Respiratory Rate:")}</strong> {vitalSignsHistory[0].breathsAVG} 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
