import axios from "axios";

interface CreateTailorInput {
  first_name: string;
  last_name: string;
  specialization: string;
  experience_years: number;
  address: string;
  phone_number: string;
  email: string;
  emergency_contact: string;
  status: string;
  hourly_rate: number;
  notes?: string;
}

const tailorService = {
  createTailor: async (data: CreateTailorInput) => {
    try {
      const response = await axios.post("/api/tailors", data);
      return response.data;
    } catch (error) {
      console.error("Error creating tailor:", error);
      throw error;
    }
  },

  getAllTailors: async () => {
    try {
      const response = await axios.get("/api/tailors");
      return response.data;
    } catch (error) {
      console.error("Error fetching tailors:", error);
      throw error;
    }
  },

  getTailorById: async (id: number) => {
    try {
      const response = await axios.get(`/api/tailors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tailor:", error);
      throw error;
    }
  },

  updateTailor: async (id: number, data: Partial<CreateTailorInput>) => {
    try {
      const response = await axios.put(`/api/tailors/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating tailor:", error);
      throw error;
    }
  },

  deleteTailor: async (id: number) => {
    try {
      const response = await axios.delete(`/api/tailors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tailor:", error);
      throw error;
    }
  },
};

export default tailorService;
