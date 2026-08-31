import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    XCircle,
} from "lucide-react";

const Applications = () => {
    const applications = [
        {
            id: 1,
            position: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            appliedDate: "August 26, 2026",
            status: "Interview",
            statusText: "Interview scheduled",
            statusIcon: CalendarDays,
        },
        {
            id: 2,
            position: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            appliedDate: "August 24, 2026",
            status: "Under Review",
            statusText: "Application under review",
            statusIcon: Clock3,
        },
        {
            id: 3,
            position: "Full Stack Developer",
            company: "Innovate Labs",
            location: "Gurgaon, India",
            type: "Full Time",
            appliedDate: "August 21, 2026",
            status: "Applied",
            statusText: "Application submitted",
            statusIcon: CheckCircle2,
        },
        {
            id: 4,
            position: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            type: "Full Time",
            appliedDate: "August 18, 2026",
            status: "Rejected",
            statusText: "Application not selected",
            statusIcon: XCircle,
        },
        {
            id: 5,
            position: "Node.js Developer",
            company: "Cloud Systems",
            location: "Bangalore, India",
            type: "Full Time",
            appliedDate: "August 15, 2026",
            status: "Applied",
            statusText: "Application submitted",
            statusIcon: CheckCircle2,
        },
    ];

    const statusStyles = {
        Applied: {
            badge: "bg-indigo-50 text-indigo-600",
            icon: "bg-indigo-50 text-indigo-600",
        },
        "Under Review": {
            badge: "bg-amber-50 text-amber-600",
            icon: "bg-amber-50 text-amber-600",
        },
        Interview: {
            badge: "bg-green-50 text-green-600",
            icon: "bg-green-50 text-green-600",
        },
        Rejected: {
            badge: "bg-red-50 text-red-600",
            icon: "bg-red-50 text-red-600",
        },
    };

    return (
        <div>
            {/* Page Header */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Career Activity
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Applications
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Keep track of all the jobs you have applied for.
                </p>
            </section>

            {/* Application Summary */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Applications
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                12
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <FileText size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Under Review
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                4
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Interviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                3
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CalendarDays size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Rejected
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                2
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <XCircle size={21} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Applications */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            All Applications
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            View and track your application progress.
                        </p>
                    </div>

                    {/* Filter */}
                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-400 sm:w-48">
                        <option>All Applications</option>
                        <option>Applied</option>
                        <option>Under Review</option>
                        <option>Interview</option>
                        <option>Rejected</option>
                    </select>
                </div>

                {/* Application List */}
                <div className="divide-y divide-slate-100">
                    {applications.map((application) => {
                        const StatusIcon = application.statusIcon;

                        return (
                            <div
                                key={application.id}
                                className="p-6 transition hover:bg-slate-50/70"
                            >
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                    {/* Job Information */}
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Building2 size={22} />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-slate-900">
                                                {application.position}
                                            </h4>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                                {application.company}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                                                <span>
                                                    📍 {application.location}
                                                </span>

                                                <span>
                                                    💼 {application.type}
                                                </span>

                                                <span>
                                                    Applied{" "}
                                                    {application.appliedDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                statusStyles[
                                                    application.status
                                                ].icon
                                            }`}
                                        >
                                            <StatusIcon size={17} />
                                        </div>

                                        <div>
                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                    statusStyles[
                                                        application.status
                                                    ].badge
                                                }`}
                                            >
                                                {application.status}
                                            </span>

                                            <p className="mt-2 text-xs text-slate-400">
                                                {application.statusText}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 xl:w-auto"
                                    >
                                        View Details
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Empty/Info Section */}
            <section className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Looking for more opportunities?
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            Explore new jobs and find opportunities that match
                            your skills.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Find Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Applications;