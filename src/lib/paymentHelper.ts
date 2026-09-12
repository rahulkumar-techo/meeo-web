/**
 * @file paymentHelper.ts
 * @description Client-side payment gateway orchestration (Razorpay Checkout JS, Stripe, and Mock Sandbox).
 */

declare global {
  interface Window {
    Razorpay?: any;
    Stripe?: any;
  }
}

/**
 * Dynamically loads an external payment gateway script.
 */
export function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Launches Razorpay Checkout JS modal.
 */
export async function launchRazorpayModal(options: {
  keyId: string;
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}): Promise<boolean> {
  const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!loaded || !window.Razorpay) {
    console.error('Failed to load Razorpay Checkout script');
    return false;
  }

  const rzp = new window.Razorpay({
    key: options.keyId,
    amount: Math.round(options.amount * 100),
    currency: options.currency || 'INR',
    name: options.name || 'Meeo Store',
    description: options.description || 'Order Payment',
    order_id: options.orderId,
    prefill: options.prefill || {},
    theme: {
      color: '#412ce7',
    },
    handler: function (response: any) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) options.onDismiss();
      },
    },
  });

  rzp.open();
  return true;
}
