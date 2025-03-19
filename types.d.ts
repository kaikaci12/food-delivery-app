export type UserProfile = {
  uid: string;
  email: string;
  username: string;
  createdAt: Date;
};
export type Order = {
  id: string;
  items: FoodItem[];
  timestamp: Date;
  deliveryAddress: string;
  total: number;
};
