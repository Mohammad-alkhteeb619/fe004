import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const ToastMessage = ({ type, message }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [timestamp, setTimestamp] = useState("");
 
 
  // Declare fixed messages
  const defaultMessages = {
    success: t("Operation Completed Successfully!"),
    error: t("An Error Occurred, Please Try Again."),
    warning: t("WARNING! CHECK YOUR INPUT."),
    info: t("This is an Informative Message."),
  };

  useEffect(() => {
    if (type) {
      setIsVisible(true);
      setTimestamp(new Date().toLocaleTimeString());

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 15000); // 15 seconds auto-close

      return () => clearTimeout(timer);
    }
  }, [type]);

  const toastClass = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    warning: "bg-warning text-dark",
    info: "bg-info text-white",
  }[type] || "bg-secondary text-white";

  if (!isVisible) return null;

  return (
    <div
      className="toast position-fixed bottom-0 end-0 m-3 show"
      style={{ zIndex: 1055 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header ${toastClass}`}>
        <strong className="me-auto">{t("Notification")}</strong>
        <small>{timestamp}</small>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => setIsVisible(false)}
        ></button>
      </div>
      <div className="toast-body">
        {message || t(defaultMessages[type] || "Unknown Notification Type")}
      </div>
    </div>
  );
};

export default ToastMessage;