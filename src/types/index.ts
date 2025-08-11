export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "expert" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface Expert {
  id: string;
  userId: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  avatar?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  scheduledAt: Date;
  duration: number;
  type: "video" | "chat";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  isPopular?: boolean;
}
