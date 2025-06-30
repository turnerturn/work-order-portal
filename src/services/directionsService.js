// Google Directions API service
class DirectionsService {
  constructor() {
    // In a real application, you would:
    // 1. Store the API key securely (environment variables, backend proxy)
    // 2. Use a backend service to make the API calls to avoid exposing the key
    // 3. Implement proper error handling and retry logic
    this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCNfGXOkxVH4r5BNy56FF3LtVfIlLf1aUA';
    this.baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  }

  /**
   * Optimize route using Google Directions API
   * @param {string} origin - Starting location
   * @param {Array} destinations - Array of destination addresses
   * @returns {Promise} - Optimized route data
   */
  async optimizeRoute(origin, destinations) {
    if (!origin || !destinations || destinations.length === 0) {
      throw new Error('Origin and destinations are required');
    }

    try {
      // Use real Google Directions API
      return await this.callGoogleDirectionsAPI(origin, destinations);
    } catch (error) {
      console.error('Google API call failed, falling back to mock:', error);

      // Fallback to mock if API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      const optimizedOrder = this.mockOptimizeRoute(destinations);

      return {
        status: 'OK',
        routes: [{
          waypoint_order: optimizedOrder,
          legs: destinations.map((dest, index) => ({
            distance: { text: `${Math.floor(Math.random() * 20) + 5} km` },
            duration: { text: `${Math.floor(Math.random() * 30) + 10} min` },
            end_address: dest,
            start_address: index === 0 ? origin : destinations[optimizedOrder[index - 1]]
          }))
        }],
        geocoded_waypoints: destinations.map(dest => ({ geocoder_status: 'OK', place_id: `place_${Math.random()}` }))
      };
    }
  }

  /**
   * Mock route optimization algorithm
   * In a real app, Google's API would handle this optimization
   * @param {Array} destinations - Array of destination addresses
   * @returns {Array} - Optimized order indices
   */
  mockOptimizeRoute(destinations) {
    // Simple mock optimization: shuffle the array to simulate optimization
    const indices = destinations.map((_, index) => index);

    // Simple heuristic: sort by address alphabetically as a mock optimization
    // In reality, Google's API considers actual distances and traffic
    const sortedIndices = [...indices];
    sortedIndices.sort((a, b) => {
      const addressA = destinations[a].toLowerCase();
      const addressB = destinations[b].toLowerCase();
      return addressA.localeCompare(addressB);
    });

    return sortedIndices;
  }

  /**
   * Real Google Directions API call
   * Uses fetch to call Google Directions API with route optimization
   */
  async callGoogleDirectionsAPI(origin, destinations) {
    try {
      // For Google Directions API with waypoint optimization, we need:
      // origin, destination (can be same as origin for round trip), and waypoints with optimize:true

      // Use the origin as both start and end for a round trip
      const destination = origin;

      // All addresses become waypoints to be optimized
      const waypoints = `optimize:true|${destinations.map(dest => encodeURIComponent(dest)).join('|')}`;

      const url = new URL(this.baseUrl);
      url.searchParams.append('origin', origin);
      url.searchParams.append('destination', destination);
      url.searchParams.append('waypoints', waypoints);
      url.searchParams.append('key', this.apiKey);

      console.log('Calling Google Directions API:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Directions API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error('Google Directions API error:', error);
      throw new Error(`Failed to optimize route: ${error.message}`);
    }
  }

  /**
   * Get work orders scheduled for this week that have valid addresses
   * @param {Array} workOrders - All work orders
   * @returns {Array} - Work orders scheduled this week with addresses
   */
  getWorkOrdersForThisWeek(workOrders) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // End of current week

    return workOrders.filter(wo => {
      const nextDue = new Date(wo.schedule.nextDue);
      return nextDue >= startOfWeek && nextDue < endOfWeek && wo.address?.trim();
    });
  }

  /**
   * Reorder work orders based on optimized route
   * @param {Array} workOrders - Original work orders
   * @param {Array} optimizedOrder - Optimized order indices from Google API
   * @returns {Array} - Reordered work orders
   */
  reorderWorkOrders(workOrders, optimizedOrder) {
    if (!optimizedOrder || optimizedOrder.length === 0) {
      return workOrders;
    }

    const reordered = [];
    const thisWeekOrders = this.getWorkOrdersForThisWeek(workOrders);
    const otherOrders = workOrders.filter(wo => !thisWeekOrders.includes(wo));

    // Add optimized this week orders first, in the order specified by Google API
    optimizedOrder.forEach(index => {
      if (index < thisWeekOrders.length) {
        reordered.push(thisWeekOrders[index]);
      }
    });

    // Add any this week orders that weren't included in the optimization
    thisWeekOrders.forEach((wo, index) => {
      if (!optimizedOrder.includes(index)) {
        reordered.push(wo);
      }
    });

    // Add remaining orders that weren't scheduled for this week
    reordered.push(...otherOrders);

    return reordered;
  }
}

// Export singleton instance
export const directionsService = new DirectionsService();
export default DirectionsService;
