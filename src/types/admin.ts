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

export interface MentorDetail {
  mentorId: string;
  name: string;
  role: string;
  image?: string;
  description: string;
}

export interface CurriculumSection {
  weekRange: string; // e.g., "Week 1-2"
  title: string;
  icon: string; // icon name for rendering
  items: string[];
}

export interface TargetAudience {
  title: string;
  subtitle: string;
  items: string[];
}

export interface InfoCards {
  duration: {
    value: string;
    label: string;
  };
  mode: {
    value: string;
    label: string;
  };
  interactive: {
    value: string;
    label: string;
  };
  certificate: {
    value: string;
    label: string;
  };
  registrationText: string; // Full registration period text
}

export interface Bootcamp {
  _id?: string;
  id: string;
  title: string;
  description: string;
  price: string; // Display price (e.g., "$99")
  priceAmount: number; // Numeric price in dollars for Stripe (e.g., 99)
  duration: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  mentors: string[];
  registrationStartDate: Date;
  registrationEndDate: Date;
  bootcampStartDate?: Date; // When the bootcamp actually starts
  tags: string[];
  gradientPosition: {
    left: string;
    top: string;
    rotation: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // New detailed content fields
  heroSubheading?: string;
  heroDescription?: string[];
  infoCards?: InfoCards;
  mentorDetails?: MentorDetail[];
  curriculumSections?: CurriculumSection[];
  targetAudience?: TargetAudience;
}

export interface DashboardStats {
  teamMembers: number;
  subscribers: number;
  bookingsToday: number;
  activeBootcamps: number;
}
