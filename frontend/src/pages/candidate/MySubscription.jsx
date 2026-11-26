
import { useEffect, useState } from "react";
import { getMySubscription } from "../../services/paymentService";

const MySubscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMySubscription();

            if (response.success && response.hasActivePlan) {
                setSubscription(response.currentPlan);
            } else {
                setSubscription(null);
            }
        } catch (err) {
            console.error("Fetch Subscription Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your subscription. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (amount, currency) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency || "INR",
            maximumFractionDigits: 2,
        }).format(amount / 100);
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading your subscription...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl p-6 text-center">
                <p className="mb-4 text-red-600">{error}</p>

                <button
                    onClick={fetchSubscription}
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
                    <h2 className="mb-3 text-2xl font-bold text-gray-800">
                        No Active Application Pass
                    </h2>

                    <p className="mb-6 text-gray-500">
                        You don't have an active application pass.
                        Purchase a plan to start applying for jobs.
                    </p>

                    <button
                        onClick={() =>
                            window.location.assign(
                                "/candidate/application-plans"
                            )
                        }
                        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
                    >
                        Explore Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Subscription
                </h1>

                <p className="mt-2 text-gray-500">
                    View your current application pass and its validity.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Current Application Pass
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {subscription.planName}
                        </h2>
                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        {subscription.status}
                    </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Amount Paid
                        </p>

                        <p className="mt-2 text-xl font-bold text-gray-900">
                            {formatPrice(
                                subscription.amount,
                                subscription.currency
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Plan Duration
                        </p>

                        <p className="mt-2 text-xl font-bold text-gray-900">
                            {subscription.durationDays} Days
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Start Date
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                            {formatDate(subscription.startDate)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Expiry Date
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                            {formatDate(subscription.endDate)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                    <p className="text-sm font-medium text-indigo-700">
                        Remaining Validity
                    </p>

                    <p className="mt-2 text-3xl font-bold text-indigo-700">
                        {subscription.remainingDays} Days
                    </p>

                    <p className="mt-1 text-sm text-indigo-600">
                        Your application pass is currently active.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MySubscription;
