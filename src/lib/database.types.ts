// Auto-generated types for your Supabase database tables.
// When you add a table in Supabase, update the matching interface here.

export type SubscriptionTier = "basic" | "pro" | "premium";
export type ArtistTier = "starter" | "pro";
export type CommissionStatus = "pending" | "paid" | "refunded";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;               // = auth.users.id (UUID)
          phone: string;
          name: string | null;
          subscription: SubscriptionTier;
          connected_artists: string[];
          saved_images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      artists: {
        Row: {
          id: string;
          user_id: string | null;   // null for seeded mock artists
          display_name: string;
          business_name: string;
          bio: string;
          location: string;
          avatar_url: string | null;
          mediums: string[];
          styles: string[];
          rating: number;
          total_orders: number;
          commission_base: number;
          turnaround_days: number;
          contact_phone: string;
          contact_instagram: string | null;
          studio_address: string | null;
          studio_city: string;
          verified: boolean;
          banned: boolean;
          promotion_level: "standard" | "featured" | "spotlight";
          subscription_tier: ArtistTier;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["artists"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["artists"]["Insert"]>;
      };
      commissions: {
        Row: {
          id: string;
          patron_id: string;        // profiles.id
          artist_id: string;        // artists.id
          amount: number;           // fee charged (299 / 149 / 0)
          status: CommissionStatus;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["commissions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["commissions"]["Insert"]>;
      };
      generated_images: {
        Row: {
          id: string;
          user_id: string | null;   // null for anonymous
          prompt: string;
          style: string | null;
          image_url: string;
          is_saved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["generated_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["generated_images"]["Insert"]>;
      };
    };
  };
}
