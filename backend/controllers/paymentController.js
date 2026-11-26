import { Op } from "sequelize";
import stripe from "../config/stripe.js";
import { ApplicationPassPlan, CandidatePlan, Payment, User } from "../models/index.js";
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
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
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
                cancel_url: `${frontendUrl}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
            });

            // Save Stripe Checkout Session ID.
            await payment.update({
                stripeSessionId: session.id,
            });

            const sessionCheck = await stripe.checkout.sessions.retrieve(session.id);

            console.log("SESSION VERIFICATION:", {
                id: sessionCheck.id,
                payment_status: sessionCheck.payment_status,
                status: sessionCheck.status,
                amount_total: sessionCheck.amount_total,
                currency: sessionCheck.currency,
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

const activateCandidatePass = async (session) => {
    const paymentId = Number(session.metadata?.paymentId);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
        console.log("Invalid paymentId in Stripe metadata");
        return;
    }

    // Do not activate a pass unless Stripe confirms payment.
    if (session.payment_status !== "paid") {
        console.log("Payment is not completed yet:", session.id);
        return;
    }

    await Payment.sequelize.transaction(async (transaction) => {
        // Find the payment record.
        const payment = await Payment.findByPk(paymentId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!payment) {
            console.log("Payment record not found:", paymentId);
            return;
        }

        // Prevent duplicate webhook processing.
        if (payment.status === "SUCCESS") {
            console.log("Payment already processed:", paymentId);
            return;
        }

        if (payment.status !== "PENDING") {
            console.log("Payment is not pending:", payment.status);
            return;
        }

        // Verify that this is the correct Checkout Session.
        if (
            payment.stripeSessionId !== session.id ||
            String(payment.userId) !== session.metadata?.userId ||
            String(payment.planId) !== session.metadata?.planId
        ) {
            throw new Error("Stripe session details do not match payment record");
        }

        // Verify the actual amount and currency received from Stripe.
        if (
            Number(session.amount_total) !== Number(payment.amount) ||
            session.currency?.toUpperCase() !== payment.currency.toUpperCase()
        ) {
            throw new Error("Payment amount or currency mismatch");
        }

        // Lock the candidate's user record to prevent simultaneous
        // purchases from calculating overlapping pass periods.
        const user = await User.findByPk(payment.userId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!user) {
            throw new Error("Candidate user not found");
        }

        // Fetch the purchased plan.
        const plan = await ApplicationPassPlan.findByPk(payment.planId, {
            transaction,
        });

        if (!plan) {
            throw new Error("Application pass plan not found");
        }

        const now = new Date();

        // Mark previously expired passes as EXPIRED.
        await CandidatePlan.update(
            { status: "EXPIRED" },
            {
                where: {
                    userId: payment.userId,
                    status: "ACTIVE",
                    endDate: {
                        [Op.lte]: now,
                    },
                },
                transaction,
            }
        );

        // Find the latest active or upcoming pass.
        const existingPlan = await CandidatePlan.findOne({
            where: {
                userId: payment.userId,
                status: "ACTIVE",
                endDate: {
                    [Op.gt]: now,
                },
            },
            order: [["endDate", "DESC"]],
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        // Start after the existing pass, or start immediately.
        const startDate = existingPlan
            ? new Date(existingPlan.endDate)
            : now;

        // Calculate the new expiry date.
        const endDate = new Date(
            startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
        );

        // Update payment status.
        await payment.update(
            {
                status: "SUCCESS",
                stripePaymentIntentId:
                    typeof session.payment_intent === "string"
                        ? session.payment_intent
                        : session.payment_intent?.id || null,
                paidAt: now,
            },
            { transaction }
        );

        // Create the candidate's pass.
        await CandidatePlan.create(
            {
                userId: payment.userId,
                paymentId: payment.id,
                planId: plan.id,
                startDate,
                endDate,
                status: "ACTIVE",
            },
            { transaction }
        );
        console.log("Candidate pass activated successfully:", payment.userId);
    });
};

export const stripeWebhook = async (req, res) => {
    let event;

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
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );

    } catch (error) {
        console.error("Stripe Signature Error:", error.message);
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Webhook signature verification failed",
        });
    }

    try {
        console.log("Stripe Webhook Received:", event.type);
        switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded": {
                const session = event.data.object;
                await activateCandidatePass(session);
                break;
            }
            default: console.log("Unhandled Stripe event:", event.type);
        }
        return res.status(STATUS_CODES.OK).json({
            received: true,
        });
    } catch (error) {
        console.error("Webhook Processing Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Payment processing failed",
        });
    }
};

export const getMyPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        // Only candidates can access application pass details.
        if (req.user.role !== "CANDIDATE") {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "Only candidates can access application pass details",
            });
        }

        const now = new Date();

        // Find the candidate's currently usable pass.
        const candidatePlan = await CandidatePlan.findOne({
            where: {
                userId,
                status: "ACTIVE",
                startDate: {
                    [Op.lte]: now,
                },
                endDate: {
                    [Op.gt]: now,
                },
            },
            order: [["endDate", "DESC"]],
        });

        // Candidate has no currently active pass.
        if (!candidatePlan) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                hasActivePlan: false,
                currentPlan: null,
                message: "You do not have an active application pass",
            });
        }

        // Fetch plan details.
        const plan = await ApplicationPassPlan.findByPk(
            candidatePlan.planId,
            {
                attributes: [
                    "id",
                    "planCode",
                    "name",
                    "durationDays",
                    "amount",
                    "currency",
                ],
            }
        );

        if (!plan) {
            throw new Error("Application pass plan not found");
        }

        // Calculate remaining time.
        const remainingMilliseconds =
            new Date(candidatePlan.endDate).getTime() - now.getTime();

        const remainingDays = Math.ceil(
            remainingMilliseconds / (1000 * 60 * 60 * 24)
        );

        return res.status(STATUS_CODES.OK).json({
            success: true,
            hasActivePlan: true,
            currentPlan: {
                candidatePlanId: candidatePlan.id,
                planId: plan.id,
                planCode: plan.planCode,
                planName: plan.name,
                durationDays: plan.durationDays,
                amount: plan.amount,
                currency: plan.currency,
                startDate: candidatePlan.startDate,
                endDate: candidatePlan.endDate,
                remainingDays,
                status: candidatePlan.status,
            },
        });

    } catch (error) {
        console.error("Get My Plan Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch your application pass",
        });
    }
};
export const verifyCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;

        // Only candidates can verify application pass payments.
        if (req.user.role !== "CANDIDATE") {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "Only candidates can verify application pass payments",
            });
        }

        const { session_id: sessionId } = req.query;

        if (!sessionId || typeof sessionId !== "string") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "A valid Stripe session ID is required",
            });
        }

        // Find the payment belonging to the logged-in candidate.
        const payment = await Payment.findOne({
            where: {
                stripeSessionId: sessionId,
                userId,
            },
        });

        if (!payment) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: "Payment record not found",
            });
        }

        // Retrieve the Checkout Session directly from Stripe.
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify session metadata.

        // Verify session metadata.
        if (
            String(session.metadata?.paymentId) !== String(payment.id) ||
            String(session.metadata?.userId) !== String(payment.userId) ||
            String(session.metadata?.planId) !== String(payment.planId)
        ) {
            console.error("Payment metadata mismatch:", {
                stripeMetadata: session.metadata,
                databasePayment: {
                    id: payment.id,
                    userId: payment.userId,
                    planId: payment.planId,
                },
            });

            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Stripe session details do not match the payment record",
            });
        }

        // Verify amount and currency.
        if (
            Number(session.amount_total) !== Number(payment.amount) ||
            session.currency?.toUpperCase() !== payment.currency.toUpperCase()
        ) {
            console.error("Payment amount/currency mismatch:", {
                stripeAmount: session.amount_total,
                databaseAmount: payment.amount,
                stripeCurrency: session.currency,
                databaseCurrency: payment.currency,
            });

            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Payment amount or currency mismatch",
            });
        }

        // The webhook has already verified the payment and activated the pass.
        // Therefore, the database SUCCESS status is authoritative.
        if (payment.status === "SUCCESS") {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                paymentStatus: "SUCCESS",
                message: "Payment completed successfully. Your application pass is active.",
            });
        }

        // Handle expired sessions.
        if (session.status === "expired" && payment.status === "PENDING") {
            await payment.update({
                status: "CANCELLED",
            });

            return res.status(STATUS_CODES.OK).json({
                success: true,
                paymentStatus: "CANCELLED",
                message: "Your payment session has expired.",
            });
        }

        // Stripe received payment, but the webhook has not activated the pass yet.
        if (session.payment_status === "paid" && payment.status === "PENDING") {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                paymentStatus: "PENDING",
                message: "Payment received. Your application pass is being activated.",
            });
        }

        if (["CANCELLED", "FAILED", "REFUNDED"].includes(payment.status)) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                paymentStatus: payment.status,
                message: "Payment was not completed successfully.",
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            paymentStatus: "PENDING",
            message: "Payment is still pending.",
        });
    } catch (error) {
        console.error("Verify Checkout Session Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Unable to verify payment",
        });
    }
};

