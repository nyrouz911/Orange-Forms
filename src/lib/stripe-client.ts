import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      || process.env.NEXT_PUBLIC_PUBLISHABLE_KEY    
      || "";

    if (!key) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Stripe publishable key missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      }
    }

    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
