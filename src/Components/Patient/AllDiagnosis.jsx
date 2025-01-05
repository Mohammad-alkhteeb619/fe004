import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DiagnosisCard = () => {
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/AllDiagnosis?id=${id}`
        );
        setDiagnosis(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-danger mt-4">Error: {error}</div>;
  if (!diagnosis || diagnosis.length === 0)
    return <div className="text-muted mt-4">No diagnosis data available.</div>;

  return (
    <div className="container mt-4">
      {diagnosis.map((ele, index) => (
        <div className="card shadow-sm mb-3" key={index}>
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Diagnosis Details</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong>Patient Name:</strong>
              <p className="mb-1">{ele.patientName}</p>
            </div>
            <div className="mb-3">
              <strong>Symptoms:</strong>
              <p className="mb-1">{ele.symptoms}</p>
            </div>
            <div className="mb-3">
              <strong>Notes:</strong>
              <p className="mb-1">{ele.notes || "No Notes Provided."}</p>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted">
              Last updated: {new Date(ele.created).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisCard;
