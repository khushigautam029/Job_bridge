import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    FileText,
    UserCircle,
} from "lucide-react";

const CandidateDashboard = () => {
    const stats = [
        {
            title: "Applications",
            value: "12",
            description: "2 new this week",
            icon: FileText,
        },
        {
            title: "Saved Jobs",
            value: "8",
            description: "3 added recently",
            icon: Bookmark,
        },
        {
            title: "Interviews",
            value: "3",
            description: "1 upcoming",
            icon: CalendarDays,
        },
        {
            title: "Profile Completion",
            value: "75%",
            description: "Complete your profile",
            icon: UserCircle,
        },
    ];

    const recentApplications = [
        {
            position: "Senior React Developer",
            company: "TechNova Solutions",
            date: "Aug 26, 2026",
            status: "Interview",
        },
        {
            position: "Backend Developer",
            company: "CloudCore Technologies",
            date: "Aug 24, 2026",
            status: "Applied",
        },
        {
            position: "Full Stack Developer",
            company: "Innovate Labs",
            date: "Aug 21, 2026",
            status: "Under Review",
        },
    ];

    const recommendedJobs = [
        {
            title: "MERN Stack Developer",
            company: "Digital Solutions",
            location: "Delhi, India",
            salary: "₹7L - ₹12L",
            type: "Full Time",
        },
        {
            title: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            salary: "₹6L - ₹10L",
            type: "Full Time",
        },
        {
            title: "Node.js Developer",
            company: "Cloud Systems",
            location: "Bangalore, India",
            salary: "₹8L - ₹14L",
            type: "Full Time",
        },
    ];

    return (
        <div>
            {/* Welcome */}
            <section>
                <p className="text-sm font-medium text-indigo-600">
                    Thursday, August 27, 2026
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Good morning, Khushi 👋
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Here's what's happening with your job search.
                </p>
            </section>

            {/* Stats */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Icon size={21} />
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Main Grid */}
            <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Recent Applications */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Recent Applications
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Track your latest job applications
                            </p>
                        </div>

                        <button
                            type="button"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            View all
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentApplications.map((application) => (
                            <div
                                key={application.position}
                                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                        <Building2 size={20} />
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">
                                            {application.position}
                                        </h4>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {application.company}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Applied {application.date}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        application.status === "Interview"
                                            ? "bg-green-50 text-green-600"
                                            : application.status ===
                                              "Under Review"
                                            ? "bg-amber-50 text-amber-600"
                                            : "bg-indigo-50 text-indigo-600"
                                    }`}
                                >
                                    {application.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Interview */}
                <div className="rounded-2xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h3 className="font-semibold text-slate-900">
                            Upcoming Interview
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Your next scheduled interview
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="rounded-2xl bg-indigo-50 p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                    <CalendarDays size={21} />
                                </div>

                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600">
                                    Tomorrow
                                </span>
                            </div>

                            <h4 className="mt-5 font-semibold text-slate-900">
                                Senior React Developer
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                TechNova Solutions
                            </p>

                            <div className="mt-5 space-y-2 text-sm text-slate-600">
                                <p>📅 August 28, 2026</p>

                                <p>🕐 11:00 AM - 11:45 AM</p>

                                <p>💻 Online Interview</p>
                            </div>

                            <button
                                type="button"
                                className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                View Interview
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Jobs */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Recommended Jobs
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Jobs matching your skills and profile
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Explore jobs
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {recommendedJobs.map((job) => (
                        <div
                            key={job.title}
                            className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BriefcaseBusiness size={20} />
                                </div>

                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Bookmark size={18} />
                                </button>
                            </div>

                            <h4 className="mt-5 font-semibold text-slate-900">
                                {job.title}
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                {job.company}
                            </p>

                            <div className="mt-4 space-y-2 text-xs text-slate-500">
                                <p>📍 {job.location}</p>
                                <p>💼 {job.type}</p>
                                <p>💰 {job.salary}</p>
                            </div>

                            <button
                                type="button"
                                className="mt-5 w-full rounded-xl border border-indigo-200 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                            >
                                View Job
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Profile Completion */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <UserCircle size={21} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Complete your profile
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    A complete profile increases your chances
                                    of getting noticed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full w-3/4 rounded-full bg-indigo-600" />
                        </div>

                        <span className="text-sm font-bold text-slate-700">
                            75%
                        </span>

                        <button
                            type="button"
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Complete Profile
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CandidateDashboard;