import { useState, useContext, useEffect } from "react";
import { CartContext } from "./CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem("cart");
      if (!storedCart) {
        await AsyncStorage.setItem("cart", JSON.stringify([]));
      }
      setCart(storedCart ? JSON.parse(storedCart) : []);
    };
    loadCart();
  }, []);

  const handleAddToCart = async (product: any) => {
    if (product.quantity === 0) return;

    const productExist = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (productExist) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
    } else {
      updatedCart = [...cart, product];
    }

    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = async (productId: string) => {
    const productExist = cart.find((item) => item.id === productId);
    if (!productExist) return;

    let updatedCart;
    if (productExist.quantity === 1) {
      updatedCart = cart.filter((item) => item.id !== productId);
    } else {
      updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    }

    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = async () => {
    await AsyncStorage.setItem("cart", JSON.stringify([]));
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, handleAddToCart, handleRemoveFromCart, handleClearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
