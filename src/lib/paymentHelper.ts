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
  method?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
}): Promise<boolean> {
  const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!loaded || !window.Razorpay) {
    console.error('Failed to load Razorpay Checkout script');
    return false;
  }

  // If amount is already in paise (e.g. 164160 for ₹1,641.60), use as is; otherwise convert rupees to paise
  const amountInPaise =
    options.amount > 50000 && Number.isInteger(options.amount)
      ? options.amount
      : Math.round(options.amount * 100);

  const rzpOptions: any = {
    key: options.keyId,
    amount: amountInPaise,
    currency: options.currency || 'INR',
    name: options.name || 'Meeo Store',
    description: options.description || 'Order Fulfillment',
    order_id: options.orderId,
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
      method: options.method || 'upi',
    },
    notes: options.notes || {},
    theme: {
      color: '#412ce7',
      backdrop_color: '#0c101b',
    },
    config: {
      display: {
        blocks: {
          upi: {
            name: 'Pay via UPI / QR',
            instruments: [
              {
                method: 'upi',
              },
            ],
          },
          netbanking: {
            name: 'Netbanking (50+ Banks)',
            instruments: [
              {
                method: 'netbanking',
              },
            ],
          },
          other: {
            name: 'Cards & Wallets',
            instruments: [
              {
                method: 'card',
              },
              {
                method: 'wallet',
              },
            ],
          },
        },
        sequence: ['block.upi', 'block.netbanking', 'block.other'],
        preferences: {
          show_default_blocks: true,
        },
      },
    },
    handler: function (response: any) {
      if (options.onSuccess) {
        options.onSuccess(response);
      }
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
  };

  try {
    const RazorpayConstructor = (window as any).Razorpay;
    const rzp = new RazorpayConstructor(rzpOptions);
    rzp.on?.('payment.failed', function (resp: any) {
      console.warn('Razorpay payment failed notice:', resp.error);
    });
    rzp.open();
    return true;
  } catch (err) {
    console.error('Failed to initialize Razorpay checkout modal:', err);
    return false;
  }
}
