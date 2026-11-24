import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing. Check your backend .env file.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;