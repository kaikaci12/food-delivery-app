import { createContext } from "react";
export interface CartProps {
  cart: any[];
  handleAddToCart: (product: any) => Promise<any>;
  handleRemoveFromCart: (productId: string) => void;
  handleClearCart: () => void;
}
export const CartContext = createContext<CartProps>({
  cart: [],
  handleAddToCart: async () => {},
  handleRemoveFromCart: async () => {},
  handleClearCart: async () => {},
});
