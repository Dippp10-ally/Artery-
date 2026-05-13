import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/mock/orders";

/**
 * GET /api/orders — list orders for the authenticated user
 * POST /api/orders — create a new order (triggers payment + contact unlock)
 */
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = MOCK_ORDERS.filter((o) => o.customerId === userId);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { artistId, generatedImageId, deliveryAddress } = body;

  if (!artistId || !generatedImageId || !deliveryAddress) {
    return NextResponse.json({ error: "artistId, generatedImageId, and deliveryAddress are required" }, { status: 400 });
  }

  // In production: initiate Razorpay payment, create order record, set status PENDING
  const mockOrder = {
    id: `order_${Date.now()}`,
    customerId: userId,
    artistId,
    generatedImageId,
    status: "PENDING",
    commissionFee: 499,
    platformFee: 50,
    subscriptionDiscount: 0,
    deliveryCharge: 80,
    total: 629,
    currency: "INR",
    contactUnlocked: false, // unlocked after payment confirmed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ order: mockOrder, paymentUrl: "/cart" }, { status: 201 });
}
