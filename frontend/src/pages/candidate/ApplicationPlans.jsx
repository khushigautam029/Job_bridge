
import {
    Check,
    Clock,
    Crown,
    Loader2,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    createCheckoutSession,
    getPaymentPlans,
} from "../../services/paymentService";

const getPlanIcon = (durationDays) => {
    if (durationDays === 1) return Clock;
    if (durationDays === 30) return Zap;
    return Crown;
};

const getPlanDescription = (durationDays) => {
    if (durationDays === 1) {
        return "Perfect for quick job applications.";
    }

    if (durationDays === 30) {
        return "Ideal for an active job search.";
    }

    return "Best for a long-term job search.";
};

const getPlanFeatures = (durationDays) => [
    "Unlimited job applications",
    "Access to all job listings",
    "Apply without daily restrictions",
    `Valid for ${durationDays} ${durationDays === 1 ? "day" : "days"}`,
];

const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0,
    }).format(Number(amount) / 100);
};

const ApplicationPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPaymentPlans();

                if (!response.success) {
                    throw new Error("Unable to fetch application plans");
                }

                setPlans(response.plans || []);
            } catch (error) {
                console.error("Fetch Plans Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load application plans. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);


    useEffect(() => {
        const resetCheckoutState = () => {
            setCheckoutLoading(null);
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                resetCheckoutState();
            }
        };

        window.addEventListener("pageshow", resetCheckoutState);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pageshow", resetCheckoutState);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handlePurchase = async (plan) => {
        try {
            setCheckoutLoading(plan.id);

            const response = await createCheckoutSession(plan.id);

            if (!response.success || !response.checkoutUrl) {
                throw new Error(
                    response.message || "Unable to initiate payment"
                );
            }

            // Redirect candidate to Stripe Checkout.
            window.location.assign(response.checkoutUrl);
        } catch (error) {
            console.error("Checkout Error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to start checkout. Please try again."
            );

            setCheckoutLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                        JobBridge Application Pass
                    </span>

                    <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Choose Your Application Plan
                    </h1>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                        Apply to more opportunities without daily
                        application restrictions. Choose a plan that
                        matches your job search journey.
                    </p>
                </div>

                {/* Free Plan Information */}
                <div className="mb-7 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
                    <h2 className="text-sm font-semibold text-indigo-900">
                        Free Candidate Access
                    </h2>

                    <p className="mt-1 text-sm text-indigo-700">
                        You can apply for up to 5 jobs per day for free.
                        Purchase an application pass for unlimited
                        applications during its validity.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <Loader2
                            className="animate-spin text-indigo-600"
                            size={32}
                        />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
                        <p className="text-sm text-red-700">{error}</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty Plans */}
                {!loading && !error && plans.length === 0 && (
                    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                        <p className="text-sm text-slate-600">
                            No application plans are currently available.
                        </p>
                    </div>
                )}

                {/* Plans */}
                {!loading && !error && plans.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-3">
                        {plans.map((plan) => {
                            const Icon = getPlanIcon(plan.durationDays);
                            const isPopular = plan.durationDays === 30;
                            const isProcessing = checkoutLoading === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${isPopular
                                            ? "border-indigo-500 ring-1 ring-indigo-100"
                                            : "border-slate-200"
                                        }`}
                                >
                                    {isPopular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                                            Most Popular
                                        </span>
                                    )}

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Icon size={21} />
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        {plan.name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {getPlanDescription(plan.durationDays)}
                                    </p>

                                    <div className="my-4 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-slate-900">
                                            {formatPrice(plan.amount, plan.currency)}
                                        </span>

                                        <span className="text-xs text-slate-500">
                                            / {plan.durationDays} {plan.durationDays === 1 ? "Day" : "Days"}
                                        </span>
                                    </div>

                                    <div className="mb-5 flex-1 space-y-3">
                                        {getPlanFeatures(plan.durationDays).map(
                                            (feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-start gap-2 text-sm text-slate-600"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-emerald-600"
                                                    />
                                                    <span>{feature}</span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handlePurchase(plan)}
                                        disabled={checkoutLoading !== null}
                                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isPopular
                                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                                Redirecting...
                                            </>
                                        ) : (
                                            "Buy Now"
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <p className="mt-6 text-center text-xs text-slate-500">
                    Secure payments powered by Stripe. Your application
                    pass activates after successful payment verification.
                </p>
            </div>
        </div>
    );
};

export default ApplicationPlans;