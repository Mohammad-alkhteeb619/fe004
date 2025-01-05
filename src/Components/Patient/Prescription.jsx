import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PrescriptionDetails() {
    const {id}  = useParams();
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    // Fetch prescription details
    axios
      .get(`https://localhost:7127/api/Generic/Precription?id=${id}`)
      .then((response) => {
        setPrescription(response.data);
      })
      .catch((error) => {
        console.error("Error fetching prescription details:", error);
      });
  }, [id]);

  if (!prescription) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading prescription details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>{"Prescription Details"}</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>{"Patient Name:"}</strong>
                <p>{prescription.patientName}</p>
              </div>
              <div className="mb-3">
                <strong>{"Medication:"}</strong>
                <p>{prescription.medication}</p>
              </div>

              <div className="mb-3">
                <strong>{"Dosage:"}</strong>
                <p>{prescription.dosage}</p>
              </div>

              <div className="mb-3">
                <strong>{"Instructions:"}</strong>
                <p>{prescription.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
