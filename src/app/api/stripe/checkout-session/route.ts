// src/app/api/stripe/checkout-session/route.ts
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { price, quantity = 1, locale = "en" } = await req.json();

    if (!price) {
      return new Response(JSON.stringify({ error: "Missing price id" }), { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Get or create the Stripe customer
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    let customerId = user?.stripeCustomerId ?? null;

    if (!customerId) {
  const created = await stripe.customers.create({ metadata: { dbId: userId } });
  customerId = created.id;
  await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
}


    const base =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
      "http://localhost:3000";

    const sessionObj = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price, quantity }],
      
      success_url: `${base}/en/settings?checkout=success`,
      cancel_url: `${base}/en/settings?checkout=cancelled`,
      locale, 
    });

    return new Response(JSON.stringify({ sessionId: sessionObj.id }), { status: 200 });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return new Response(JSON.stringify({ error: "Server error creating session" }), { status: 500 });
  }
}
