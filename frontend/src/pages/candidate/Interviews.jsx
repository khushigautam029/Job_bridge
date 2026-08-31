import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    MapPin,
    Video,
    XCircle,
} from "lucide-react";

const Interviews = () => {
    const upcomingInterviews = [
        {
            id: 1,
            position: "Senior React Developer",
            company: "TechNova Solutions",
            date: "August 28, 2026",
            time: "11:00 AM - 11:45 AM",
            type: "Online Interview",
            mode: "Google Meet",
            location: "Online",
            interviewer: "Rahul Sharma",
        },
        {
            id: 2,
            position: "Backend Developer",
            company: "CloudCore Technologies",
            date: "September 1, 2026",
            time: "02:00 PM - 02:45 PM",
            type: "Technical Interview",
            mode: "Microsoft Teams",
            location: "Online",
            interviewer: "Amit Verma",
        },
    ];

    const pastInterviews = [
        {
            id: 3,
            position: "Frontend Developer",
            company: "Pixel Technologies",
            date: "August 20, 2026",
            time: "03:00 PM - 03:45 PM",
            status: "Completed",
            interviewer: "Neha Kapoor",
        },
        {
            id: 4,
            position: "Full Stack Developer",
            company: "Innovate Labs",
            date: "August 15, 2026",
            time: "11:30 AM - 12:15 PM",
            status: "Cancelled",
            interviewer: "Vikas Mehta",
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Interview Schedule
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Interviews
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Manage your upcoming interviews and review your interview
                    history.
                </p>
            </section>

            {/* Interview Summary */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Upcoming */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Upcoming
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                2
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Scheduled interviews
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CalendarDays size={21} />
                        </div>
                    </div>
                </div>

                {/* Today */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Today
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                0
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Interviews today
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={21} />
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                5
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Interviews completed
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={21} />
                        </div>
                    </div>
                </div>

                {/* Cancelled */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Cancelled
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                1
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Cancelled interviews
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <XCircle size={21} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Interviews */}
            <section className="mt-7">
                <div className="mb-5">
                    <h3 className="font-semibold text-slate-900">
                        Upcoming Interviews
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Your scheduled interviews and meeting details.
                    </p>
                </div>

                <div className="space-y-5">
                    {upcomingInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                {/* Interview Information */}
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <CalendarDays size={22} />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h4 className="font-semibold text-slate-900">
                                                {interview.position}
                                            </h4>

                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                                                Upcoming
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            {interview.company}
                                        </p>

                                        <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {interview.date}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock3
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {interview.time}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Video
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {interview.mode}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {interview.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 lg:min-w-44">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Join Interview
                                        <ExternalLink size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        View Details
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Interviewer */}
                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-400">
                                    Interviewer
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    {interview.interviewer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Past Interviews */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h3 className="font-semibold text-slate-900">
                        Interview History
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Review your previous interviews.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {pastInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                        interview.status === "Completed"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-red-50 text-red-600"
                                    }`}
                                >
                                    {interview.status === "Completed" ? (
                                        <CheckCircle2 size={20} />
                                    ) : (
                                        <XCircle size={20} />
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800">
                                        {interview.position}
                                    </h4>

                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                        {interview.company}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                        <span>{interview.date}</span>
                                        <span>{interview.time}</span>
                                        <span>
                                            Interviewer:{" "}
                                            {interview.interviewer}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        interview.status === "Completed"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-red-50 text-red-600"
                                    }`}
                                >
                                    {interview.status}
                                </span>

                                <button
                                    type="button"
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interview Tips */}
            <section className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Prepare for your next interview
                        </h3>

                        <p className="mt-1 max-w-2xl text-sm text-slate-600">
                            Review the job description, prepare questions for
                            the interviewer, and make sure your profile is up
                            to date.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        View Job
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Interviews;