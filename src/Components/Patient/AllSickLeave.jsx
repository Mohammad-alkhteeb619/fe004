import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SickLeaveList = () => {
  const [sickLeaves, setSickLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchSickLeaves = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/AllSickLeave?id=${id}`
        );
        setSickLeaves(response.data);
      } catch (err) {
        setError("Failed to load sick leaves. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSickLeaves();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center-title mb-4 text-white bg-primary py-3 rounded-top">Sick Leaves</h2>
      <table className="table table-hover">
        <thead className="">
          <tr>
            <th>Duration (Days)</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {sickLeaves.map((leave, index) => (
            <tr key={index}>
              <td>{leave.duration}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.reason}</td>
              <td>{new Date(leave.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SickLeaveList;
