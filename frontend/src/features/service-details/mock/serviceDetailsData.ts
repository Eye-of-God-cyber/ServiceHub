export interface ServiceProvider {
  id: string;
  name: string;
  experienceYears: number;
  rating: number;
  totalJobs: number;
  startingPrice: number;
  isAvailable: boolean;
  isVerified: boolean;
  bio: string;
  avatarUrl: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface DetailedService {
  id: string;
  title: string;
  categoryName: string;
  startingPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  tagline: string;
  description: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  providers: ServiceProvider[];
  faqs: ServiceFAQ[];
  relatedServiceIds: string[];
}

export const MOCK_PROVIDERS: ServiceProvider[] = [
  {
    id: "prov_1",
    name: "Alex Johnson",
    experienceYears: 5,
    rating: 4.9,
    totalJobs: 342,
    startingPrice: 55,
    isAvailable: true,
    isVerified: true,
    bio: "Expert in home maintenance with a focus on quality and speed.",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "prov_2",
    name: "Sarah Williams",
    experienceYears: 8,
    rating: 4.7,
    totalJobs: 890,
    startingPrice: 45,
    isAvailable: true,
    isVerified: true,
    bio: "Top-rated professional dedicated to customer satisfaction.",
    avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: "prov_3",
    name: "Michael Chen",
    experienceYears: 3,
    rating: 4.5,
    totalJobs: 124,
    startingPrice: 40,
    isAvailable: false,
    isVerified: false,
    bio: "Reliable and detail-oriented specialist.",
    avatarUrl: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
];

export const MOCK_DETAILED_SERVICES: Record<string, DetailedService> = {
  srv_1: {
    id: "srv_1",
    title: "Deep Home Cleaning",
    categoryName: "Cleaning",
    startingPrice: 149.99,
    duration: "3-4 hours",
    rating: 4.8,
    reviewsCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
    tagline: "A comprehensive top-to-bottom clean for your home.",
    description: "Our Deep Home Cleaning service is designed to tackle the toughest dirt and grime in your home. Perfect for spring cleaning, moving in/out, or just refreshing your living space. We use eco-friendly products and bring all necessary equipment.",
    included: [
      "Dusting and wiping all surfaces",
      "Vacuuming and mopping all floors",
      "Deep cleaning of bathrooms (toilets, showers, sinks)",
      "Kitchen cleaning (countertops, sink, exterior of appliances)",
      "Cleaning interior windows and sills",
    ],
    notIncluded: [
      "Cleaning inside the refrigerator or oven (available as add-ons)",
      "Washing exterior windows",
      "Deep carpet shampooing",
      "Moving heavy furniture",
    ],
    highlights: [
      "Eco-friendly, pet-safe products",
      "Fully vetted and background-checked professionals",
      "100% satisfaction guarantee",
    ],
    providers: MOCK_PROVIDERS,
    faqs: [
      {
        question: "Do I need to provide cleaning supplies?",
        answer: "No, our professionals bring their own industry-standard cleaning supplies and equipment. If you prefer us to use your specific products, just let the provider know beforehand.",
      },
      {
        question: "Do I need to be home during the cleaning?",
        answer: "It's entirely up to you. Many customers provide entry instructions and go about their day, while others prefer to be home. Our providers are fully vetted for your peace of mind.",
      },
      {
        question: "How long does a deep clean usually take?",
        answer: "A standard 2-bedroom home typically takes 3 to 4 hours. The exact duration depends on the size of your home and its current condition.",
      },
    ],
    relatedServiceIds: ["srv_2", "srv_3", "srv_6"],
  },
  // We can fallback to this default for any other ID for the sake of the mock
  default: {
    id: "default",
    title: "Standard Home Service",
    categoryName: "General Maintenance",
    startingPrice: 89.0,
    duration: "1-2 hours",
    rating: 4.5,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop",
    tagline: "Professional maintenance and repair services.",
    description: "Our standard home service covers a wide range of maintenance and repair tasks to keep your home in top condition. Whether it's a minor fix or routine upkeep, our experts are here to help.",
    included: [
      "Initial inspection and diagnosis",
      "Standard repairs using quality parts",
      "Post-service cleanup",
    ],
    notIncluded: [
      "Cost of specialized replacement parts",
      "Major structural modifications",
    ],
    highlights: [
      "Quick response times",
      "Transparent pricing",
      "Licensed professionals",
    ],
    providers: MOCK_PROVIDERS.slice(0, 2),
    faqs: [
      {
        question: "Is there a warranty on the service?",
        answer: "Yes, all our services come with a 30-day workmanship warranty.",
      },
      {
        question: "How is the final price determined?",
        answer: "The starting price covers the first hour of labor. Additional materials or extended labor will be quoted before work begins.",
      },
    ],
    relatedServiceIds: ["srv_1", "srv_4"],
  }
};
