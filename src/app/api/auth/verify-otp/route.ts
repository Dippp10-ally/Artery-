import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string; countryCode: string; otp: string }
 *
 * In production: validates OTP against stored hash, returns a signed JWT session token.
 */
export async function POST(req: NextRequest) {
  const { phone, countryCode, otp } = await req.json();

  if (!phone || !countryCode || !otp) {
    return NextResponse.json({ error: "phone, countryCode, and otp are required" }, { status: 400 });
  }

  if (otp.length !== 6) {
    return NextResponse.json({ error: "OTP must be 6 digits" }, { status: 400 });
  }

  // Mock: any 6-digit OTP passes. In production verify against stored OTP.
  const mockUser = {
    id: `user_${Buffer.from(`${countryCode}${phone}`).toString("base64").slice(0, 8)}`,
    phone,
    countryCode,
    subscription: "basic" as const,
    savedImages: [],
    connectedArtists: [],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    user: mockUser,
    // In production: return a signed JWT or set an httpOnly cookie
    token: "mock_jwt_token",
  });
}
