import apiClient, { API_ENDPOINTS } from '../api/apiConfig';

export class RouteService {
  // Get all routes
  static async getAllRoutes() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ROUTE.GET_ALL_ROUTES);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  // Get route by ID
  static async getRouteById(routeId) {
    try {
      if (!routeId) {
        throw new Error('Route ID is required');
      }

      const response = await apiClient.get(`${API_ENDPOINTS.ROUTE.GET_ROUTE_BY_ID}/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route by ID:', error);
      throw error;
    }
  }

  // Create new route
  static async createRoute(routeData) {
    try {
      // Validate required fields
      const { startPointId, endPointId, distance, time } = routeData;

      if (!startPointId || !endPointId || !distance || !time) {
        throw new Error('All required fields (startPointId, endPointId, distance, time) must be provided');
      }

      const formattedData = {
        startPoint: startPointId, // Send stop ID for start point
        endPoint: endPointId,     // Send stop ID for end point
        distance: Number(distance),
        time: String(time).trim(),
        middleStops: routeData.middleStopIds || [] // Send array of stop IDs
      };

      const response = await apiClient.post(API_ENDPOINTS.ROUTE.CREATE_ROUTE, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  // Update route
  static async updateRoute(routeId, routeData) {
    try {
      if (!routeId) {
        throw new Error('Route ID is required');
      }

      // Format the data for update (only include non-empty fields)
      const updateData = {};

      if (routeData.startPointId) {
        updateData.startPoint = routeData.startPointId; // Send stop ID for start point
      }

      if (routeData.endPointId) {
        updateData.endPoint = routeData.endPointId; // Send stop ID for end point
      }

      if (routeData.distance !== undefined && routeData.distance !== null && routeData.distance !== '') {
        updateData.distance = Number(routeData.distance);
      }

      if (routeData.time && String(routeData.time).trim()) {
        updateData.time = String(routeData.time).trim();
      }

      if (routeData.middleStopIds !== undefined) {
        updateData.middleStops = routeData.middleStopIds || []; // Send array of stop IDs
      }

      const response = await apiClient.put(`${API_ENDPOINTS.ROUTE.UPDATE_ROUTE}/${routeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  // Delete route
  static async deleteRoute(routeId) {
    try {
      if (!routeId) {
        throw new Error('Route ID is required');
      }
      
      console.log("Route ID being deleted:", routeId);
      const response = await apiClient.delete(`${API_ENDPOINTS.ROUTE.DELETE_ROUTE}/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  // Helper method to validate route data
  static validateRouteData(routeData) {
    const errors = [];
    
    if (!routeData.startPointId || String(routeData.startPointId).trim() === '') {
      errors.push('Start point is required');
    }
    
    if (!routeData.endPointId || String(routeData.endPointId).trim() === '') {
      errors.push('End point is required');
    }
    
    if (routeData.startPointId === routeData.endPointId) {
      errors.push('Start point and end point cannot be the same');
    }
    
    if (!routeData.distance || isNaN(Number(routeData.distance)) || Number(routeData.distance) <= 0) {
      errors.push('Valid distance is required');
    }
    
    if (!routeData.time || String(routeData.time).trim() === '') {
      errors.push('Time is required');
    }
    
    if (routeData.middleStopIds && !Array.isArray(routeData.middleStopIds)) {
      errors.push('Middle stops must be an array');
    }
    
    // Check if middle stops contain start or end point
    if (routeData.middleStopIds && Array.isArray(routeData.middleStopIds)) {
      if (routeData.middleStopIds.includes(routeData.startPointId)) {
        errors.push('Middle stops cannot include the start point');
      }
      if (routeData.middleStopIds.includes(routeData.endPointId)) {
        errors.push('Middle stops cannot include the end point');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 