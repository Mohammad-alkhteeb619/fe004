import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "/logo_01.jpg";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const [tabs, setTabs] = useState([]);
  const [logged, setLogged] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const data = getTokenData();
    if (data && logged) {
      axios
        .get(`https://localhost:7127/api/User/user/${data.Id}`)
        .then((resp) => {
          setName(
            `${resp.data.doctorsCard.firstName} ${resp.data.doctorsCard.lastName}`
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [logged]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Switch language
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    window.location.href = "/login";
  };

  const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  useEffect(() => {
    const data = getTokenData();
    if (data) {
      switch (data.role) {
        case "Admin":
          setTabs([
            {
              name: t("Doctor"),
              links: [
                { label: t("Display Doctors"), path: "/doctors" },
                { label: t("Add Doctor"), path: "/create-doctor" },
              ],
            },
            {
              name: t("Drugs"),
              links: [
                { label: t("Drug Warehouse"), path: "/drugs" },
                { label: t("Warehouse Orders"), path: "/drug-orders" },
                { label: t("Order Drugs"), path: "/order-drug" },
              ],
            },
            {
              name: t("Patient"),
              links: [
                { label: t("Display Patients"), path: "/patients" },
                { label: t("Add Patient"), path: "/create-patient" },
              ],
            },
            {
              name: t("Management Staff"),
              links: [
                { label: t("Display Management Staff"), path: "/staff" },
                { label: t("Add Management Staff"), path: "/create-staff" },
              ],
            },
            {
              name: t("Nurse"),
              links: [
                { label: t("Display Nurses"), path: "/nurses" },
                { label: t("Add Nurse"), path: "/create-nurse" },
              ],
            },
            {
              name: t("Pharmacist"),
              links: [
                { label: t("Display Pharmacists"), path: "/pharmacists" },
                { label: t("Add Pharmacist"), path: "/create-pharmacist" },
              ],
            },
          ]);
          break;
        case "Doctor":
        case "Nurse":
          setTabs([
            {
              name: t("Patient"),
              links: [{ label: t("Display Patients"), path: "/patients" }],
            },
          ]);
          break;
        case "Pharmacist":
          setTabs([
            {
              name: t("Patient"),
              links: [{ label: t("Display Patients"), path: "/patients" }],
            },
            {
              name: t("Drugs"),
              links: [{ label: t("Order Drugs"), path: "/order-drug" }],
            },
          ]);
          break;
        case "ManagementStaff":
          setTabs([
            {
              name: t("Patient"),
              links: [
                { label: t("Display Patients"), path: "/patients" },
                { label: t("Add Patient"), path: "/create-patient" },
              ],
            },
            {
              name: t("Management Staff"),
              links: [{ label: t("Display Management Staff"), path: "/staff" }],
            },
            {
              name: t("Drugs"),
              links: [
                { label: t("Drug Warehouse"), path: "/drugs" },
                { label: t("Warehouse Orders"), path: "/drug-orders" },
              ],
            },
          ]);
          break;
        default:
          setTabs([]);
      }
    }
  }, [t, i18n, logged]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#1F316F" }}
    >
      <div className="container-fluid">
        <img src={logo} width={70} alt="Path2Health Logo" />
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <span className="fs-5 fw-bold">Path2Health</span>
        </NavLink>

        {/* Toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {getTokenData() != null && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  {t("Home")}
                </NavLink>
              </li>
            )}
            {tabs.map((menu, index) => (
              <li key={index} className="dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  id={`${menu.name}Dropdown`}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {menu.name}
                </NavLink>
                <ul
                  className="dropdown-menu"
                  aria-labelledby={`${menu.name}Dropdown`}
                >
                  {menu.links.map((link, idx) => (
                    <li key={idx}>
                      <NavLink className="dropdown-item" to={link.path}>
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Language Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              🌐
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="languageDropdown"
            >
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => changeLanguage("en")}
                >
                  <img
                    src="https://flagcdn.com/w40/gb.png"
                    alt="UK Flag"
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                  English
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => changeLanguage("ar")}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Jordan.svg"
                    alt="Jordan Flag"
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                  العربية
                </button>
              </li>
            </ul>
          </div>

          {/* User Profile */}
          {getTokenData() != null && (
            <div className="dropdown ms-3">
              <button
                className="btn btn-sm dropdown-toggle text-light"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {name}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="profileDropdown"
              >
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    {t("Log Out")}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
