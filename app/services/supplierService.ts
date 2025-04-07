import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const supplierService = {
  // Get all suppliers
  getAllSuppliers() {
    return axios
      .get(`${BASE_URL}/api/suppliers`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        throw error;
      });
  },

  // Get a supplier by ID
  getSupplierById(supplierId: string) {
    return axios
      .get(`${BASE_URL}/api/suppliers/${encodeURIComponent(supplierId)}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching supplier by ID:", error);
        throw error;
      });
  },

  // Create a new supplier
  createSupplier(supplier: any) {
    return axios
      .post(`${BASE_URL}/api/suppliers`, supplier, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating supplier:", error);
        throw error;
      });
  },

  // Update a supplier
  updateSupplier(supplierId: string, fields: any) {
    return axios
      .put(
        `${BASE_URL}/api/suppliers/${encodeURIComponent(supplierId)}`,
        fields,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating supplier:", error);
        throw error;
      });
  },

  // Delete a supplier
  deleteSupplier(supplierId: string) {
    return axios
      .delete(`${BASE_URL}/api/suppliers/${encodeURIComponent(supplierId)}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting supplier:", error);
        throw error;
      });
  },
};

export default supplierService;
