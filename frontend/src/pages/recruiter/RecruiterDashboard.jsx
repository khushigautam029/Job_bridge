import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    FileText,
    Plus,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        {
            title: "Active Jobs",
            value: "6",
            description: "3 jobs posted this month",
            icon: BriefcaseBusiness,
        },
        {
            title: "Applications",
            value: "20",
            description: "9 new applications",
            icon: FileText,
        },
        {
            title: "Shortlisted",
            value: "6",
            description: "6 candidates this week",
            icon: Users,
        },
        {
            title: "Interviews",
            value: "6",
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

    // ==================== NAVIGATION ====================

    const handlePostJob = () => {
        navigate("/recruiter/jobs/post");
    };

    const handleViewAllApplications = () => {
        navigate("/recruiter/applications");
    };

    const handleViewApplication = (candidate) => {
        navigate(
            `/recruiter/applications?candidate=${encodeURIComponent(
                candidate
            )}`
        );
    };

    const handleViewInterview = (candidate) => {
        navigate(
            `/recruiter/interviews?candidate=${encodeURIComponent(
                candidate
            )}`
        );
    };

    const handleViewActiveJobs = () => {
        navigate("/recruiter/jobs?status=Active");
    };

    const handleManageJob = (jobTitle) => {
        navigate(
            `/recruiter/jobs?job=${encodeURIComponent(jobTitle)}`
        );
    };

    const handleJobApplications = (jobTitle) => {
        navigate(
            `/recruiter/applications?job=${encodeURIComponent(
                jobTitle
            )}`
        );
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case "Shortlisted":
                return "bg-green-50 text-green-600";

            case "Interview":
                return "bg-indigo-50 text-indigo-600";

            case "Under Review":
                return "bg-amber-50 text-amber-600";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <main className="p-3 sm:p-7 lg:p-1">

                {/* ==================== HEADER ==================== */}

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

                    {/* Post Job */}

                    <button
                        type="button"
                        onClick={handlePostJob}
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <Plus size={17} />
                        Post a Job
                    </button>
                </section>

                {/* ==================== STATISTICS ==================== */}

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

                {/* ==================== APPLICATIONS + INTERVIEWS ==================== */}

                <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

                    {/* ==================== RECENT APPLICATIONS ==================== */}

                    <div className="rounded-2xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Recent Applications
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Latest candidates who applied to your jobs
                                </p>
                            </div>

                            {/* View All */}

                            <button
                                type="button"
                                onClick={handleViewAllApplications}
                                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                            >
                                View all
                                <ArrowRight size={15} />
                            </button>

                        </div>

                        <div className="divide-y divide-slate-100">

                            {recentApplications.map((application) => (
                                <div
                                    key={`${application.candidate}-${application.position}`}
                                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    {/* Candidate Information */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewApplication(
                                                application.candidate
                                            )
                                        }
                                        className="flex items-center gap-4 text-left"
                                    >
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
                                                Applied {application.date}
                                            </p>
                                        </div>
                                    </button>

                                    {/* Status */}

                                    <span
                                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>

                                </div>
                            ))}

                        </div>
                    </div>

                    {/* ==================== UPCOMING INTERVIEWS ==================== */}

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

                                    {/* View Interview */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewInterview(
                                                interview.candidate
                                            )
                                        }
                                        className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                                    >
                                        View interview
                                        <ArrowRight size={14} />
                                    </button>

                                </div>
                            ))}

                        </div>
                    </div>

                </section>

                {/* ==================== ACTIVE JOBS ==================== */}

                <section className="mt-7 rounded-2xl border border-slate-200 bg-white">

                    {/* Header */}

                    <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Active Jobs
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                View your currently active job postings
                            </p>
                        </div>

                        {/* View Active Jobs */}

                        <button
                            type="button"
                            onClick={handleViewActiveJobs}
                            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            View Active Jobs
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    {/* Job Cards */}

                    <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">

                        {activeJobs.map((job) => (
                            <div
                                key={job.title}
                                className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-md"
                            >

                                {/* Job Icon + Status */}

                                <div className="flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                                        Active
                                    </span>

                                </div>

                                {/* Job Title */}

                                <h4 className="mt-5 font-semibold text-slate-900">
                                    {job.title}
                                </h4>

                                {/* Job Information */}

                                <div className="mt-3 space-y-2 text-xs text-slate-500">

                                    <p>
                                        📍 {job.location}
                                    </p>

                                    <p>
                                        💼 {job.type}
                                    </p>

                                    <p>
                                        👥 {job.applications} applications
                                    </p>

                                </div>

                                {/* Actions */}

                                <div className="mt-5 flex gap-2">

                                    {/* Manage */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleManageJob(job.title)
                                        }
                                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Manage
                                    </button>

                                    {/* Applications */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleJobApplications(
                                                job.title
                                            )
                                        }
                                        className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Applications
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default RecruiterDashboard;
