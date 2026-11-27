
import { useEffect, useState } from "react";
import {
    getMySubscription,
    getRefundPreview,
    requestRefund,
} from "../../services/paymentService";

const MySubscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundPreview, setRefundPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [refundLoading, setRefundLoading] = useState(false);

    const [refundMessage, setRefundMessage] = useState("");
    const [refundError, setRefundError] = useState("");
    const [refundResult, setRefundResult] = useState(null);

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

    const formatPrice = (amount, currency = "INR") => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
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

    const openRefundModal = async () => {
        try {
            setShowRefundModal(true);
            setPreviewLoading(true);
            setRefundPreview(null);
            setRefundError("");
            setRefundMessage("");
            setRefundResult(null);

            const response = await getRefundPreview(
                subscription.paymentId
            );

            if (!response.success) {
                throw new Error(
                    response.message || "Unable to calculate refund."
                );
            }

            setRefundPreview(response.refund || response);
        } catch (err) {
            console.error("Refund Preview Error:", err);

            setRefundError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load refund details."
            );
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleRefund = async () => {
        try {
            setRefundLoading(true);
            setRefundError("");

            const response = await requestRefund(
                subscription.paymentId
            );

            if (response.success) {
                setRefundResult(response.refund || null);
                setRefundMessage(
                    response.message || "Refund request processed successfully."
                );

                if (
                    response.refund?.status === "SUCCESS"
                ) {
                    setSubscription((previous) => ({
                        ...previous,
                        status: "REVOKED",
                    }));
                }
            } else {
                setRefundError(
                    response.message || "Unable to process refund."
                );
            }
        } catch (err) {
            console.error("Refund Request Error:", err);

            setRefundError(
                err.response?.data?.message ||
                "Unable to process your refund. Please try again."
            );
        } finally {
            setRefundLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] w-full items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-500">
                        Loading your subscription...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <h2 className="mb-2 text-xl font-bold text-slate-800">
                        Unable to load subscription
                    </h2>

                    <p className="mb-6 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchSubscription}
                        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="flex min-h-[75vh] w-full items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <span className="text-3xl">◇</span>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold text-slate-900">
                        No Active Application Pass
                    </h2>

                    <p className="mb-7 text-sm leading-6 text-slate-500">
                        You currently don't have an active application pass.
                        Explore our plans to start applying for jobs.
                    </p>

                    <button
                        onClick={() =>
                            window.location.assign(
                                "/candidate/application-plans"
                            )
                        }
                        className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Explore Plans
                    </button>
                </div>
            </div>
        );
    }

    const isActive = subscription.status === "ACTIVE";

    return (
        <div className="min-h-[calc(100vh-80px)] w-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">

                {/* Page Header */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            Account & Billing
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            My Subscription
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage your application pass and payment details.
                        </p>
                    </div>

                    <button
                        onClick={fetchSubscription}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Refresh Details
                    </button>
                </div>

                {/* Subscription Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-6 sm:px-8">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Current Application Pass
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {subscription.planName}
                            </h2>
                        </div>

                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {subscription.status}
                        </span>
                    </div>

                    {/* Main Details */}
                    <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Amount Paid
                            </p>

                            <p className="mt-3 text-2xl font-bold text-slate-900">
                                {formatPrice(
                                    subscription.amount,
                                    subscription.currency
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Plan Duration
                            </p>

                            <p className="mt-3 text-2xl font-bold text-slate-900">
                                {subscription.durationDays} Days
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Start Date
                            </p>

                            <p className="mt-3 text-lg font-bold text-slate-900">
                                {formatDate(subscription.startDate)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <p className="text-sm font-medium text-slate-500">
                                Expiry Date
                            </p>

                            <p className="mt-3 text-lg font-bold text-slate-900">
                                {formatDate(subscription.endDate)}
                            </p>
                        </div>
                    </div>

                    {/* Validity Section */}
                    <div className="mx-5 mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5 sm:mx-8 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-indigo-700">
                                    Remaining Validity
                                </p>

                                <p className="mt-2 text-3xl font-bold text-indigo-900">
                                    {subscription.remainingDays} Days
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-3 text-indigo-600">
                                <span className="text-2xl">◷</span>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-indigo-700">
                            {isActive
                                ? "Your application pass is currently active."
                                : "Your application pass is no longer active."}
                        </p>
                    </div>

                    {/* Refund Section */}
                    {isActive && (
                        <div className="border-t border-slate-100 px-5 py-6 sm:px-8">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div className="max-w-2xl">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Need a refund?
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Your eligible refund will be calculated
                                        based on your payment time and the number
                                        of applications submitted using this pass.
                                    </p>
                                </div>

                                <button
                                    onClick={openRefundModal}
                                    className="shrink-0 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                                >
                                    Request Refund
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Refund Confirmation Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Refund Details
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review your eligible refund before confirming.
                                </p>
                            </div>

                            {!refundLoading && !refundResult && (
                                <button
                                    onClick={() => setShowRefundModal(false)}
                                    className="rounded-lg px-3 py-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="space-y-5 p-6">

                            {previewLoading && (
                                <div className="py-8 text-center">
                                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                                    <p className="text-sm text-slate-500">
                                        Calculating your eligible refund...
                                    </p>
                                </div>
                            )}

                            {refundError && (
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                                    {refundError}
                                </div>
                            )}

                            {refundPreview && !refundResult && (
                                <>
                                    <div className="rounded-xl bg-slate-50 p-5">
                                        <p className="text-sm text-slate-500">
                                            Original Payment
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-slate-900">
                                            {formatPrice(
                                                refundPreview.originalAmount ??
                                                subscription.amount,
                                                subscription.currency
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                                        <p className="text-sm font-semibold text-emerald-700">
                                            Eligible Refund Amount
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-emerald-800">
                                            {formatPrice(
                                                refundPreview.refundAmount,
                                                subscription.currency
                                            )}
                                        </p>

                                        <p className="mt-2 text-sm text-emerald-700">
                                            {refundPreview.refundPercentage}% refund
                                        </p>
                                    </div>

                                    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-slate-500">
                                                Applications used
                                            </span>

                                            <span className="font-semibold text-slate-900">
                                                {refundPreview.applicationCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-slate-500">
                                                Refund eligibility
                                            </span>

                                            <span className="font-semibold text-slate-900">
                                                {refundPreview.reason?.replaceAll("_", " ") || "Based on refund policy"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                        <p className="text-sm leading-6 text-amber-800">
                                            Once Stripe successfully processes
                                            your refund, your application pass
                                            will be revoked, even if the refund
                                            is partial.
                                        </p>
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                        <button
                                            onClick={() => setShowRefundModal(false)}
                                            disabled={refundLoading}
                                            className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleRefund}
                                            disabled={refundLoading}
                                            className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {refundLoading
                                                ? "Processing..."
                                                : "Confirm Refund"}
                                        </button>
                                    </div>
                                </>
                            )}

                            {refundResult && (
                                <div className="py-5 text-center">
                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                        <span className="text-3xl">✓</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {refundResult.status === "PENDING"
                                            ? "Refund Processing"
                                            : "Refund Successful"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {refundMessage}
                                    </p>

                                    {refundResult.amount != null && (
                                        <p className="mt-4 text-2xl font-bold text-emerald-700">
                                            {formatPrice(
                                                refundResult.amount,
                                                refundResult.currency || subscription.currency
                                            )}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowRefundModal(false);
                                            fetchSubscription();
                                        }}
                                        className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}

                            {refundError && !refundPreview && (
                                <button
                                    onClick={() => setShowRefundModal(false)}
                                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySubscription;