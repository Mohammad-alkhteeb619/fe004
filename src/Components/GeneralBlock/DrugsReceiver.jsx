import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const DrugOrdersManager = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]); // Initialize state for orders
  const [error, setError] = useState(null); // State to track errors
  const [loading, setLoading] = useState(false); // State to track loading
  const [reload, setReload] = useState(false); // State to trigger data re-fetch

  // Fetch orders whenever the component mounts or reload changes
  useEffect(() => {
    setError(null); // Clear previous errors
    axios
      .get("https://localhost:7127/api/Generic/get-orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError(t("Failed to load orders. Please try again later."));
      });
  }, [reload]);

  const markAsFulfilled = async (id) => {
    try {
      setLoading(true); // Show loading state
      const params = new URLSearchParams({ id });
      await axios.put(`https://localhost:7127/api/Generic/update-order?${params}`);
      setReload((prev) => !prev); // Trigger data re-fetch
    } catch (error) {
      console.error("Error updating order:", error);
      const errorMessage = error.response?.data?.message || t("Failed to update the order. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container mt-5">
      <h1         className="text-center-title mb-4 py-3 text-white rounded shadow-sm"
      >{t("Warehouse Orders")}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">{t("Serial Number")}</th>
              <th scope="col">{t("Requested By")}</th>
              <th scope="col">{t("Drug Name")}</th>
              <th scope="col">{t("Quantity")}</th>
              <th scope="col">{t("Status")}</th>
              <th scope="col">{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.requestedBy}</td>
                <td>{order.drug.name}</td>
                <td>{order.qty}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === 1 ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {order.status === 1 ? t("Fulfilled") : t("Pending")}
                  </span>
                </td>
                <td>
                  {order.status !== 1 && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => markAsFulfilled(order.id)}
                      disabled={loading}
                      style={{backgroundColor:"#1F316F"}}
                    >
                      {loading ? t("Processing...") : t("Mark as Fulfilled")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  {t("No Orders to Process.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrugOrdersManager;
