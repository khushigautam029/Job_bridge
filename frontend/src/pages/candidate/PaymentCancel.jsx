
import {
    ArrowLeft,
    Clock,
    LoaderCircle,
    RefreshCw,
    XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { verifyCheckoutSession } from "../../services/paymentService";

const PaymentCancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState("CANCELLED");
    const [message, setMessage] = useState(
        "Your checkout was cancelled. No completed payment has been confirmed."
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const checkPayment = async () => {
            if (!sessionId) return;

            try {
                setLoading(true);

                const response = await verifyCheckoutSession(sessionId);

                if (cancelled) return;

                if (response.paymentStatus === "SUCCESS") {
                    setStatus("SUCCESS");
                    setMessage(
                        "Your payment was successfully completed. Your application pass is being activated."
                    );
                } else if (response.paymentStatus === "PENDING") {
                    setStatus("PENDING");
                    setMessage(
                        "Your payment is still pending. Please check your subscription again shortly."
                    );
                } else {
                    setStatus(response.paymentStatus);
                    setMessage(response.message);
                }

            } catch (error) {
                if (cancelled) return;

                console.error("Cancel Page Verification Error:", error);

                setStatus("ERROR");
                setMessage(
                    error.response?.data?.message ||
                    "Unable to check your payment status."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        checkPayment();

        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    const isPending = status === "PENDING";
    const isSuccess = status === "SUCCESS";

    const heading = isSuccess
        ? "Payment Successful!"
        : isPending
            ? "Payment Processing"
            : status === "ERROR"
                ? "Unable to Verify Payment"
                : "Payment Cancelled";

    const icon = isSuccess
        ? <Clock size={38} />
        : isPending
            ? <LoaderCircle size={38} className="animate-spin" />
            : <XCircle size={38} />;

    const iconStyle = isSuccess
        ? "bg-emerald-50 text-emerald-600"
        : isPending
            ? "bg-amber-50 text-amber-600"
            : "bg-red-50 text-red-600";

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconStyle}`}>
                    {icon}
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                    {heading}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {message}
                </p>

                {sessionId && (
                    <p className="mt-4 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                        Session ID: {sessionId}
                    </p>
                )}

                {loading && (
                    <p className="mt-3 text-xs text-slate-400">
                        Checking your payment status...
                    </p>
                )}

                <div className="mt-6 flex flex-col gap-3">

                    {isSuccess ? (
                        <button
                            onClick={() =>
                                navigate("/candidate/subscription")
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            View My Subscription
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                navigate("/candidate/application-plans")
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/candidate/jobs")}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;