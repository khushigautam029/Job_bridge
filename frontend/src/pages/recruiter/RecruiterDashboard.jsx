import {
    ArrowRight,
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Settings,
    User,
    UserCircle,
    Users,
    X
} from "lucide-react";
import { useState } from "react";

const RecruiterDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stats = [
        {
            title: "Active Jobs",
            value: "8",
            description: "3 jobs posted this month",
            icon: BriefcaseBusiness,
        },
        {
            title: "Applications",
            value: "124",
            description: "18 new applications",
            icon: FileText,
        },
        {
            title: "Shortlisted",
            value: "24",
            description: "6 candidates this week",
            icon: Users,
        },
        {
            title: "Interviews",
            value: "12",
            description: "4 scheduled this week",
            icon: CalendarDays,
        },
    ];

    const recentApplications = [
        {
            candidate: "Rahul Sharma",
            position: "Senior React Developer",
            date: "Aug 27, 2026",
            status: "Shortlisted",
        },
        {
            candidate: "Priya Singh",
            position: "Backend Developer",
            date: "Aug 26, 2026",
            status: "Under Review",
        },
        {
            candidate: "Aman Verma",
            position: "Full Stack Developer",
            date: "Aug 25, 2026",
            status: "Interview",
        },
        {
            candidate: "Sneha Kapoor",
            position: "UI/UX Designer",
            date: "Aug 24, 2026",
            status: "Applied",
        },
    ];

    const activeJobs = [
        {
            title: "Senior React Developer",
            applications: 32,
            location: "Delhi, India",
            type: "Full Time",
        },
        {
            title: "Backend Developer",
            applications: 24,
            location: "Bangalore, India",
            type: "Full Time",
        },
        {
            title: "UI/UX Designer",
            applications: 18,
            location: "Remote",
            type: "Full Time",
        },
    ];

    const upcomingInterviews = [
        {
            candidate: "Aman Verma",
            position: "Full Stack Developer",
            date: "Today",
            time: "2:00 PM",
        },
        {
            candidate: "Rahul Sharma",
            position: "Senior React Developer",
            date: "Tomorrow",
            time: "11:00 AM",
        },
        {
            candidate: "Priya Singh",
            position: "Backend Developer",
            date: "Aug 30",
            time: "3:30 PM",
        },
    ];

    const navigation = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            active: true,
        },
        {
            title: "Jobs",
            icon: BriefcaseBusiness,
        },
        {
            title: "Applications",
            icon: FileText,
        },
        {
            title: "Candidates",
            icon: Users,
        },
        {
            title: "Interviews",
            icon: CalendarDays,
        },
        {
            title: "Notifications",
            icon: Bell,
        },
        {
            title: "Company Profile",
            icon: UserCircle,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="text-slate-400 hover:text-slate-600 lg:hidden"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Hiring
                    </p>

                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.title}
                                    type="button"
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                        item.active
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    }`}
                                >
                                    <Icon size={19} />

                                    <span>{item.title}</span>

                                    {item.title === "Notifications" && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                                            5
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Account
                    </p>

                    <nav className="space-y-1">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                        >
                            <Settings size={19} />
                            Settings
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                        >
                            <LogOut size={19} />
                            Logout
                        </button>
                    </nav>
                </div>

                {/* Recruiter Profile */}
                <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <User size={19} />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                Khushi Gautam
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                Recruiter
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex h-20 items-center justify-between px-5 sm:px-7 lg:px-8">
                        {/* Mobile Menu */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="hidden lg:block">
                            <p className="text-xs font-medium text-slate-400">
                                Recruiter Portal
                            </p>

                            <h1 className="text-lg font-bold text-slate-900">
                                Dashboard
                            </h1>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            {/* Post Job */}
                            <button
                                type="button"
                                className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:flex"
                            >
                                <Plus size={17} />
                                Post a Job
                            </button>

                            {/* Notifications */}
                            <button
                                type="button"
                                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                            >
                                <Bell size={20} />

                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
                            </button>

                            {/* Profile */}
                            <button
                                type="button"
                                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={18} />
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Khushi Gautam
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Recruiter
                                    </p>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className="hidden text-slate-400 sm:block"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-5 sm:p-7 lg:p-8">
                    {/* Welcome */}
                    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-medium text-indigo-600">
                                Thursday, August 27, 2026
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Good morning, Khushi 👋
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Here's an overview of your hiring activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:hidden"
                        >
                            <Plus size={17} />
                            Post a Job
                        </button>
                    </section>

                    {/* Statistics */}
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

                    {/* Applications + Interviews */}
                    <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                        {/* Recent Applications */}
                        <div className="rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Recent Applications
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Latest candidates who applied to your
                                        jobs
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
                                        key={`${application.candidate}-${application.position}`}
                                        className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                {application.candidate
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")}
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-800">
                                                    {application.candidate}
                                                </h4>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {application.position}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Applied{" "}
                                                    {application.date}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                application.status ===
                                                "Shortlisted"
                                                    ? "bg-green-50 text-green-600"
                                                    : application.status ===
                                                      "Interview"
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : application.status ===
                                                      "Under Review"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {application.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Interviews */}
                        <div className="rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Upcoming Interviews
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Your scheduled candidate interviews
                                    </p>
                                </div>

                                <CalendarDays
                                    size={19}
                                    className="text-indigo-500"
                                />
                            </div>

                            <div className="divide-y divide-slate-100">
                                {upcomingInterviews.map((interview) => (
                                    <div
                                        key={`${interview.candidate}-${interview.date}`}
                                        className="px-6 py-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-800">
                                                    {interview.candidate}
                                                </h4>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {interview.position}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs font-semibold text-indigo-600">
                                                    {interview.date}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {interview.time}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                        >
                                            View interview
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Active Jobs */}
                    <section className="mt-7 rounded-2xl border border-slate-200 bg-white">
                        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Active Jobs
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Manage your currently active job postings
                                </p>
                            </div>

                            <button
                                type="button"
                                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Manage jobs
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                            {activeJobs.map((job) => (
                                <div
                                    key={job.title}
                                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <BriefcaseBusiness
                                                size={20}
                                            />
                                        </div>

                                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                                            Active
                                        </span>
                                    </div>

                                    <h4 className="mt-5 font-semibold text-slate-900">
                                        {job.title}
                                    </h4>

                                    <div className="mt-3 space-y-2 text-xs text-slate-500">
                                        <p>📍 {job.location}</p>

                                        <p>💼 {job.type}</p>

                                        <p>
                                            👥 {job.applications} applications
                                        </p>
                                    </div>

                                    <div className="mt-5 flex gap-2">
                                        <button
                                            type="button"
                                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Manage
                                        </button>

                                        <button
                                            type="button"
                                            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            Applications
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Hiring CTA */}
                    <section className="mt-7 overflow-hidden rounded-2xl bg-indigo-600 p-7 text-white sm:p-8">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-xl font-bold">
                                    Looking for your next great hire?
                                </h3>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                                    Create a new job posting and reach
                                    candidates who match your requirements.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                            >
                                <Plus size={17} />
                                Post a New Job
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RecruiterDashboard;