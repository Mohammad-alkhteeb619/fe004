import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function WritePrescription() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState([]); // Initialize as an empty array
  const [prescription, setPrescription] = useState({
    Medication: "",
    dosage: "",
    instructions: "",
    patientId: id,
  });
    


    
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/get-drug")
      .then((response) => {
        setDrugs(response.data || []); // Fallback to empty array if data is null/undefined
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://localhost:7127/api/Generic/Create-Precription",
        prescription
      );
      navigate(`/prescription/${id}`);
    } catch (error) {
      console.error("Failed to submit the prescription:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>{t("Prescription Form")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="Medication">{t("Drug Name")}</label>
                  <select
                    className="form-control"
                    id="Medication"
                    name="Medication"
                    value={prescription.Medication} // Bind to prescription.drugId
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t("Select a Drug")}</option>
                    {drugs.map((drug) => (
                      <option key={drug.id} value={drug.name}>
                        {drug.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="dosage" className="form-label">
                    {t("Dosage")}
                  </label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    className="form-control"
                    value={prescription.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="instructions" className="form-label">
                    {t("Instructions")}
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    className="form-control"
                    value={prescription.instructions}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2">
                  {t("Save")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
