import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Toastmsg from "./ToastMsg";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
export default function Home() {
  const { t, i18n } = useTranslation();
  const [codes, setCodes] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [refresh, setRefresh] = useState(false);
  const audio = new Audio("/sound/notification2.mp3");
  const token = localStorage.getItem("token");

  const userid = jwtDecode(token);

  useEffect(() => {
    axios
      .get("https://localhost:7127/GetAllCodes")
      .then((res) => {
        setCodes(res.data);
      })
      .catch((err) => console.error("Error fetching codes:", err));

    axios.get("https://localhost:7127/GetAllEmergency").then((res) => {
      setEmergencies(res.data);
      setRefresh(false);
    });
  }, [refresh]);

  const HandleSolve = (id) => {
    axios
      .delete(`https://localhost:7127/DeleteEmergency?id=${id}`)

      .catch((err) => console.error(t("Error Loading Emergencies:"), err));
    setRefresh(true);
  };

  const handleCreateEmergency = (id) => {
    axios
      .post(
        `https://localhost:7127/CreateEmergency?id=${id}&userid=${userid.Id}
`
      )
      .then(() => {
        setRefresh(true);
        audio.play();
      })
      .catch((err) => console.error(t("Error Creating Emergency:"), err));
  };

  const handleCodeChange = (e) => {
    setSelectedCode(e.target.value);
  };

  return (
    <div className="container py-5">
    <h1
        className="text-center-title mb-4 py-3 text-white rounded shadow-sm"
        
      >
        {t("Home Page")}
      </h1>

      <div className="mb-3">
        <select
          id="codeSelect"
          className="form-select"
          value={selectedCode}
          onChange={(e) => handleCodeChange(e)}
        >
          <option className="codeemr" value="">
            {t("Select Code")}
          </option>
          {codes.map((code) => (
            <option
              className="code-type"
              key={code.id}
              value={code.id}
              style={{ backgroundColor: code.color }}
            >
              {code.code}
            </option>
          ))}
        </select>
      </div>

      <button
        className="broadcast btn-primary"
        onClick={() => handleCreateEmergency(selectedCode)}
        disabled={!selectedCode}
      >
        {t("Broadcast")}
      </button>

      <div className="text-center-title text-white mt-5">        <h2>{t("Emergency Codes")}</h2>
        <table className="table">
          <tr>
            <th className="table-title"
            
              colSpan={1}
            >
              #
            </th>
            <th className="table-title"
              colSpan={3}
            >
              {t("Title")}
            </th>
            <th className="table-title"
              colSpan={4}
            >
              {t("Description")}
            </th>
            <th className="table-title"
              colSpan={3}
            >
              {t("Broadcasted By")}
            </th>
            <th className="table-title"
              colSpan={1}
            >
              {t("Department")}
            </th>
            <th className="table-title"
              colSpan={1}
            >
              {t("Terminated")}
            </th>
          </tr>

          {emergencies.map((emergency, index) => (
            <tr className="emr-tr"
              key={index}
              style={{
                backgroundColor: emergency.emergencyCode.color,

                color: "white",
              }}
            >
              <td
                colSpan={1}
                >
                {emergency.id}
              </td>
              <td
                colSpan={3}
                >
                {" "}
                {t(emergency.emergencyCode.title)}
              </td>
              <td
                colSpan={4}
                >
                {t(emergency.emergencyCode.description)}
              </td>
              <td
                colSpan={3}
                >
                {emergency.nameOfUser}
              </td>
              <td
                colSpan={1}
                >
                 {t(emergency.departmentName)}
              </td>
              <td
                colSpan={1}
                >
                <button
                  onClick={() => HandleSolve(emergency.id)}
                  className="btn"
                  title={t("Mark as Terminated")}
                >
                  {t("Terminated")}
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
