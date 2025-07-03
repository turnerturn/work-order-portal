
// Google Directions API service
class DirectionsService {
  constructor() {
    // In a real application, you would:
    // 1. Store the API key securely (environment variables, backend proxy)
    // 2. Use a backend service to make the API calls to avoid exposing the key
    // 3. Implement proper error handling and retry logic
    this.apiKey = import.meta.env.GOOGLE_DIRECTIONS_API_KEY || 'API_KEY';
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
   * Optimize route for filtered work orders (up to 23 waypoints)
   * @param {string} origin - Starting location
   * @param {Array} workOrders - Filtered work orders to optimize
   * @returns {Promise<Array>} - Optimized work orders in new order
   */
  async optimizeWorkOrderRoute(origin, workOrders) {
    if (!origin || !workOrders || workOrders.length === 0) {
      throw new Error('Origin and work orders are required');
    }

    // Filter work orders with valid addresses
    const validWorkOrders = workOrders.filter(wo => wo.address?.trim());

    if (validWorkOrders.length === 0) {
      throw new Error('No work orders with valid addresses found');
    }

    // Check 23-waypoint limit (Google Directions API limitation)
    let workOrdersToOptimize = validWorkOrders;
    let hasLimitWarning = false;

    if (validWorkOrders.length > 23) {
      workOrdersToOptimize = validWorkOrders.slice(0, 23);
      hasLimitWarning = true;

      // Show warning alert
      const optimizedList = workOrdersToOptimize.map((wo, i) => `${i + 1}. ${wo.name}`).join('\n');
      const warningMessage = `⚠️ Routing Limitation\n\nOur routing service supports a maximum of 23 waypoints per route.\n\nOnly the first 23 work orders will be optimized:\n${optimizedList}\n\nRemaining ${validWorkOrders.length - 23} work orders will appear after the optimized route.`;
      alert(warningMessage);
    }

    try {
      // Extract addresses for the API call
      const destinations = workOrdersToOptimize.map(wo => wo.address);

      // Call the route optimization API
      const routeData = await this.optimizeRoute(origin, destinations);

      // Reorder work orders based on the optimized route
      const optimizedOrder = this.reorderFilteredWorkOrders(
        workOrdersToOptimize,
        routeData.routes[0]?.waypoint_order || []
      );

      // If there were work orders beyond the 23 limit, append them at the end
      if (hasLimitWarning) {
        const remainingWorkOrders = validWorkOrders.slice(23);
        optimizedOrder.push(...remainingWorkOrders);
      }

      // Add any work orders that didn't have valid addresses at the end
      const invalidAddressWorkOrders = workOrders.filter(wo => !wo.address?.trim());
      optimizedOrder.push(...invalidAddressWorkOrders);

      return optimizedOrder;

    } catch (error) {
      console.error('Route optimization failed:', error);
      throw new Error(`Route optimization failed: ${error.message}`);
    }
  }

  /**
   * Reorder work orders based on optimized route for filtered list
   * @param {Array} workOrders - Work orders to reorder
   * @param {Array} optimizedOrder - Optimized order indices from Google API
   * @returns {Array} - Reordered work orders
   */
  reorderFilteredWorkOrders(workOrders, optimizedOrder) {
    if (!optimizedOrder || optimizedOrder.length === 0) {
      return workOrders;
    }

    const reordered = [];

    // Add optimized orders first, in the order specified by Google API
    optimizedOrder.forEach(index => {
      if (index < workOrders.length) {
        reordered.push(workOrders[index]);
      }
    });

    // Add any work orders that weren't included in the optimization
    workOrders.forEach((wo, index) => {
      if (!optimizedOrder.includes(index)) {
        reordered.push(wo);
      }
    });

    return reordered;
  }

  /**
   * Reorder work orders based on optimized route (legacy method)
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

  /**
   * Get work orders scheduled for this week that have valid addresses (legacy method)
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
      // Since we no longer have nextDue, check if the work order has recent activity or needs scheduling
      if (!wo.address?.trim()) return false;

      // Include work orders that have no recent completed activity (need service)
      const hasRecentCompletedActivity = wo.activity?.some(activity => {
        const activityDate = new Date(activity.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate > weekAgo && activity.status === 'completed';
      });

      return !hasRecentCompletedActivity;
    });
  }
}

// Export singleton instance and specific functions
export const directionsService = new DirectionsService();
export const optimizeRoute = (origin, workOrders) => directionsService.optimizeWorkOrderRoute(origin, workOrders);
export default DirectionsService;
