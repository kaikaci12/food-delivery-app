import { useState, useContext } from "react";
import { CartContext } from "./CartContext";
const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = async (product: any) => {};
  const handleRemoveFromCart = async (productId: string) => {};
  return (
    <CartContext.Provider
      value={{ cart, handleAddToCart }}
    ></CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
