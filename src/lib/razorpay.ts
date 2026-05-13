// Client-side Razorpay helper.
// Loads the Razorpay checkout script on demand and opens the payment modal.

export interface RazorpayOptions {
  orderId: string;
  amount: number; // INR
  keyId: string;
  name?: string;
  description?: string;
  phone?: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onDismiss?: () => void;
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id  = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(opts: RazorpayOptions): Promise<void> {
  const loaded = await loadScript();
  if (!loaded) {
    alert("Razorpay failed to load. Please check your internet connection.");
    return;
  }

  const { orderId, amount, keyId, name, description, phone, onSuccess, onDismiss } = opts;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rzp = new (window as any).Razorpay({
    key:         keyId,
    amount:      amount * 100, // paise
    currency:    "INR",
    name:        name ?? "ARTERY",
    description: description ?? "Artist commission fee",
    order_id:    orderId,
    prefill: {
      contact: phone ?? "",
    },
    theme: { color: "#A38A6D" }, // warm terracotta accent
    modal: {
      ondismiss: () => onDismiss?.(),
    },
    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
      onSuccess(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
    },
  });

  rzp.open();
}
