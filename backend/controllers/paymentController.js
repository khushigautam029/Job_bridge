
import stripe from "../config/stripe.js";
import { ApplicationPassPlan, Payment, } from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";

export const getPaymentPlans = async (req, res) => {
    try {
        const plans = await ApplicationPassPlan.findAll({
            where: {
                isActive: true,
            },
            attributes: [
                "id",
                "planCode",
                "name",
                "durationDays",
                "amount",
                "currency",
            ],
            order: [["amount", "ASC"]],
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            plans,
        });

    } catch (error) {
        console.error("Get Payment Plans Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch payment plans",
        });
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;

        // Only candidates can purchase application passes.
        if (req.user.role !== "CANDIDATE") {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "Only candidates can purchase application passes",
            });
        }

        const { planId } = req.body;

        if (!Number.isInteger(Number(planId)) || Number(planId) <= 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Please provide a valid plan ID",
            });
        }

        // Fetch the selected plan from the database.
        const plan = await ApplicationPassPlan.findOne({
            where: {
                id: Number(planId),
                isActive: true,
            },
        });

        if (!plan) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: "Selected plan not found or inactive",
            });
        }

        // Create a pending payment record.
        const payment = await Payment.create({
            userId,
            planId: plan.id,
            amount: plan.amount,
            currency: plan.currency,
            status: "PENDING",
        });

        try {
            // Create Stripe Checkout Session.
            const frontendUrl = process.env.FRONTEND_URL;
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                allowed_payment_method_types: ["card"],
                customer_email: userEmail,
                client_reference_id: String(userId),
                line_items: [
                    {
                        price_data: {
                            currency: plan.currency.toLowerCase(),
                            product_data: {
                                name: plan.name,
                                description: `Application access for ${plan.durationDays} days`,
                            },
                            unit_amount: plan.amount,
                        },
                        quantity: 1,
                    },
                ],

                metadata: {
                    paymentId: String(payment.id),
                    userId: String(userId),
                    planId: String(plan.id),
                },

                payment_intent_data: {
                    metadata: {
                        paymentId: String(payment.id),
                        userId: String(userId),
                        planId: String(plan.id),
                    },
                },

                success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/payment/cancel`,
            });

            // Save Stripe Checkout Session ID.
            await payment.update({
                stripeSessionId: session.id,
            });

            return res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Checkout session created successfully",
                checkoutUrl: session.url,
                sessionId: session.id,
            });

        } catch (stripeError) {
            // Mark payment as failed if session creation fails.
            await payment.update({
                status: "FAILED",
            });
            throw stripeError;
        }

    } catch (error) {
        console.error("Create Checkout Session Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Unable to create checkout session",
        });
    }
};


export const stripeWebhook = async (req, res) => {
    try {
        const signature = req.headers["stripe-signature"];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("Stripe webhook secret is missing");
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Webhook configuration error",
            });
        }

        // Verify Stripe webhook signature.
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );

        console.log("Stripe Webhook Received:", event.type);
        // We'll process payment events in the next step.
        return res.status(STATUS_CODES.OK).json({
            received: true,
        });

    } catch (error) {
        console.error("Stripe Webhook Error:", error.message);
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "Webhook signature verification failed",
        });
    }
};