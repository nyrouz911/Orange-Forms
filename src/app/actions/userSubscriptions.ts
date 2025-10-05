import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function createSubscription({ stripeCustomerId }: { stripeCustomerId: string; }) {
  console.log("readeable test")
    const result = await db
    .update(users)
    .set({ subscribed: sql`TRUE` })
    .where(eq(users.stripeCustomerId, stripeCustomerId));
    console.log("Update result:", result);
  // Optional: result.rowCount if your driver exposes it; otherwise re-read:
  const updated = await db.query.users.findFirst({
  where: eq(users.stripeCustomerId, stripeCustomerId),
  columns: { id: true, email: true, subscribed: true, stripeCustomerId: true },
});
console.log("[createSubscription] updated:", updated);
  
}

export async function deleteSubscription({ stripeCustomerId }: { stripeCustomerId: string; }) {
  const result = await db
    .update(users)
    .set({ subscribed: false })
    .where(eq(users.stripeCustomerId, stripeCustomerId));
  const updated = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, stripeCustomerId),
    columns: { id: true, email: true, subscribed: true, stripeCustomerId: true }
  });
  console.log("[deleteSubscription] updated:", updated);
}

export async function getUserSubscription({ userId }: { userId: string; }) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return !!user?.subscribed;
}
