import { NextRequest, NextResponse } from "next/server";

// Commission fee tiers in INR
const FEE: Record<string, number> = {
  basic:   299,
  pro:     149,
  premium: 0,
};

// POST /api/razorpay/create-order
// Creates a Razorpay order for the commission fee.
// The client then opens the Razorpay checkout modal with this order ID.
export async function POST(req: NextRequest) {
  try {
    const { artistId, patronId, subscriptionTier } = await req.json();
    const amount = FEE[subscriptionTier ?? "basic"] ?? 299;

    // Premium patrons pay nothing — skip payment entirely
    if (amount === 0) {
      return NextResponse.json({ skip: true, amount: 0 });
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // ── Dev mode ──────────────────────────────────────────────────────────
    if (!keyId || keyId.startsWith("rzp_test_your")) {
      return NextResponse.json({
        orderId:   `mock_order_${Date.now()}`,
        amount,
        currency:  "INR",
        keyId:     "mock",
        mode:      "mock",
      });
    }

    // ── Production ────────────────────────────────────────────────────────
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret! });

    const order = await razorpay.orders.create({
      amount:   amount * 100, // Razorpay uses paise (1 INR = 100 paise)
      currency: "INR",
      notes: {
        artistId,
        patronId,
        subscriptionTier,
        platform: "artery",
      },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount,
      currency: "INR",
      keyId,
    });
  } catch (err: any) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
