import apiClient, { API_ENDPOINTS } from "../api/apiConfig";

export class StopService {
  // Get all stops
  static async getAllStops() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STOP.GET_ALL_STOPS);
      return response.data;
    } catch (error) {
      console.error("Error fetching stops:", error);
      throw error;
    }
  }

  // Get stop by ID
  static async getStopById(stopId) {
    try {
      if (!stopId) {
        throw new Error("Stop ID is required");
      }
      
      const response = await apiClient.get(`${API_ENDPOINTS.STOP.GET_STOP_BY_ID}/${stopId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching stop by ID:", error);
      throw error;
    }
  }

  // Add new stop
  static async addStop(stopData) {
    try {
      // Validate required fields
      const { name, latitude, longitude, tentativeArrivalTime, actualArrivalTime } = stopData;
      
      if (!name || !latitude || !longitude || !tentativeArrivalTime || !actualArrivalTime) {
        throw new Error("All fields (name, latitude, longitude, tentativeArrivalTime, actualArrivalTime) are required");
      }

      const formattedData = {
        name: String(name).trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        tentativeArrivalTime: new Date(tentativeArrivalTime).toISOString(),
        actualArrivalTime: new Date(actualArrivalTime).toISOString()
      };
      
      const response = await apiClient.post(API_ENDPOINTS.STOP.ADD_STOP, formattedData);
      return response.data;
    } catch (error) {
      console.error("Error adding stop:", error);
      throw error;
    }
  }

  // Update stop
  static async updateStop(stopId, stopData) {
    try {
      if (!stopId) {
        throw new Error("Stop ID is required");
      }

      // Validate required fields for update
      const { name, latitude, longitude, tentativeArrivalTime, actualArrivalTime } = stopData;
      
      if (!name || !latitude || !longitude || !tentativeArrivalTime || !actualArrivalTime) {
        throw new Error("All fields are required for update");
      }

      const formattedData = {
        name: String(name).trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        tentativeArrivalTime: new Date(tentativeArrivalTime).toISOString(),
        actualArrivalTime: new Date(actualArrivalTime).toISOString()
      };

      const response = await apiClient.put(`${API_ENDPOINTS.STOP.UPDATE_STOP}/${stopId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error("Error updating stop:", error);
      throw error;
    }
  }

  // Delete stop
  static async deleteStop(stopId) {
    try {
      if (!stopId) {
        throw new Error("Stop ID is required");
      }
      
      console.log("Stop ID being deleted:", stopId);
      const response = await apiClient.delete(`${API_ENDPOINTS.STOP.DELETE_STOP}/${stopId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting stop:", error);
      throw error;
    }
  }

  // Update actual arrival time only
  static async updateActualArrivalTime(stopId, actualArrivalTime) {
    try {
      if (!stopId || !actualArrivalTime) {
        throw new Error("Stop ID and actual arrival time are required");
      }

      const formattedData = {
        actualArrivalTime: new Date(actualArrivalTime).toISOString()
      };

      const response = await apiClient.put(`${API_ENDPOINTS.STOP.UPDATE_ACTUAL_ARRIVAL}/${stopId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error("Error updating actual arrival time:", error);
      throw error;
    }
  }

  // Helper method to validate stop data
  static validateStopData(stopData) {
    const errors = [];
    
    if (!stopData.name || String(stopData.name).trim() === "") {
      errors.push("Stop name is required");
    }
    
    if (!stopData.latitude || isNaN(Number(stopData.latitude))) {
      errors.push("Valid latitude is required");
    }
    
    if (!stopData.longitude || isNaN(Number(stopData.longitude))) {
      errors.push("Valid longitude is required");
    }
    
    if (!stopData.tentativeArrivalTime) {
      errors.push("Tentative arrival time is required");
    } else {
      const tentativeDate = new Date(stopData.tentativeArrivalTime);
      if (isNaN(tentativeDate.getTime())) {
        errors.push("Valid tentative arrival time is required");
      }
    }
    
    if (!stopData.actualArrivalTime) {
      errors.push("Actual arrival time is required");
    } else {
      const actualDate = new Date(stopData.actualArrivalTime);
      if (isNaN(actualDate.getTime())) {
        errors.push("Valid actual arrival time is required");
      }
    }
    
    // Validate latitude range
    if (stopData.latitude && (Number(stopData.latitude) < -90 || Number(stopData.latitude) > 90)) {
      errors.push("Latitude must be between -90 and 90");
    }
    
    // Validate longitude range
    if (stopData.longitude && (Number(stopData.longitude) < -180 || Number(stopData.longitude) > 180)) {
      errors.push("Longitude must be between -180 and 180");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to format time for display
  static formatTime(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      });
    } catch (error) {
      return "Invalid Time";
    }
  }

  // Helper method to format date for input
  static formatDateForInput(dateString) {
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    } catch (error) {
      return "";
    }
  }
} 