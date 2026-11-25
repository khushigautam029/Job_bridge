
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <XCircle size={38} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900">
                    Payment Cancelled
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your payment was not completed. No amount has been
                    confirmed as paid. You can return to the plans page
                    and try again whenever you're ready.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/candidate/application-plans")}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>

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
