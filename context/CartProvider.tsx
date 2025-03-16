import { useState, useContext, useEffect } from "react";
import { CartContext } from "./CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        console.error("Failed to load cart from storage:", error);
      }
    };
    loadCart();
  }, []);
  const calculateTotal = () => {
    const totalAmount = cart.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    return totalAmount.toFixed(2);
  };
  const updateCartStorage = async (updatedCart: any[]) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update cart in storage:", error);
    }
  };
  const handleAddToCart = async (product: any) => {
    if (!product) return; // Ensure product exists

    // Ensure quantity is always a valid number, default to 1
    const productQuantity = product.quantity ?? 1;

    const productExist = cart.find((item) => item.id === product.id);

    const updatedCart = productExist
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + productQuantity }
            : item
        )
      : [...cart, { ...product, quantity: productQuantity }];

    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = async (productId: string) => {
    const productExist = cart.find((item) => item.id === productId);
    if (!productExist) return;

    const updatedCart =
      productExist.quantity === 1
        ? cart.filter((item) => item.id !== productId)
        : cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );

    await updateCartStorage(updatedCart);
  };

  const handleClearCart = async () => {
    await updateCartStorage([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        handleRemoveFromCart,
        handleClearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
