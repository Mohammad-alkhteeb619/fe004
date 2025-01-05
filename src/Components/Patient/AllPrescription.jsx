import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AllPrescriptions() {
      const {id}  = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all prescriptions
    axios
      .get(`https://localhost:7127/api/Generic/AllPrecription?id=${id}`)
      .then((response) => {
        setPrescriptions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to fetch prescriptions.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }
if(prescriptions[0]==null){
  return <div>there is no prescriptions</div>
  
}

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h3 className="text-center mb-4">All Prescriptions of {prescriptions.at(0).patientName}</h3>
          {prescriptions.length === 0 ? (
            <p className="text-center">No prescriptions available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                  <th>Created At</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Instructions</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={index}>
                        <td>{prescription.createdAt}</td>
                      <td>{prescription.medication}</td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.instructions}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
