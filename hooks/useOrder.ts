import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Order = {
  id: string;
  items: Array<{ id: string; name: string; quantity: number }>;
  total: number;
  timestamp?: string;
  orderAddress?: {
    street?: string;
    city?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
};

type UseOrderReturnType = {
  order: Order | null;
  saveOrder: (order: Order) => Promise<void>;
  clearOrder: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedOrder();
  }, []);

  const loadSavedOrder = async () => {
    setLoading(true);
    try {
      const savedOrder = await AsyncStorage.getItem("currentOrder");
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        saveOrder(parsedOrder);
      }
    } catch (err) {
      setError("Failed to load saved order.");
      console.error("Failed to load saved order:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (newOrder: Order) => {
    setLoading(true);
    try {
      const orderWithTimestamp = {
        ...newOrder,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        "currentOrder",
        JSON.stringify(orderWithTimestamp)
      );
      console.log("order saved to Async storage", orderWithTimestamp);
      setOrder(orderWithTimestamp);
      setError(null);
    } catch (err) {
      setError("Failed to save order.");
      console.error("Failed to save order:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearOrder = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("currentOrder");
      setOrder(null);
      setError(null);
    } catch (err) {
      setError("Failed to clear order.");
      console.error("Failed to clear order:", err);
    } finally {
      setLoading(false);
    }
  };

  return { order, saveOrder, clearOrder, loading, error };
};
