import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/razorpay/verify
// Called after Razorpay checkout completes on the client.
// Verifies the payment signature, marks commission as paid, and unlocks artist contact.
export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, artistId, patronId } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // ── Dev / mock mode ───────────────────────────────────────────────────
    if (!keySecret || razorpayOrderId?.startsWith("mock_order_")) {
      // In mock mode, just write the commission to DB and return success
      await markCommissionPaid(patronId, artistId, 0, razorpayOrderId, razorpayPaymentId ?? "mock_payment");
      return NextResponse.json({ success: true, mode: "mock" });
    }

    // ── Production: verify Razorpay signature ─────────────────────────────
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Get the order amount from Razorpay to verify
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: keySecret,
    });
    const order = await razorpay.orders.fetch(razorpayOrderId);
    const amount = Number(order.amount) / 100; // convert paise → INR

    await markCommissionPaid(patronId, artistId, amount, razorpayOrderId, razorpayPaymentId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[razorpay/verify]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function markCommissionPaid(
  patronId: string,
  artistId: string,
  amount: number,
  orderId: string,
  paymentId: string
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await admin.from("commissions").upsert({
    patron_id:           patronId,
    artist_id:           artistId,
    amount,
    status:              "paid",
    razorpay_order_id:   orderId,
    razorpay_payment_id: paymentId,
  }, { onConflict: "patron_id,artist_id" });
  // The DB trigger on_commission_paid will add artist to patron's connected_artists automatically
}
