import { NextRequest, NextResponse } from "next/server";

// Commission fee tiers (in INR) based on patron subscription
const FEE: Record<string, number> = {
  basic:   299,
  pro:     149,
  premium: 0,
};

export async function POST(req: NextRequest) {
  try {
    const { artistId, patronId, subscriptionTier } = await req.json();

    if (!artistId || !patronId) {
      return NextResponse.json({ error: "Missing artistId or patronId" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // ── Development mode: skip DB, return success ──────────────────────────
    if (!supabaseUrl || supabaseUrl === "https://your-project.supabase.co" || !serviceKey) {
      return NextResponse.json({
        success: true,
        amount: FEE[subscriptionTier ?? "basic"] ?? 299,
        mode: "mock",
      });
    }

    // ── Production: write to Supabase ──────────────────────────────────────
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const amount = FEE[subscriptionTier ?? "basic"] ?? 299;

    // Check if already connected
    const { data: existing } = await admin
      .from("commissions")
      .select("id, status")
      .eq("patron_id", patronId)
      .eq("artist_id", artistId)
      .single();

    if (existing?.status === "paid") {
      return NextResponse.json({ success: true, amount: 0, alreadyConnected: true });
    }

    // Create or update commission record
    const { error } = await admin.from("commissions").upsert({
      patron_id: patronId,
      artist_id: artistId,
      amount,
      status: "paid",   // In production: set to "pending" and flip to "paid" after Razorpay webhook
    }, { onConflict: "patron_id,artist_id" });

    if (error) throw error;

    return NextResponse.json({ success: true, amount });
  } catch (err: any) {
    console.error("[commissions] error:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
