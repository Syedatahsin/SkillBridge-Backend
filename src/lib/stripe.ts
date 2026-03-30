import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Update from 'acacia' to 'dahlia'
  apiVersion: '2026-03-25.dahlia' as any, 
  typescript: true,
});