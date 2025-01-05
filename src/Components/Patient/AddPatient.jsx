import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useNavigate } from "react-router-dom";

export default function PatientForm() {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    departmentId: "",
    pcd: "",
    age: "",
    phoneNumber: "",
    gender: true, // true represents Male, false represents Female
    bloodType: "",
    areaId: "",
    cityId: "",
    legalGuardianPhone: "",
    legalGuardianName: "",
  });
  const BloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O-", "O+"];

  const [toast, setToast] = useState({ type: "", message: "", visible: false });

  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [pcds, setPcds] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch("https://localhost:7127/api/Generic/Departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));

    fetch("https://localhost:7127/api/Generic/Cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  useEffect(() => {
    if (patient.cityId) {
      fetch(`https://localhost:7127/api/Generic/Areas/${patient.cityId}`)
        .then((res) => res.json())
        .then((data) => setAreas(data))
        .catch((err) => console.error("Error fetching areas:", err));
    }
  }, [patient.cityId]);

  useEffect(() => {
    if (patient.departmentId) {
      fetch(`https://localhost:7127/api/User/user/1/${patient.departmentId}`)
        .then((res) => res.json())
        .then((data) => setPcds(data.doctorsCard)) // Set PCDs from the API response
        .catch((err) => console.error("Error fetching PCDs:", err));
    }
  }, [patient.departmentId]); // Trigger fetching PCDs whenever departmentId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: name === "gender" ? value === "true" : value, // Convert gender to boolean
    });
  };
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ ...toast, visible: false }); // Reset toast visibility

    try {
      console.log(patient);

      const response = await fetch(
        "https://localhost:7127/api/Patient/Create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...patient,
            departmentId: parseInt(patient.departmentId),
            age: parseInt(patient.age),
            areaId: parseInt(patient.areaId),
            cityId: parseInt(patient.cityId),
            gender: patient.gender, // gender remains boolean
          }),
        }
      );

      if (response.ok) {
        setToast({
          type: "success",
          message: t("Patient added successfully!"),
          visible: true,
        });
        setPatient({
          firstName: "",
          lastName: "",
          departmentId: "",
          pcd: "",
          age: "",
          phoneNumber: "",
          gender: true, // Reset gender to true (Male)
          bloodType: "",
          areaId: "",
          cityId: "",
          legalGuardianPhone: "",
          legalGuardianName: "",
        });
        navigate("/patients")
      } else {
        const error = await response.json();
        setToast({
          type: "error",
          message: error.message || t("Something went wrong."),
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error submitting patient data:", error);
      setToast({
        type: "error",
        message: t("Failed to add patient."),
        visible: true,
      });
    }
  };

  return (
    <div className="container mt-5 mb-5">
      {toast.visible && (
        <ToastMessage type={toast.type} message={toast.message} />
      )}
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center-title mb-4 text-white bg-primary py-3 rounded-top">
              {t("Add New Patient")}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    {t("First Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={patient.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">
                    {t("Last Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={patient.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="age" className="form-label">
                    {t("Age")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={patient.age}
                    onChange={handleChange}
                    required
                    min="0"
                    max="99"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phoneNumber" className="form-label">
                    {t("Phone")}
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={patient.phoneNumber}
                    onChange={handleChange}
                    required
                    pattern="^\+?[0-9]{10,15}$" // Validates international or local formats with 10–15 digits
                    title="Please enter a valid phone number with 10–15 digits, optionally starting with +"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="gender" className="form-label">
                    {t("Gender")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="gender"
                    name="gender"
                    value={patient.gender.toString()} // Convert boolean to string for display
                    onChange={handleChange}
                    required
                  >
                    <option value="true">{t("Male")}</option>
                    <option value="false">{t("Female")}</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="bloodType" className="form-label">
                    {t("Blood Type")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="bloodType"
                    name="bloodType"
                    value={patient.bloodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      {t("Select Blood Type")}
                    </option>
                    {BloodType.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="departmentId" className="form-label">
                    {t("Department")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="departmentId"
                    name="departmentId"
                    value={patient.departmentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("Select Department")}</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="pcd" className="form-label">
                    {t("PCD")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="pcd"
                    name="pcd"
                    value={patient.pcd}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("Select PCD")}</option>
                    {pcds.map((pcd) => (
                      <option key={pcd.id} value={pcd.id}>
                        {pcd.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">

                <div className="col-md-6">
                  <label htmlFor="cityId" className="form-label">
                    {t("City")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="cityId"
                    name="cityId"
                    value={patient.cityId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("Select City")}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="areaId" className="form-label">
                    {t("Area")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="areaId"
                    name="areaId"
                    value={patient.areaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("Select Area")}</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="legalGaurdainName" className="form-label">
                    {t("Legal Guardian Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="legalGaurdainName"
                    name="legalGaurdainName"
                    value={patient.legalGaurdainName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="legalGaurdainPhone" className="form-label">
                    {t("Legal Guardian Phone")}
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="legalGaurdainPhone"
                    name="legalGaurdainPhone"
                    value={patient.legalGaurdainPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="text-center">  <button
                type="submit"
                className="major-btn">
                {t("Add")}
              </button></div>
            
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
