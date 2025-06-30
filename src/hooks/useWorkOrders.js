import { useEffect, useState } from 'react';
import mockData from '../data/mockWorkOrders.json';

export const useWorkOrders = (apiUrl = null) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        if (apiUrl) {
          // Fetch from actual API
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setWorkOrders(data);
        } else {
          // Use mock data for development
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setWorkOrders(mockData);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data if API fails
        setWorkOrders(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [apiUrl]);

  const refreshWorkOrders = () => {
    const fetchWorkOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        if (apiUrl) {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setWorkOrders(data);
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
          setWorkOrders(mockData);
        }
      } catch (err) {
        setError(err.message);
        setWorkOrders(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  };

  return {
    workOrders,
    setWorkOrders,
    loading,
    error,
    refreshWorkOrders
  };
};
