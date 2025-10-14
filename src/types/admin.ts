export interface User {
  _id?: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface TeamMember {
  _id?: string;
  id: string;
  name: string;
  role: string;
  about: string; // General about for mentorship flow
  bootcampAbout?: string; // Specific about for bootcamp pages
  calendar: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  _id?: string;
  email: string;
  name?: string;
  subscribedAt: Date;
  isActive: boolean;
}

export interface Booking {
  _id?: string;
  clientName: string;
  clientEmail: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Newsletter {
  _id?: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bootcamp {
  _id?: string;
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  mentors: string[];
  registrationStartDate: Date;
  registrationEndDate: Date;
  tags: string[];
  gradientPosition: {
    left: string;
    top: string;
    rotation: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  teamMembers: number;
  subscribers: number;
  bookingsToday: number;
  activeBootcamps: number;
}
