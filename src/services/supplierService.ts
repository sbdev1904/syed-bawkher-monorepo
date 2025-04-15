import axios from "axios";

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  add1: string;
  add2: string;
  add3: string;
  phone_number1: string;
  phone_number2: string;
  phone_number3: string;
  email: string;
  primary_contact_name1: string;
  primary_contact_name2: string;
  primary_contact_name3: string;
  notes: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const supplierService = {
  // Get all suppliers
  getAllSuppliers() {
    return axios
      .get<Supplier[]>(`${BASE_URL}/api/suppliers`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        throw error;
      });
  },

  // Get a supplier by ID
  getSupplierById(supplierId: number) {
    return axios
      .get<Supplier>(
        `${BASE_URL}/api/suppliers/${encodeURIComponent(supplierId)}`
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching supplier by ID:", error);
        throw error;
      });
  },

  // Create a new supplier
  createSupplier(supplier: Omit<Supplier, "supplier_id">) {
    return axios
      .post<Supplier>(`${BASE_URL}/api/suppliers`, supplier, {
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
  updateSupplier(supplierId: number, fields: Partial<Omit<Supplier, "id">>) {
    return axios
      .put<Supplier>(
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
  deleteSupplier(supplierId: number) {
    return axios
      .delete<void>(
        `${BASE_URL}/api/suppliers/${encodeURIComponent(supplierId)}`
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting supplier:", error);
        throw error;
      });
  },
};

export default supplierService;
