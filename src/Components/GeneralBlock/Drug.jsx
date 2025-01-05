import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const DrugWarehouse = () => {
  const { t } = useTranslation();

  const [drugs, setDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState({
    name: "",
    qty: "",
    expiryDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch drugs on component mount
    axios
      .get("https://localhost:7127/api/Generic/get-drug")
      .then((response) => {
        setDrugs(response.data); // Assuming response.data contains the array of drugs
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrug({ ...newDrug, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddDrug = (e) => {
    e.preventDefault();
    if (newDrug.name && newDrug.qty && newDrug.expiryDate) {
      axios
        .post("https://localhost:7127/api/Generic/create-drug", newDrug)
        .then((response) => {
          setDrugs([...drugs, response.data]); // Add the newly created drug to the list
          setNewDrug({ name: "", qty: "", expiryDate: "" }); // Reset the form
        })
        .catch((error) => {
          console.error("Error adding drug:", error);
        });
    }
  };

  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1         className="text-center-title mb-4 py-3 text-white rounded shadow-sm"
      >{t("Drug Warehouse")}</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder={t("Search drugs by name...")}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Drug List Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>{t("Serial Number")}</th>
              <th>{t("Drug Name")}</th>
              <th>{t("Quantity")}</th>
              <th>{t("Expiry Date")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrugs.map((drug, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{drug.name}</td>
                <td>{drug.qty}</td>
                <td>{drug.expiryDate}</td>
              </tr>
            ))}
            {filteredDrugs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("No Drugs Found.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Drug Form */}
      <div className="card mt-4">
        <div className="card-header">{t("Add New Drug")}</div>
        <div className="card-body">
          <form onSubmit={handleAddDrug}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">{t("Drug Name")}</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newDrug.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="qty" className="form-label mt-3">{t("Quantity")}</label>
              <input
                type="number"
                className="form-control"
                id="qty"
                name="qty"
                value={newDrug.qty}
                onChange={handleInputChange}
                required
                min={"1"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label mt-3">{t("Expiry Date")}</label>
              <input
  type="date"
  className="form-control"
  id="expiryDate"
  name="expiryDate"
  value={newDrug.expiryDate}
  onChange={handleInputChange}
  min={new Date(new Date().setDate(new Date().getDate() + 2))
    .toISOString()
    .split("T")[0]} // Calculate tomorrow's date
    required
    onKeyDown={(e) => e.preventDefault()}
/>
            </div>
            <button type="submit" className="major-btn mt-3">
              {t("Add")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrugWarehouse;
