export interface Child {
  id?: number;
  first_name: string;
  last_name: string;
  birth_year: number;
  experience?: string;
}

export interface ReviewWithParent {
  id: number;
  first_name: string;
  rating: number;
  description: string;
  date: string;
  parent_id: number;
}

export interface Review {
  id: number;
  rating: number;
  description: string;
  date: string;
  parent_id: number;
}

export interface User {
  name: string;
  email: string;
  phone_number?: string;
}

export interface Location {
  price: number;
  name: string;
  id: number;
}

export interface Session {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  booked: boolean;
}

export interface BookingSummary {
  id: number;
  description: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  paid: boolean;
  price: number;
  children: Child[];
}
