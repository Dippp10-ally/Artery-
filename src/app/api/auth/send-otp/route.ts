import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/send-otp
 * Body: { phone: string; countryCode: string }
 *
 * In production: sends OTP via MSG91, Twilio, or Fast2SMS.
 * Currently mocks success after a short delay.
 */
export async function POST(req: NextRequest) {
  const { phone, countryCode } = await req.json();

  if (!phone || !countryCode) {
    return NextResponse.json({ error: "phone and countryCode are required" }, { status: 400 });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit phone number" }, { status: 400 });
  }

  // Mock OTP send — in production call your SMS provider here
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // await smsClient.send({ to: `${countryCode}${phone}`, message: `Your Artery OTP: ${otp}` });

  return NextResponse.json({
    success: true,
    message: `OTP sent to ${countryCode} ${phone}`,
    // In development: include the mock OTP for testing
    ...(process.env.NODE_ENV === "development" && { devOtp: "123456" }),
  });
}
