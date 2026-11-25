
import { Check, Clock, Crown, Zap } from "lucide-react";

const plans = [
    {
        id: 1,
        name: "1 Day Pass",
        duration: "1 Day",
        price: 49,
        description: "Perfect for quick job applications.",
        icon: Clock,
        features: [
            "Unlimited job applications",
            "Access to all job listings",
            "Apply without daily restrictions",
            "Valid for 24 hours",
        ],
    },
    {
        id: 2,
        name: "1 Month Pass",
        duration: "30 Days",
        price: 299,
        description: "Ideal for an active job search.",
        icon: Zap,
        popular: true,
        features: [
            "Unlimited job applications",
            "Access to all job listings",
            "Apply without daily restrictions",
            "Valid for 30 days",
        ],
    },
    {
        id: 3,
        name: "6 Months Pass",
        duration: "180 Days",
        price: 499,
        description: "Best for a long-term job search.",
        icon: Crown,
        features: [
            "Unlimited job applications",
            "Access to all job listings",
            "Apply without daily restrictions",
            "Valid for 180 days",
        ],
    },
];

const ApplicationPlans = () => {
    const handlePurchase = (plan) => {
        console.log("Selected plan:", plan);
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

                {/* Plans */}
                <div className="grid gap-5 md:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon = plan.icon;

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                                    plan.popular
                                        ? "border-indigo-500 ring-1 ring-indigo-100"
                                        : "border-slate-200"
                                }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </span>
                                )}

                                {/* Plan Icon */}
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <Icon size={21} />
                                </div>

                                {/* Plan Name */}
                                <h2 className="text-lg font-bold text-slate-900">
                                    {plan.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="my-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-slate-900">
                                        ₹{plan.price}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        / {plan.duration}
                                    </span>
                                </div>

                                {/* Features */}
                                <div className="mb-5 flex-1 space-y-3">
                                    {plan.features.map((feature) => (
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
                                    ))}
                                </div>

                                {/* Purchase Button */}
                                <button
                                    onClick={() => handlePurchase(plan)}
                                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                                        plan.popular
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                    }`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    Secure payments powered by Stripe. Your application
                    pass activates after successful payment verification.
                </p>
            </div>
        </div>
    );
};

export default ApplicationPlans;