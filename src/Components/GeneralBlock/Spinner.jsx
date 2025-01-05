import React from "react";
import { useTranslation } from 'react-i18next';

export default function SpinnerLoading({ message = "Loading, please wait..." }) {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }} // Optional background color
    >
      {/* Bootstrap Spinner */}
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>

      {/* Optional Loading Message */}
      {t(message) && <p className="mt-3">{t(message)}</p>}
    </div>
  );
}
