import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded first
import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ToastMessage from '../GeneralBlock/ToastMsg';
import { useNavigate } from "react-router-dom";

export default function DoctorForm() {
  const { t, i18n } = useTranslation();
  const [doctor, setDoctor] = useState({
    FirstName: "",
    LastName: "",
    Password: "",
    ConfirmPassword: "",
    experience: "",
    age: null,
    phonenumber: "",
    gender: "", // Default value (1 for Male)
    email: "",
    areaid: "", // Default empty value for areaid
    departmentid: "1", // Default empty value for departmentid
    cityid: "", // Default empty value for cityid
    role: "2", // Default value for Doctor role
  });

  const [areas, setAreas] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [toastMessage, setToastMessage] = useState(false);
  const [error, setError] = useState(""); // Added error state
  const navigate = useNavigate();

  // Fetch departments and cities once on component mount
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/Departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });

    axios
      .get("https://localhost:7127/api/Generic/Cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  // Fetch areas based on the selected city
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    setDoctor({
      ...doctor,
      cityid: selectedCityId, // Update selected city ID
    });

    if (selectedCityId) {
      axios
        .get(`https://localhost:7127/api/Generic/Areas/${selectedCityId}`)
        .then((response) => {
          setAreas(response.data);
        })
        .catch((error) => {
          console.error("Error fetching areas:", error);
        });
    } else {
      setAreas([]); // Clear areas if no city is selected
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({
      ...doctor,
      [name]: value,
    });
  };
  

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^0[7]\d{8}$/; // Jordanian phone format
    if (!phonePattern.test(phone)) {
      setPhoneError(t("Phone number must be in the Jordanian format (e.g., 079xxxxxxxx)"));
    } else {
      setPhoneError("");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      FirstName: doctor.FirstName,
      LastName: doctor.LastName,
      PhoneNumber: doctor.phonenumber,
      Email: doctor.email,
      Password: doctor.Password,
      ConfirmPassword: doctor.ConfirmPassword,
      Age: doctor.age,
      Gender: doctor.gender,
      DepartmentId: doctor.departmentid,
      Experience: doctor.experience,
      CityId: doctor.cityid,
      AreaId: doctor.areaid,
      Role: parseInt(doctor.role, 10),
    });

    axios
      .post(
        "https://localhost:7127/api/user/user-Create",
        {
          FirstName: doctor.FirstName,
          LastName: doctor.LastName,
          PhoneNumber: doctor.phonenumber,
          Email: doctor.email,
          Password: doctor.Password,
          ConfirmPassword: doctor.ConfirmPassword,
          Age: doctor.age,
          Gender: doctor.gender,
          DepartmentId: doctor.departmentid,
          Experience: doctor.experience,
          CityId: doctor.cityid,
          AreaId: doctor.areaid,
          Role: parseInt(doctor.role, 10),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setToastMessage(true);
        setError(""); // Clear any previous error
        navigate("/nurses")
      })
      .catch((error) => {
        setError(t("Failed to Add a New Nurse"));
        console.error(t("Error:"), error.response?.data || error.message);
      });
  };

  return (
    <div className="container mt-5 mb-5">
      {toastMessage && <ToastMessage type="success" message={t("New Nurse Added Successfully")} />}
      {error && <ToastMessage type="error" message={error} />}

      <div className="row justify-content-center">
        <div className="col-8">
          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center-title mb-4 py-3 text-white rounded shadow-sm"
            >
              {t("Add New Nurse")}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* First Name and Last Name */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="FirstName" className="form-label">{t("First Name")}</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="FirstName"
                    name="FirstName"
                    value={doctor.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="LastName" className="form-label">{t("Last Name")}</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="LastName"
                    name="LastName"
                    value={doctor.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="Password" className="form-label">{t("Password")}</label>
    <input
      type="password"
      className={`form-control form-control-lg ${doctor.Password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(doctor.Password) ? 'is-invalid' : ''}`}
      id="Password"
      name="Password"
      value={doctor.Password}
      onChange={handleChange}
      required
    />
    {doctor.Password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(doctor.Password) && (
      <div className="invalid-feedback">
        {t("Password must be at least 8 characters long, a capital letter, a small letter, a number, and a special character.")}
      </div>
    )}
  </div>
  <div className="col-md-6">
    <label htmlFor="ConfirmPassword" className="form-label">{t("Confirm Password")}</label>
    <input
      type="password"
      className={`form-control form-control-lg ${doctor.ConfirmPassword && doctor.ConfirmPassword !== doctor.Password ? 'is-invalid' : ''}`}
      id="ConfirmPassword"
      name="ConfirmPassword"
      value={doctor.ConfirmPassword}
      onChange={handleChange}
      required
    />
    {doctor.ConfirmPassword && doctor.ConfirmPassword !== doctor.Password && (
      <div className="invalid-feedback">
        {t("Passwords do not match.")}
      </div>
    )}
  </div>
</div>


              {/* Age and Department */}
              
              <div className="row mb-3">
   
              <div className="col-md-6">
  <label htmlFor="age" className="form-label">{t("Age")}</label>
  <input
    type="number"
    className={`form-control form-control-lg ${doctor.age && (doctor.age < 22 || doctor.age > 64) ? 'is-invalid' : ''}`}
    id="age"
    name="age"
    value={doctor.age}
    onChange={handleChange}
    required
    min="22"
    max="64"
  />
  {doctor.age && (doctor.age < 22 || doctor.age > 64) && (
    <div className="invalid-feedback">
      {t("Age must be between 22 and 64.")}
    </div>
  )}
</div>
<div className="col-md-6">
  <label htmlFor="email" className="form-label">{t("Email")}</label>
  <input
    type="email"
    className={`form-control form-control-lg ${doctor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email) ? 'is-invalid' : ''}`}
    id="email"
    name="email"
    value={doctor.email}
    onChange={handleChange}
    required
  />
  {doctor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email) && (
    <div className="invalid-feedback">
      {t("Please enter a valid email address.")}
    </div>
  )}
</div>
              </div>

              {/* Experience and Phone */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="experience" className="form-label">{t("Experience")}</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="experience"
                    name="experience"
                    value={doctor.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
    <label htmlFor="phonenumber" className="form-label">{t("Phone")}</label>
    <input
      type="tel"
      className={`form-control form-control-lg ${doctor.phonenumber && !/^07\d{8}$/.test(doctor.phonenumber) ? 'is-invalid' : ''}`}
      id="phonenumber"
      name="phonenumber"
      value={doctor.phonenumber}
      onChange={handleChange}
      required
      pattern="^07\d{8}$"
      title="Phone number must be in the format 07xxxxxxxx"
    />
    {doctor.phonenumber && !/^07\d{8}$/.test(doctor.phonenumber) && (
      <div className="invalid-feedback">
        {t("Phone number must be in the format 07xxxxxxxx.")}
      </div>
    )}
  </div>
              </div>

              {/* Email and Gender */}
              <div className="row mb-3">
          

<div className="col-md-6">
                  <label htmlFor="departmentid" className="form-label">{t("Department")}</label>
                  <select
                    className="form-select form-select-lg"
                    id="departmentid"
                    name="departmentid"
                    value={doctor.departmentid}
                    onChange={handleChange}
                    required
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

               
<div className="col-md-6">
  <label className="form-label" htmlFor="gender">{t("Gender")}</label>
  <select
    className="form-select form-select-lg"
    id="gender"
    name="gender"
    value={doctor.gender || ""}
    onChange={handleChange}
  >
    <option value="" disabled>
      {t("Select Gender")}
    </option>
    <option value="1">{t("Male")}</option>
    <option value="2">{t("Female")}</option>
  </select>
</div>
              </div>

              {/* City and Area */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="cityid" className="form-label">{t("City")}</label>
                  <select
                    className="form-select form-select-lg"
                    id="cityid"
                    name="cityid"
                    value={doctor.cityid}
                    onChange={handleCityChange}
                    required
                  >
                    <option value="">{t("Select City")}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="areaid" className="form-label">{t("Area")}</label>
                  <select
                    className="form-select form-select-lg"
                    id="areaid"
                    name="areaid"
                    value={doctor.areaid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("Select Area")}</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="role" className="form-label">{t("Position")}</label>
                  <select
                    className="form-select form-select-lg"
                    id="role"
                    name="role"
                    value={doctor.role}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    <option value="1">{t("Doctor")}</option>
                    <option value="2">{t("Nurse")}</option>
                    <option value="3">{t("Management Staff")}</option>
                    <option value="4">{t("Pharmacist")}</option>
                  </select>
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="major-btn">{t("Add")}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
