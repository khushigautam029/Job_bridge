
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

            setSubscription(
                response.success && response.hasActivePlan
                    ? response.currentPlan
                    : null
            );
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
            month: "short",
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
                    response.message || "Refund processed successfully."
                );

                if (response.refund?.status === "SUCCESS") {
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

    const isActive = subscription?.status === "ACTIVE";

    const closeRefundModal = () => {
        if (refundLoading) return;
        setShowRefundModal(false);
    };

    const DetailItem = ({ label, value }) => (
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-xs font-medium text-slate-500">
                {label}
            </p>
            <p className="mt-1.5 text-base font-bold text-slate-800">
                {value}
            </p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex min-h-[65vh] items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-500">
                        Loading subscription...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800">
                        Unable to load subscription
                    </h2>
                    <p className="my-3 text-sm text-red-600">
                        {error}
                    </p>
                    <button
                        onClick={fetchSubscription}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-8">
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">
                        ◇
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                        No Active Application Pass
                    </h2>

                    <p className="my-3 text-sm leading-6 text-slate-500">
                        You currently don't have an active application pass.
                        Explore our plans to start applying for jobs.
                    </p>

                    <button
                        onClick={() =>
                            window.location.assign(
                                "/candidate/application-plans"
                            )
                        }
                        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Explore Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                            Account & Billing
                        </p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            My Subscription
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            View and manage your application pass.
                        </p>
                    </div>

                    <button
                        onClick={fetchSubscription}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* Subscription Card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Current Application Pass
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                {subscription.planName}
                            </h2>
                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {subscription.status}
                        </span>
                    </div>

                    {/* Subscription Details */}
                    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
                        <DetailItem
                            label="Amount Paid"
                            value={formatPrice(
                                subscription.amount,
                                subscription.currency
                            )}
                        />

                        <DetailItem
                            label="Plan Duration"
                            value={`${subscription.durationDays} Days`}
                        />

                        <DetailItem
                            label="Start Date"
                            value={formatDate(subscription.startDate)}
                        />

                        <DetailItem
                            label="Expiry Date"
                            value={formatDate(subscription.endDate)}
                        />
                    </div>

                    {/* Remaining Validity */}
                    <div className="mx-4 mb-4 rounded-lg border border-indigo-100 bg-indigo-50/70 px-4 py-3 sm:mx-5 sm:mb-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold text-indigo-700">
                                    Remaining Validity
                                </p>
                                <p className="mt-1 text-2xl font-bold text-indigo-900">
                                    {subscription.remainingDays} Days
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl text-indigo-600">
                                ◷
                            </div>
                        </div>

                        <p className="mt-1 text-xs text-indigo-700">
                            {isActive
                                ? "Your application pass is currently active."
                                : "Your application pass is no longer active."}
                        </p>
                    </div>

                    {/* Refund Section */}
                    {isActive && (
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Need a refund?
                                </h3>
                                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                                    Your eligible refund depends on payment time
                                    and the number of applications submitted.
                                </p>
                            </div>

                            <button
                                onClick={openRefundModal}
                                className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                Request Refund
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-5 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeRefundModal();
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Refund Details
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Review your eligible refund.
                                </p>
                            </div>

                            {!refundLoading && !refundResult && (
                                <button
                                    onClick={closeRefundModal}
                                    className="rounded-lg px-2.5 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 p-5">

                            {/* Preview Loading */}
                            {previewLoading && (
                                <div className="py-8 text-center">
                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
                                    <p className="text-sm text-slate-500">
                                        Calculating eligible refund...
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {refundError && (
                                <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                                    {refundError}
                                </div>
                            )}

                            {/* Refund Preview */}
                            {refundPreview && !refundResult && (
                                <>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Original Payment
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                {formatPrice(
                                                    refundPreview.originalAmount ??
                                                    subscription.amount,
                                                    subscription.currency
                                                )}
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                                            Paid
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                                        <p className="text-xs font-semibold text-emerald-700">
                                            Eligible Refund Amount
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-emerald-800">
                                            {formatPrice(
                                                refundPreview.refundAmount,
                                                subscription.currency
                                            )}
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-700">
                                            {refundPreview.refundPercentage}% refund
                                        </p>
                                    </div>

                                    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
                                        <div className="flex justify-between gap-3 py-3 text-sm">
                                            <span className="text-slate-500">
                                                Applications used
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {refundPreview.applicationCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3 py-3 text-sm">
                                            <span className="text-slate-500">
                                                Refund eligibility
                                            </span>
                                            <span className="text-right font-semibold text-slate-900">
                                                {refundPreview.reason?.replaceAll("_", " ") ||
                                                    "Based on refund policy"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                        <p className="text-xs leading-5 text-amber-800">
                                            Once Stripe successfully processes
                                            your refund, your application pass
                                            will be revoked, even if the refund
                                            is partial.
                                        </p>
                                    </div>

                                    {refundError && (
                                        <p className="text-xs text-red-600">
                                            Please review the error before trying again.
                                        </p>
                                    )}

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                        <button
                                            onClick={closeRefundModal}
                                            disabled={refundLoading}
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleRefund}
                                            disabled={refundLoading}
                                            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {refundLoading
                                                ? "Processing..."
                                                : "Confirm Refund"}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Refund Result */}
                            {refundResult && (
                                <div className="py-4 text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                                        ✓
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900">
                                        {refundResult.status === "PENDING"
                                            ? "Refund Processing"
                                            : refundResult.status === "SUCCESS"
                                                ? "Refund Successful"
                                                : "Refund Request Submitted"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-5 text-slate-500">
                                        {refundMessage}
                                    </p>

                                    {refundResult.amount != null && (
                                        <p className="mt-3 text-2xl font-bold text-emerald-700">
                                            {formatPrice(
                                                refundResult.amount,
                                                refundResult.currency ||
                                                subscription.currency
                                            )}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowRefundModal(false);
                                            fetchSubscription();
                                        }}
                                        className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}

                            {/* Preview Error Close */}
                            {refundError && !refundPreview && !previewLoading && (
                                <button
                                    onClick={closeRefundModal}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
