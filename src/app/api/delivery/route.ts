import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/delivery
 * Body: { pincode: string; weight?: number }
 *
 * In production: calls Ekart or other delivery partner API to get live rate.
 * Returns estimated charge + delivery window.
 */
export async function POST(req: NextRequest) {
  const { pincode, weight = 1 } = await req.json();

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Valid 6-digit pincode required" }, { status: 400 });
  }

  // Mock: calculate delivery charge based on pincode zone
  const zone = Number(pincode[0]);
  const baseCharge = zone <= 4 ? 60 : zone <= 7 ? 80 : 100;
  const weightCharge = Math.max(0, (weight - 1) * 20);
  const deliveryCharge = baseCharge + weightCharge;

  const estimatedDays = zone <= 4 ? "2-3" : zone <= 7 ? "3-5" : "5-7";

  return NextResponse.json({
    partner: "ekart",
    pincode,
    deliveryCharge,
    packagingIncluded: true,
    estimatedDays,
    currency: "INR",
    note: "Packaging material costs are included in the delivery charge.",
  });
}
