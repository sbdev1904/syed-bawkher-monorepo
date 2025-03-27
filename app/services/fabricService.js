import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const fabricService = {
  // Get all fabrics
  getAllFabrics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/fabrics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      throw error;
    }
  },

  // Get a fabric by ID
  getFabricById: async (fabricId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric:", error);
      throw error;
    }
  },

  // Search fabrics by query
  searchFabrics: async (query) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/fabrics/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching fabrics:", error);
      throw error;
    }
  },

  // Create a new fabric
  createFabric: async (fabric) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/fabrics`, fabric, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating fabric:", error);
      throw error;
    }
  },

  // Update a fabric
  updateFabric: async (fabricId, fields) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}`,
        fields,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating fabric:", error);
      throw error;
    }
  },

  // Delete a fabric
  deleteFabric: async (fabricId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting fabric:", error);
      throw error;
    }
  },

  // Gets the presigned URL for uploading an image for a fabric to the S3 bucket
  getPresignedUrl: async (fabricId, filename) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}/upload-image`,
        { filename },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      throw error;
    }
  },

  // Gets the image URL for a fabric
  getFabricImageUrl: async (fabricId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}/image`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric image URL:", error);
      throw error;
    }
  },

  // Deletes the image for a fabric
  deleteFabricImage: async (fabricId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/fabrics/${encodeURIComponent(fabricId)}/image`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting fabric image:", error);
      throw error;
    }
  },
};

export default fabricService;
