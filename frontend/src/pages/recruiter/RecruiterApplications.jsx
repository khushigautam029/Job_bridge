import {
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    Clock3,
    Eye,
    FileText,
    Search,
    User,
    Users,
} from "lucide-react";
import { useState } from "react";

const RecruiterApplications = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobFilter, setJobFilter] = useState("All");

    const applications = [
        {
            id: 1,
            candidate: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            jobTitle: "Senior React Developer",
            location: "Delhi, India",
            experience: "5 years",
            appliedDate: "Aug 27, 2026",
            status: "Shortlisted",
            skills: ["React", "JavaScript", "Node.js"],
        },
        {
            id: 2,
            candidate: "Priya Singh",
            email: "priya.singh@example.com",
            jobTitle: "Backend Developer",
            location: "Bangalore, India",
            experience: "4 years",
            appliedDate: "Aug 26, 2026",
            status: "Under Review",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            id: 3,
            candidate: "Aman Verma",
            email: "aman.verma@example.com",
            jobTitle: "Full Stack Developer",
            location: "Delhi, India",
            experience: "6 years",
            appliedDate: "Aug 25, 2026",
            status: "Interview",
            skills: ["React", "Node.js", "MongoDB"],
        },
        {
            id: 4,
            candidate: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            jobTitle: "UI/UX Designer",
            location: "Remote",
            experience: "3 years",
            appliedDate: "Aug 24, 2026",
            status: "Applied",
            skills: ["Figma", "UI Design", "UX Research"],
        },
        {
            id: 5,
            candidate: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            jobTitle: "Senior React Developer",
            location: "Gurgaon, India",
            experience: "7 years",
            appliedDate: "Aug 23, 2026",
            status: "Rejected",
            skills: ["React", "TypeScript", "Redux"],
        },
        {
            id: 6,
            candidate: "Neha Gupta",
            email: "neha.gupta@example.com",
            jobTitle: "Backend Developer",
            location: "Noida, India",
            experience: "5 years",
            appliedDate: "Aug 22, 2026",
            status: "Shortlisted",
            skills: ["Node.js", "PostgreSQL", "REST API"],
        },
        {
            id: 7,
            candidate: "Rohit Malhotra",
            email: "rohit.malhotra@example.com",
            jobTitle: "Frontend Developer",
            location: "Delhi, India",
            experience: "3 years",
            appliedDate: "Aug 21, 2026",
            status: "Under Review",
            skills: ["React", "HTML", "CSS"],
        },
        {
            id: 8,
            candidate: "Ananya Sharma",
            email: "ananya.sharma@example.com",
            jobTitle: "HR Executive",
            location: "Gurgaon, India",
            experience: "2 years",
            appliedDate: "Aug 20, 2026",
            status: "Applied",
            skills: ["Recruitment", "Communication", "HR"],
        },
    ];

    const filteredApplications = applications.filter((application) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            application.candidate.toLowerCase().includes(searchValue) ||
            application.email.toLowerCase().includes(searchValue) ||
            application.jobTitle.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            application.status === statusFilter;

        const matchesJob =
            jobFilter === "All" ||
            application.jobTitle === jobFilter;

        return matchesSearch && matchesStatus && matchesJob;
    });

    const getStatusClasses = (status) => {
        switch (status) {
            case "Shortlisted":
                return "bg-green-50 text-green-600";

            case "Interview":
                return "bg-indigo-50 text-indigo-600";

            case "Under Review":
                return "bg-amber-50 text-amber-600";

            case "Rejected":
                return "bg-red-50 text-red-500";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("");
    };

    const totalApplications = applications.length;

    const newApplications = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const shortlistedApplications = applications.filter(
        (application) => application.status === "Shortlisted"
    ).length;

    const interviewApplications = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setJobFilter("All");
    };

    return (
        <div>
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Applications
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Review and manage candidates who applied to your jobs.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText size={19} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">
                            Total Applications
                        </p>

                        <p className="text-lg font-bold text-slate-800">
                            {totalApplications}
                        </p>
                    </div>
                </div>
            </section>

            {/* Summary Cards */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Applications
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {totalApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <FileText size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Applications received
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                New Applications
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {newApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Waiting for review
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Shortlisted
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {shortlistedApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <Users size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Candidates shortlisted
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Interviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {interviewApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CalendarDays size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Candidates in interview stage
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search candidate, email or job..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Job Filter */}
                    <div className="relative">
                        <select
                            value={jobFilter}
                            onChange={(e) => setJobFilter(e.target.value)}
                            className="w-full min-w-52 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Jobs</option>

                            <option value="Senior React Developer">
                                Senior React Developer
                            </option>

                            <option value="Backend Developer">
                                Backend Developer
                            </option>

                            <option value="Full Stack Developer">
                                Full Stack Developer
                            </option>

                            <option value="UI/UX Designer">
                                UI/UX Designer
                            </option>

                            <option value="Frontend Developer">
                                Frontend Developer
                            </option>

                            <option value="HR Executive">
                                HR Executive
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Under Review">
                                Under Review
                            </option>
                            <option value="Shortlisted">
                                Shortlisted
                            </option>
                            <option value="Interview">Interview</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* Results Header */}
            <section className="mt-7">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Candidate Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredApplications.length}{" "}
                            {filteredApplications.length === 1
                                ? "application"
                                : "applications"}{" "}
                            found
                        </p>
                    </div>

                    {(search ||
                        statusFilter !== "All" ||
                        jobFilter !== "All") && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-fit text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Applications */}
                {filteredApplications.length > 0 ? (
                    <div className="mt-5 space-y-4">
                        {filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Main Information */}
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                    {/* Candidate */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                            {getInitials(
                                                application.candidate
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    {application.candidate}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                        application.status
                                                    )}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {application.email}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                                <span>
                                                    📍{" "}
                                                    {application.location}
                                                </span>

                                                <span>
                                                    💼{" "}
                                                    {application.experience}{" "}
                                                    experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applied Job */}
                                    <div className="flex items-start gap-3 xl:min-w-72">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <BriefcaseBusiness size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Applied for
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {application.jobTitle}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Applied{" "}
                                                {application.appliedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-[auto_1fr]">
                                    {/* Applied Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                            <CalendarDays size={17} />
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Applied Date
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                {application.appliedDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <p className="mb-2 text-[11px] text-slate-400">
                                            Skills
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {application.skills.map(
                                                (skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Resume */}
                                    <button
                                        type="button"
                                        className="flex w-fit items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                                    >
                                        <FileText size={15} />
                                        View Resume
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <Eye size={15} />
                                            View Candidate
                                        </button>

                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            <User size={15} />
                                            Manage Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <FileText size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No applications found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            We couldn't find any candidate applications
                            matching your search or selected filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default RecruiterApplications;
