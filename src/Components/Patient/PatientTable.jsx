import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import EditPatient from "../GeneralBlock/EditPatient";
import { jwtDecode } from "jwt-decode";

export default function PatientList() {
  const navigate = useNavigate();
  const { t,i18n } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger re-fetch and re-render

  // Separate state for each search box
  const [searchId, setSearchId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");

  let token;
  const tokenn = localStorage.getItem("token");
  if (!tokenn) return null;

  try {
    const x = jwtDecode(tokenn);
    token = x.role;
    console.log(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("https://localhost:7127/api/Patient/Get");
        const data = await response.json();
        console.log(data.patients);
        setPatients(data.patients || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatients();
  }, [refreshKey]); // Re-fetch patients whenever refreshKey changes

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `https://localhost:7127/api/Patient/Delete/${selectedItem.id}`
      );
      if (response.status === 200) {
        setPatients(
          patients.filter((patient) => patient.id !== selectedItem.id)
        );
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Filter logic based on all search fields
  const filteredPatients = patients.filter((patient) => {
    console.log(patient);
    console.log(searchId);

    const matchesId = searchId
      ? patient.code.toLowerCase().includes(searchId)
      : true;
    const matchesPhone = searchPhone
      ? patient.phoneNumber.toLowerCase().includes(searchPhone.toLowerCase())
      : true;
    const matchesName = searchName
      ? patient.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchesId && matchesPhone && matchesName;
  });

  
  return (
    <>
      <div
        className="filter-container d-flex flex-row gap-3"
       
      >
        <input
          type="text"
          className="form-filter"
          placeholder={t("Search by ID")}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          aria-label="Search by ID"
        />
        <input
          type="text"
          className="form-filter"
          placeholder={t("Search by Phone")}
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          aria-label="Search by Phone"
        />
        <input
          type="text"
          className="form-filter"
          placeholder={t("Search by Name")}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          aria-label="Search by Name"
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">{t("Id")}</th>

            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Admission Date")}</th>
            <th scope="col">{t("Department")}</th>
            <th scope="col">{t("PCD")}</th>
            <th scope="col">{t("Age")}</th>
            <th scope="col">{t("Phone")}</th>
            <th scope="col">{t("Gender")}</th>
            <th scope="col">{t("Address")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr
              key={patient.id}
              className="table-light"
              style={{ cursor: "pointer" }}
            >
              <td>{patient.code}</td>

              <td>{patient.name}</td>
              <td>{new Date(patient.admissionDate).toLocaleString()}</td>
              <td>{patient.department}</td>
              <td>{patient.pcd}</td>
              <td>{patient.age}</td>
              <td>{patient.phoneNumber}</td>
              <td>{patient.gender === "Male" ? t("Male") : t("Female")}</td>
              <td>{patient.address}</td>
              <td>
                <div className="dropdown">
                  {(token == "ManagementStaff" || token == "Admin") && (
                    <EditPatient
                      id={patient.id}
                      onUpdate={() => setRefreshKey((prev) => prev + 1)}
                    />
                  )}
                    <button
                    className="action-btn"
                    type="button"
                    id={`dropdownMenuButton-${patient.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {t("Action")}
                  </button>
                  
                  <ul
                    className="dropdown-menu"
                    aria-labelledby={`dropdownMenuButton-${patient.id}`}
                  >
                    {(token == "ManagementStaff" || token == "Admin") && (
                      <li>
                        <button
                          className="dropdown-item pt-text-danger"
                          onClick={() => handleDeleteClick(patient)}
                        >
                          {t("Delete Patient Record")}
                        </button>
                      </li>
                    )}



                     {(token == "Nurse" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-vital-signs/${patient.id}`}
                        >
                          {t("Issue Vital Signs")}
                        </NavLink>
                      </li>
                    )}

{(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Nurse" ||
                      token == "Admin") && (
                      <li className="history-vital-signs-li">
                        <NavLink
                          className="dropdown-item"
                          to={`/history-vital-signs/${patient.id}`}
                        >
                          {t("Vital Signs History")}
                        </NavLink>
                      </li>
                    )}


{(token == "Doctor" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-prescription/${patient.id}`}
                        >
                          {t("Issue Prescription")}
                        </NavLink>
                      </li>
                    )}

     
{(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/prescription/${patient.id}`}
                        >
                          {t("Display Prescription")}
                        </NavLink>
                      </li>
                    )}

                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Admin") && (
                      <li className="prescription-history">
                        <NavLink
                          className="dropdown-item"
                          to={`/all-prescription/${patient.id}`}
                        >
                          {t("Prescription History")}
                        </NavLink>
                      </li>
                    )}
                   
               
                   

                    {(token == "Doctor" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-diagnosis/${patient.id}`}
                        >
                          {t("Issue Diagnosis")}
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to={`/diagnosis/${patient.id}`}
                      >
                        {t("Display Diagnosis")}
                      </NavLink>
                    </li>
                    <li className="diagnosis-history">
                      <NavLink
                        className="dropdown-item"
                        to={`/all-diagnosis/${patient.id}`}
                      >
                        {t("Diagnosis History")}
                      </NavLink>
                    </li>


                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-sick-leave/${patient.id}`}
                        >
                          {t("Issue Sick Leave")}
                        </NavLink>
                      </li>
                    )}
                    
                  
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/sick-leave/${patient.id}`}
                        >
                          {t("Display Sick Leave")}
                        </NavLink>
                      </li>
                    )}
                   

                   {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/all-sick-leaves/${patient.id}`}
                        >
                          {t("Sick Leave History")}
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("CONFIRM DELETION")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleDeleteCancel}
                ></button>
              </div>
              <div className="modal-body">
                {t("Are You Sure You Want To Delete This Record?")}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleDeleteCancel}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  className="confirm-btn"
                  onClick={handleDeleteConfirm}
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
