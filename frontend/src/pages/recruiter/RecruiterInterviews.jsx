import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    FileText,
    MapPin,
    Phone,
    Search,
    Video,
    XCircle,
} from "lucide-react";
import { useState } from "react";

const RecruiterInterviews = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    const interviews = [
        {
            id: 1,
            candidate: "Aman Verma",
            email: "aman.verma@example.com",
            position: "Full Stack Developer",
            date: "Aug 31, 2026",
            time: "2:00 PM",
            type: "Video",
            status: "Scheduled",
            location: "Google Meet",
        },
        {
            id: 2,
            candidate: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            position: "Senior React Developer",
            date: "Sep 1, 2026",
            time: "11:00 AM",
            type: "In-person",
            status: "Scheduled",
            location: "Delhi Office",
        },
        {
            id: 3,
            candidate: "Priya Singh",
            email: "priya.singh@example.com",
            position: "Backend Developer",
            date: "Sep 2, 2026",
            time: "3:30 PM",
            type: "Phone",
            status: "Scheduled",
            location: "Phone Call",
        },
        {
            id: 4,
            candidate: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            position: "UI/UX Designer",
            date: "Sep 3, 2026",
            time: "10:30 AM",
            type: "Video",
            status: "Scheduled",
            location: "Google Meet",
        },
        {
            id: 5,
            candidate: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            position: "Frontend Developer",
            date: "Aug 28, 2026",
            time: "12:00 PM",
            type: "Video",
            status: "Completed",
            location: "Google Meet",
        },
        {
            id: 6,
            candidate: "Neha Gupta",
            email: "neha.gupta@example.com",
            position: "Backend Developer",
            date: "Aug 27, 2026",
            time: "4:00 PM",
            type: "Phone",
            status: "Completed",
            location: "Phone Call",
        },
        {
            id: 7,
            candidate: "Rohit Malhotra",
            email: "rohit.malhotra@example.com",
            position: "Frontend Developer",
            date: "Aug 26, 2026",
            time: "11:30 AM",
            type: "In-person",
            status: "Cancelled",
            location: "Delhi Office",
        },
        {
            id: 8,
            candidate: "Ananya Sharma",
            email: "ananya.sharma@example.com",
            position: "HR Executive",
            date: "Aug 25, 2026",
            time: "2:30 PM",
            type: "Video",
            status: "Completed",
            location: "Google Meet",
        },
    ];

    const filteredInterviews = interviews.filter((interview) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            interview.candidate.toLowerCase().includes(searchValue) ||
            interview.email.toLowerCase().includes(searchValue) ||
            interview.position.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            interview.status === statusFilter;

        const matchesType =
            typeFilter === "All" ||
            interview.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const scheduledCount = interviews.filter(
        (interview) => interview.status === "Scheduled"
    ).length;

    const completedCount = interviews.filter(
        (interview) => interview.status === "Completed"
    ).length;

    const cancelledCount = interviews.filter(
        (interview) => interview.status === "Cancelled"
    ).length;

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("");
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case "Scheduled":
                return "bg-indigo-50 text-indigo-600";

            case "Completed":
                return "bg-green-50 text-green-600";

            case "Cancelled":
                return "bg-red-50 text-red-500";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "Video":
                return Video;

            case "Phone":
                return Phone;

            default:
                return MapPin;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Interviews
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Schedule and manage interviews with your candidates.
                    </p>
                </div>

                {/* Schedule Interview Button */}
                <button
                    type="button"
                    className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <CalendarDays size={17} />
                    Schedule Interview
                </button>
            </section>

            {/* Statistics */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Interviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {interviews.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CalendarDays size={21} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        All interview records
                    </p>
                </div>

                {/* Scheduled */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Scheduled
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {scheduledCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Clock3 size={21} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Upcoming interviews
                    </p>
                </div>

                {/* Completed */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {completedCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={21} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Successfully completed
                    </p>
                </div>

                {/* Cancelled */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Cancelled
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {cancelledCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <XCircle size={21} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Cancelled interviews
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
                            placeholder="Search candidate or job..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Interview Types</option>
                            <option value="Video">Video</option>
                            <option value="Phone">Phone</option>
                            <option value="In-person">In-person</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* Interview List */}
            <section className="mt-7">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Interview Schedule
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredInterviews.length}{" "}
                            {filteredInterviews.length === 1
                                ? "interview"
                                : "interviews"}{" "}
                            found
                        </p>
                    </div>
                </div>

                {filteredInterviews.length > 0 ? (
                    <div className="mt-5 space-y-4">
                        {filteredInterviews.map((interview) => {
                            const TypeIcon = getTypeIcon(interview.type);

                            return (
                                <div
                                    key={interview.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                                >
                                    {/* Main Information */}
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                        {/* Candidate */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                {getInitials(
                                                    interview.candidate
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {interview.candidate}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                            interview.status
                                                        )}`}
                                                    >
                                                        {interview.status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {interview.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Job */}
                                        <div className="flex items-center gap-3 xl:min-w-60">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <BriefcaseBusiness size={18} />
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Position
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {interview.position}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex items-center gap-3 xl:min-w-52">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                                                <CalendarDays size={18} />
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Date & Time
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {interview.date}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {interview.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interview Details */}
                                    <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                                        {/* Interview Type */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                <TypeIcon size={17} />
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Interview Type
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {interview.type}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                {interview.type === "Phone" ? (
                                                    <Phone size={17} />
                                                ) : interview.type === "Video" ? (
                                                    <Video size={17} />
                                                ) : (
                                                    <MapPin size={17} />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Location
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {interview.location}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Interview Status */}
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                    interview.status ===
                                                    "Scheduled"
                                                        ? "bg-indigo-50 text-indigo-600"
                                                        : interview.status ===
                                                          "Completed"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-500"
                                                }`}
                                            >
                                                {interview.status ===
                                                "Scheduled" ? (
                                                    <Clock3 size={17} />
                                                ) : interview.status ===
                                                  "Completed" ? (
                                                    <CheckCircle2 size={17} />
                                                ) : (
                                                    <XCircle size={17} />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Status
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {interview.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        <button
                                            type="button"
                                            className="flex w-fit items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                                        >
                                            <Eye size={15} />
                                            View Candidate
                                        </button>

                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            {interview.status ===
                                                "Scheduled" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        <CalendarDays
                                                            size={15}
                                                        />
                                                        Reschedule
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                                    >
                                                        <XCircle size={15} />
                                                        Cancel
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                            >
                                                <FileText size={15} />
                                                View Interview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <CalendarDays size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No interviews found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            We couldn't find any interviews matching your
                            search or selected filters.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("All");
                                setTypeFilter("All");
                            }}
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

export default RecruiterInterviews;

