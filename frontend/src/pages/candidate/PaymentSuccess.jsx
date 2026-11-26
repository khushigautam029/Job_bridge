
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Crown,
    LayoutDashboard,
    LoaderCircle,
    RefreshCw,
    XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { verifyCheckoutSession } from "../../services/paymentService";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");
    const retryKey = searchParams.get("retry");

    const [status, setStatus] = useState("VERIFYING");
    const [message, setMessage] = useState(
        "Please wait while we verify your payment."
    );

    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        let timeoutId;

        const verifyPayment = async (currentAttempt = 0) => {
            try {
                const response = await verifyCheckoutSession(sessionId);

                if (cancelled) return;

                const paymentStatus = response.paymentStatus;

                if (paymentStatus === "SUCCESS") {
                    setStatus("SUCCESS");
                    setMessage(response.message);
                    return;
                }

                if (
                    paymentStatus === "FAILED" ||
                    paymentStatus === "CANCELLED" ||
                    paymentStatus === "REFUNDED"
                ) {
                    setStatus(paymentStatus);
                    setMessage(response.message);
                    return;
                }

                if (paymentStatus === "PENDING") {
                    setStatus("PENDING");
                    setMessage(response.message);

                    if (currentAttempt < 9) {
                        timeoutId = setTimeout(() => {
                            if (!cancelled) {
                                setAttempt(currentAttempt + 1);
                                verifyPayment(currentAttempt + 1);
                            }
                        }, 3000);
                    } else {
                        setMessage(
                            "Your payment is still being processed. Please check your subscription again shortly."
                        );
                    }

                    return;
                }

                setStatus("ERROR");
                setMessage("Unexpected payment verification response.");

            } catch (error) {
                if (cancelled) return;

                console.error("Payment Verification Error:", error);

                setStatus("ERROR");
                setMessage(
                    error.response?.data?.message ||
                    "Unable to verify your payment. Please try again."
                );
            }
        };

        if (!sessionId) {
            setStatus("ERROR");
            setMessage("Stripe session ID is missing. Payment cannot be verified.");
            return;
        }

        verifyPayment();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [sessionId, retryKey]);
    
    const handleRetry = () => {
        setStatus("VERIFYING");
        setMessage("Checking your payment status...");
        setAttempt(0);

        // Re-run the verification effect.
        navigate(
            `/payment/success?session_id=${encodeURIComponent(sessionId)}&retry=${Date.now()}`,
            { replace: true }
        );
    };

    const isSuccess = status === "SUCCESS";
    const isPending = status === "PENDING" || status === "VERIFYING";
    const isFailure = [
        "FAILED",
        "CANCELLED",
        "REFUNDED",
    ].includes(status);

    const getStatusIcon = () => {
        if (isSuccess) return <CheckCircle size={38} />;
        if (isPending) {
            return status === "VERIFYING"
                ? <LoaderCircle size={38} className="animate-spin" />
                : <Clock size={38} />;
        }
        return <XCircle size={38} />;
    };

    const getHeading = () => {
        if (isSuccess) return "Payment Successful!";
        if (status === "PENDING") return "Payment Processing";
        if (status === "VERIFYING") return "Verifying Payment";
        if (status === "CANCELLED") return "Payment Cancelled";
        if (status === "REFUNDED") return "Payment Refunded";
        if (status === "FAILED") return "Payment Failed";
        return "Payment Verification Error";
    };

    const iconStyle = isSuccess
        ? "bg-emerald-50 text-emerald-600"
        : isPending
            ? "bg-amber-50 text-amber-600"
            : "bg-red-50 text-red-600";

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconStyle}`}>
                    {getStatusIcon()}
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                    {getHeading()}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {message}
                </p>

                {isPending && attempt > 0 && (
                    <p className="mt-3 text-xs text-slate-400">
                        Verification attempt {attempt + 1} of 10
                    </p>
                )}

                {sessionId && (
                    <p className="mt-4 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                        Session ID: {sessionId}
                    </p>
                )}

                {status === "PENDING" && attempt >= 9 && (
                    <p className="mt-3 text-xs text-amber-700">
                        You can safely leave this page. Your payment will
                        be updated when Stripe confirms it through the webhook.
                    </p>
                )}

                <div className="mt-6 flex flex-col gap-3">

                    {isSuccess && (
                        <button
                            onClick={() => navigate("/candidate/subscription")}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            <Crown size={17} />
                            View My Subscription
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {(isFailure || status === "ERROR" ||
                        (isPending && attempt >= 9)) && (
                            <button
                                onClick={handleRetry}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <RefreshCw size={17} />
                                Check Payment Again
                            </button>
                        )}

                    <button
                        onClick={() => navigate("/candidate/jobs")}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <LayoutDashboard size={17} />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
