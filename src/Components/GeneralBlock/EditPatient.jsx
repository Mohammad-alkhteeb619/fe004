import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ModalEdit(props) {
  const [formedit, setFormEdit] = useState({





  });
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [pcds, setPcds] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
    const { t } = useTranslation();
  

  // Fetch departments and cities once on component mount
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/Departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => console.error("Error Loading Departments", error));

    axios
      .get("https://localhost:7127/api/Generic/Cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error("Error Loading Cities", error));
  }, []);

  // Fetch patient data by ID and prepopulate formedit
  useEffect(() => {
    if (props.id) {
      axios
        .get(`https://localhost:7127/api/Patient/GetById/${props.id}`)
        .then((response) => {
          const patient = response.data.patient;
          setFormEdit({ ...patient });

          if (patient.departmentId) fetchPcds(patient.departmentId);
          if (patient.cityId) fetchAreas(patient.cityId);
        })
        .catch((error) => console.error("Error Loading Patient Data", error));
    }
  }, [props.id]);

  // Fetch PCDs based on selected department
  const fetchPcds = (departmentId) => {
    axios
      .get(`https://localhost:7127/api/User/user/1/${departmentId}`)
      .then((response) => setPcds(response.data.doctorsCard || []))
      .catch((error) => console.error("Error Loading PCDs", error));
  };

  // Fetch Areas based on selected city
  const fetchAreas = (cityId) => {
    axios
      .get(`https://localhost:7127/api/Generic/Areas/${cityId}`)
      .then((response) => setAreas(response.data || []))
      .catch((error) => console.error("Error Loading Areas", error));
  };

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    if (selectedCityId !== formedit.cityId) {
      setFormEdit({
        ...formedit,
        cityId: selectedCityId,
        areaId: "", // Reset area when city changes
      });
      setAreas([]); // Clear areas while fetching
      fetchAreas(selectedCityId);
    }
  };
const handleEditSubmit = () => {
  // Send the updated data to the server
  
  formedit.gender = formedit.gender=="true"
  axios
    .put(`https://localhost:7127/api/Patient/Update/${props.id}`, formedit)
    .then((response) => {
      // Handle success
      console.log("Patient data updated successfully:", response.data);
      // You can add additional success handling here, like closing the modal or showing a success message.
      setShowEditModal(false);  // Close modal after submission (optional)
      props.onUpdate();
     
    })
    .catch((error) => {
      // Handle error
      console.error("Error updating patient data:", error);
      // You can show an error message or handle it appropriately.
    });
};
  // Handle department change
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
    if (selectedDepartmentId !== formedit.departmentId) {
      setFormEdit({
        ...formedit,
        departmentId: selectedDepartmentId,
        pcd: "", // Reset PCD when department changes
      });
      setPcds([]); // Clear PCDs while fetching
      fetchPcds(selectedDepartmentId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formedit, [name]: value });
  };

 

  return (
    <>
    <div style={{display:"inline"}}>
      <button className="action-btn" onClick={() => setShowEditModal(true)}>
        {t("Edit")} 
      </button>
      &nbsp;
    </div>
      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("Edit Information")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit();
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="firstname" className="form-label">
                      {t("First Name")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstName"
                      value={formedit.firstName || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">
                     {t("Last Name")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastName"
                      value={formedit.lastName || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="department" className="form-label">
                      {t("Department")}
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="department"
                      name="departmentId"
                      value={formedit.departmentId || ""}
                      onChange={handleDepartmentChange}
                    >
                      <option value="">{t("Select Department")}</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {t(dept.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pcd" className="form-label">
                      {t("PCD")}
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="pcd"
                      name="pcd"
                      value={formedit.pcd || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">{t("Select PCD")}</option>
                      {pcds.map((pcd) => (
                        <option key={pcd.id} value={pcd.id}>
                          {pcd.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                      {t("City")}
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="city"
                      name="cityId"
                      value={formedit.cityId || ""}
                      onChange={handleCityChange}
                    >
                      <option value="">{t("Select City")}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {t(city.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="area" className="form-label">
                      {t("Area")}
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="area"
                      name="areaId"
                      value={formedit.areaId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">{t("Select Area")}</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {t(area.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
  <label htmlFor="phoneNumber" className="form-label">
    {t("Phone")}
  </label>
  <input
    type="tel"
    className={`form-control ${formedit.phoneNumber && !/^07\d{8}$/.test(formedit.phoneNumber) ? 'is-invalid' : ''}`}
    id="phoneNumber"
    name="phoneNumber"
    value={formedit.phoneNumber || ""}
    onChange={handleInputChange}
    onBlur={(e) => {
      if (formedit.phoneNumber && !/^07\d{8}$/.test(formedit.phoneNumber)) {
        setError(t("Phone number must be in the format 07xxxxxxxx."));
      } else {
        setError("");
      }
    }}
    required
    pattern="^07\d{8}$"
    title={t("Phone number must be in the format 07xxxxxxxx.")}
  />
  {formedit.phoneNumber && !/^07\d{8}$/.test(formedit.phoneNumber) && (
    <div className="invalid-feedback">
      {t("Phone number must be in the format 07xxxxxxxx.")}
    </div>
  )}
</div>

               <div className="mb-3">
  <label className="form-label" htmlFor="gender">{t("Gender")}</label>
  <select
    className="form-select form-select-lg"
    id="gender"
    name="gender"
    value={formedit.gender || ""}
    onChange={handleInputChange}
  >
    <option value="" disabled>
      {t("Select Gender")}
    </option>
    <option value="1">{t("Male")}</option>
    <option value="2">{t("Female")}</option>
  </select>
</div>

                  <button type="submit" onClick={handleEditSubmit} className="major-btn mt-3">
                    {t("Save Changes")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
