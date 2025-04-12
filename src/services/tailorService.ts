import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const response = await fetch("/api/tailors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create tailor");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllTailors: async () => {
    try {
      const response = await fetch("/api/tailors");

      if (!response.ok) {
        throw new Error("Failed to fetch tailors");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getTailorById: async (id: number) => {
    try {
      const response = await fetch(`/api/tailors/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch tailor");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateTailor: async (id: number, data: Partial<CreateTailorInput>) => {
    try {
      const response = await fetch(`/api/tailors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update tailor");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteTailor: async (id: number) => {
    try {
      const response = await fetch(`/api/tailors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tailor");
      }
    } catch (error) {
      throw error;
    }
  },
};

export default tailorService;
