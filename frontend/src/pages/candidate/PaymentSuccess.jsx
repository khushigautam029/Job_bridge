
import { ArrowRight, CheckCircle, Crown, LayoutDashboard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle size={38} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                    Payment Successful!
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your payment has been received. Your application pass
                    will be available once the payment is verified by JobBridge.
                </p>

                {sessionId && (
                    <p className="mt-3 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                        Session ID: {sessionId}
                    </p>
                )}

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/candidate/subscription")}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <Crown size={17} />
                        View My Subscription
                        <ArrowRight size={16} />
                    </button>

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
