// Common types
export interface ApiMessage {
  message: string;
  isError: boolean;
}

// Auth types
export enum Role {
  USER = "VISITOR",
  WAITER = "WAITER",
  ADMIN = "ADMIN",
}

export interface IntUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone: string;
  locked: boolean;
  address: string;
}

// Booking types
export interface Booking {
  id: number;
  userName: string;
  deskLocation: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

// Desk types
export interface Desk {
  id: number;
  deskNumber: number;
  capacity: number;
  location: string;
}

// Food types
export interface Food {
  id: number;
  name: string;
  price: number;
  foodType: string;
}

// Order types
export interface Order {
  id: number;
  foodName: string;
  quantity: number;
  totalPrice: number;
  orderDetailsId: number;
}

export interface OrderDetails {
  orderDetailsId: number;
  totalAmount: number;
  orders: Order[];
  status: string;
}

// Payment types
export interface Payment {
  id: number;
  fullName: string;
  email: string;
  description: string;
  orderDate: Date;
  amount: number;
  transaction: {
    id: number;
    status: string;
  };
}

// Event types
export interface CoffeeEvent {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export type Promotion = CoffeeEvent;

// Review types
export interface Review {
  id: number;
  userName: string;
  rating: number;
  reviewText: string;
  reviewDate: Date;
}
