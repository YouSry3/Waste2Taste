/*
AI AGENT PROMPT:
This file contains mock data for development and testing.
When backend is ready, remove or disable these mocks.
Consider using environment variables to toggle mock mode.
*/

import { User } from "../types";

export const initialUsers: User[] = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "(555) 123-4567",
    orders: 28,
    totalSpent: "$142.50",
    status: "Active",
    joined: "2024-03-15",
    lastOrder: "2025-10-29",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 234-5678",
    orders: 42,
    totalSpent: "$215.80",
    status: "Active",
    joined: "2024-01-20",
    lastOrder: "2025-10-30",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 345-6789",
    orders: 35,
    totalSpent: "$189.20",
    status: "Active",
    joined: "2024-05-10",
    lastOrder: "2025-10-28",
  },
  {
    id: 4,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 456-7890",
    orders: 18,
    totalSpent: "$95.40",
    status: "Active",
    joined: "2024-06-22",
    lastOrder: "2025-10-27",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 567-8901",
    orders: 51,
    totalSpent: "$268.90",
    status: "Active",
    joined: "2024-04-18",
    lastOrder: "2025-10-30",
  },
  {
    id: 6,
    name: "Robert Wilson",
    email: "r.wilson@email.com",
    phone: "(555) 678-9012",
    orders: 12,
    totalSpent: "$67.50",
    status: "Inactive",
    joined: "2024-08-05",
    lastOrder: "2025-09-15",
  },
  {
    id: 7,
    name: "Jessica Brown",
    email: "jess.b@email.com",
    phone: "(555) 789-0123",
    orders: 24,
    totalSpent: "$128.70",
    status: "Active",
    joined: "2024-07-12",
    lastOrder: "2025-10-29",
  },
  {
    id: 8,
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "(555) 890-1234",
    orders: 38,
    totalSpent: "$198.30",
    status: "Active",
    joined: "2024-02-28",
    lastOrder: "2025-10-30",
  },
];

export const mockApiResponse = <T>(data: T, delay = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (
  message: string,
  code: string,
  delay = 300,
): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject({ message, code }), delay);
  });
};
