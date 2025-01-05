import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SickLeaveDetails = () => {
  const [sickLeave, setSickLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSickLeave = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/SickLeave?id=${id}`
        );
        setSickLeave(response.data);
      } catch (err) {
        setError("Failed to load sick leave details. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSickLeave();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  if (!sickLeave) {
    return <div className="text-center text-warning mt-5">No data found.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sick Leave Details</h2>
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h5 className="card-title">Details</h5>
          <p>
            <strong>Duration (Days):</strong> {sickLeave.duration}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(sickLeave.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(sickLeave.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Reason:</strong> {sickLeave.reason}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(sickLeave.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SickLeaveDetails;
