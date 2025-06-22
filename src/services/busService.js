import apiClient, { API_ENDPOINTS } from '../api/apiConfig';

export class BusService {
  // Get all buses
  static async getAllBuses() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BUS.GET_ALL_BUSES);
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  }

  // Get bus by ID
  static async getBusById(busId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.BUS.GET_BUS_BY_ID}/${busId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bus by ID:', error);
      throw error;
    }
  }

  // Add new bus
  static async addBus(busData) {
    try {
      const formattedData = {
        busNo: String(busData.busNo).trim(),
        capacity: Number(busData.capacity),
        status: Boolean(busData.status)
      };
      
      const response = await apiClient.post(API_ENDPOINTS.BUS.ADD_BUS, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error adding bus:', error);
      throw error;
    }
  }

  // Update bus
  static async updateBus(busId, busData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.BUS.UPDATE_BUS}/${busId}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  }

  // Delete bus
  static async deleteBus(busId) {
    try {
      console.log("i am the busId in api call: ",busId)
      const response = await apiClient.delete(`${API_ENDPOINTS.BUS.DELETE_BUS}/${busId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }
} 