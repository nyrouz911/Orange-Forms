import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createSubscription, deleteSubscription } from "@/app/actions/userSubscriptions";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Misconfigured", { status: 500 });
  }
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[webhook] Invalid signature:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[webhook] type:", event.type);

  try {
    if (relevantEvents.has(event.type)) {
      switch (event.type) {
        case "checkout.session.completed": {
          const s = event.data.object as Stripe.Checkout.Session;
          console.log("[webhook] checkout.session.completed", { mode: s.mode, customer: s.customer });
          if (s.mode === "subscription" && s.customer) {
            await createSubscription({ stripeCustomerId: String(s.customer) });
          }
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const sub = event.data.object as Stripe.Subscription;
          console.log("[webhook] subscription upsert", { status: sub.status, customer: sub.customer });
          await createSubscription({ stripeCustomerId: String(sub.customer) });
          break;
        }
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          console.log("[webhook] subscription deleted", { customer: sub.customer });
          await deleteSubscription({ stripeCustomerId: String(sub.customer) });
          break;
        }
      }
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("[webhook] handler error:", err);
    return new Response("Webhook error", { status: 500 });
  }
}
