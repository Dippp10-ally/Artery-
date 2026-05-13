export type ArtStyle =
  | "watercolor"
  | "oil-painting"
  | "digital-illustration"
  | "folk-art"
  | "madhubani"
  | "geometric"
  | "minimalist"
  | "abstract"
  | "portrait"
  | "landscape"
  | "pen-ink"
  | "surrealism"
  | "pop-art"
  | "sculpture";

export type PromotionLevel = "none" | "standard" | "featured" | "spotlight";
export type OrderStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type UserSubscription = "basic" | "pro" | "premium";
export type ArtistSubscription = "starter" | "pro";

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  email?: string;
  name?: string;
  subscription: UserSubscription;
  savedImages: string[];
  connectedArtists: string[];
  createdAt: string;
}

export interface ArtistContact {
  phone: string;
  instagram?: string;
  studioCity: string;
  studioAddress?: string;
}

export interface ArtistPricing {
  commissionBase: number;
  currency: "INR";
  turnaroundDays: number;
}

export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  style: ArtStyle;
  medium?: string;
}

export interface Artist {
  id: string;
  phone: string;
  businessName: string;
  displayName: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  styles: ArtStyle[];
  mediums: string[];
  portfolio: PortfolioItem[];
  pricing: ArtistPricing;
  contact: ArtistContact;
  verified: boolean;
  banned: boolean;
  promotionLevel: PromotionLevel;
  rating: number;
  totalOrders: number;
  joinedAt: string;
  subscriptionTier: ArtistSubscription;
  tosAccepted: boolean;
  tosAcceptedAt: string;
}

export interface DeliveryInfo {
  partnerId: "ekart" | "private";
  trackingId?: string;
  estimatedDelivery?: string;
  status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface Order {
  id: string;
  customerId: string;
  artistId: string;
  generatedImageId: string;
  status: OrderStatus;
  commissionFee: number;
  platformFee: number;
  subscriptionDiscount: number;
  deliveryCharge: number;
  total: number;
  currency: "INR";
  deliveryInfo?: DeliveryInfo;
  contactUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: ArtStyle;
  styleModifiers: string[];
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  timestamp: string;
  userId: string | null;
  matchedStyles: ArtStyle[];
}

export interface CartItem {
  id: string;
  artistId: string;
  generatedImageId: string;
  commissionFee: number;
  deliveryCharge: number;
  addedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: "INR";
  billing: "free" | "monthly" | "yearly";
  features: string[];
  commissionDiscount: number;
  savedImagesLimit: number;
  connectsPerMonth: number;
  highlighted?: boolean;
}

export interface ArtistPlan {
  id: string;
  name: string;
  price: number;
  currency: "INR";
  billing: "monthly";
  features: string[];
  portfolioLimit: number;
  promotionSlots: number;
  highlighted?: boolean;
}
