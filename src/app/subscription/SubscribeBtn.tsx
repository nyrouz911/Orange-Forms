// src/app/subscription/SubscribeBtn.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe-client";

type Props = {
  price: string;                // Stripe Price ID (recurring)
  locale?: "en" | "fr" | "pl";  // optional, default 'en'
};

export default function SubscribeBtn({ price, locale = "en" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, quantity: 1, locale }),
      });

      if (!res.ok) {
        // If the server returned a JSON error, try to read it
        let msg = "Failed to create checkout session";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        console.error(msg);
        setLoading(false);
        return;
      }

      const { sessionId } = await res.json();
      if (!sessionId) {
        console.error("No sessionId in response");
        setLoading(false);
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        console.error("Stripe.js not loaded");
        setLoading(false);
        return;
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-[var(--brand-orange-500)] text-black rounded px-3 py-1 hover:opacity-90 disabled:opacity-60"
      aria-disabled={loading}
    >
      {loading ? "Redirecting…" : "Upgrade your plan"}
    </button>
  );
}
