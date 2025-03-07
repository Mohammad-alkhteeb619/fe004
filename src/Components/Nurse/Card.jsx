import { useState, useEffect } from "react";
import Filter from "../GeneralBlock/Filter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpinnerLoading from "../GeneralBlock/Spinner";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useTranslation } from 'react-i18next';

export default function Card() {
  const { t, i18n } = useTranslation();
  const [doctors, setDoctors] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any errors
  const [toastMessage, setToastMessage] = useState(null); // State to handle toast visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctors data
    axios
      .get("https://localhost:7127/api/User/users/2")
      .then((response) => {
        console.log(response.data.doctorsCard);
        setDoctors(response.data.doctorsCard || []); // Ensure it's always an array
        setTimeout(() => {
          setLoading(false); // Data loaded
          setToastMessage({ type: "success", message: t("Nurse Data Loaded Successfully!") });
        }, 1500);
      })
      .catch(() => {
        setError (t("Failed to load Nurse data"));
        setLoading(false); // Set loading to false even if there's an error
        setToastMessage({ type: "error", message: t("Failed To Load Nurse data.") });
      });
  }, [doctors]);

  if (loading) {
    return <SpinnerLoading message={t("Loading Nurse Data, Please Hold On...")} />;
  }

  if (error) {
    return <ToastMessage type={"error"} message={error} />;
    // Error message if there's a problem fetching data
  }

  return (
    <>
      {/* Conditionally render ToastMessage if it exists */}
      {toastMessage && <ToastMessage type={toastMessage.type} message={toastMessage.message} />}

      <div className="d-flex flex-wrap">
  {doctors.length > 0 ? (
    doctors.map((ele) => (
      <div className="card-emp m-4" style={{ width: "18rem" }} key={ele.id}>
    <div className="card-img-top">
  <img
    className="m-1"
    src="/nursepic.png"  // Reference image relative to the public folder
    alt="nurse illustration"
    style={{ width: "100%", height: "100%", objectFit: "contain" }}
  />
</div>

        <div className="card-body">
          <h5 className="card-title">{ele.name}</h5>
          <p className="card-text">{ele.description}</p>
          <button
            className="major-btn"
            onClick={() => navigate(`/details-nurse/${ele.id}`)}
          >
            {t("Details")}
          </button>
        </div>
      </div>
    ))
  ) : (
    <div>{t("No Nurse Data Found")}</div>
  )}
</div>
    </>
  );
}
