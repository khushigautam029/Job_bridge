
import {
    ArrowRight,
    CalendarDays,
    CheckCircle,
    Clock,
    CreditCard,
    Crown,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MySubscription = () => {
    const navigate = useNavigate();

    // Temporary data. We will replace this with the backend API response.
    const subscription = null;

    const getSubscriptionStatus = (plan) => {
        if (!plan) return "NONE";

        const now = new Date();
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);

        if (now < startDate) return "UPCOMING";
        if (now >= endDate) return "EXPIRED";
        return "ACTIVE";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const status = getSubscriptionStatus(subscription);

    const getDaysRemaining = (endDate) => {
        const remaining = new Date(endDate).getTime() - Date.now();
        return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Subscription
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your application pass and view its validity.
                    </p>
                </div>

                {!subscription || status === "NONE" ? (
                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Crown size={28} />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            No Active Subscription
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                            You are currently using the free candidate plan.
                            You can apply for up to 5 jobs per day. Purchase
                            an application pass to enjoy unlimited applications
                            during its validity.
                        </p>

                        <button
                            onClick={() => navigate("/candidate/application-plans")}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Explore Plans
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Crown size={25} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {subscription.planName}
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            JobBridge Application Pass
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        status === "ACTIVE"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : status === "UPCOMING"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-red-50 text-red-700"
                                    }`}
                                >
                                    {status}
                                </span>
                            </div>

                            <div className="my-5 border-t border-slate-100" />

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CreditCard size={16} />
                                        Plan Price
                                    </div>
                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                        ₹{subscription.price}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarDays size={16} />
                                        Start Date
                                    </div>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatDate(subscription.startDate)}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarDays size={16} />
                                        Expiry Date
                                    </div>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatDate(subscription.endDate)}
                                    </p>
                                </div>
                            </div>

                            {status === "ACTIVE" && (
                                <div className="mt-6 rounded-lg bg-emerald-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                        <CheckCircle size={18} />
                                        Your application pass is active
                                    </div>
                                    <p className="mt-1 text-sm text-emerald-700">
                                        {getDaysRemaining(subscription.endDate)} days remaining.
                                        You can apply for unlimited jobs while your pass is active.
                                    </p>
                                </div>
                            )}

                            {status === "UPCOMING" && (
                                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                                    <p className="text-sm font-semibold text-blue-800">
                                        Your pass is scheduled to start on {formatDate(subscription.startDate)}.
                                    </p>
                                </div>
                            )}

                            {status === "EXPIRED" && (
                                <div className="mt-6 rounded-lg bg-red-50 p-4">
                                    <p className="text-sm font-semibold text-red-800">
                                        This application pass has expired.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                            <div className="flex items-start gap-3">
                                <Sparkles className="mt-0.5 shrink-0 text-indigo-600" size={20} />
                                <div>
                                    <h3 className="text-sm font-semibold text-indigo-900">
                                        Want to extend your application pass?
                                    </h3>
                                    <p className="mt-1 text-sm text-indigo-700">
                                        Explore other plans to extend your access
                                        and continue applying for opportunities.
                                    </p>
                                    <button
                                        onClick={() => navigate("/candidate/application-plans")}
                                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                                    >
                                        View Plans
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Clock size={17} className="text-slate-500" />
                        Free Plan Information
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                        Without an active application pass, you can submit
                        up to 5 job applications per IST calendar day.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MySubscription;