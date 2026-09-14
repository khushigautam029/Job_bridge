import {
    ArrowRight,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    Copy,
    ExternalLink,
    MapPin,
    Search,
    Video,
    X,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const Interviews = () => {
    const [interviews, setInterviews] = useState([
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
            email: "rahul.sharma@technova.com",
            meetingLink: "https://meet.google.com/abc-defg-hij",
            status: "Upcoming",
            duration: "45 minutes",
            notes: "Technical discussion focused on React, JavaScript and frontend architecture.",
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
            email: "amit.verma@cloudcore.com",
            meetingLink: "https://teams.microsoft.com/l/meetup-join/example",
            status: "Upcoming",
            duration: "45 minutes",
            notes: "Backend technical interview covering Node.js, Express, REST APIs and MySQL.",
        },
        {
            id: 3,
            position: "Frontend Developer",
            company: "Pixel Technologies",
            date: "August 20, 2026",
            time: "03:00 PM - 03:45 PM",
            type: "Technical Interview",
            mode: "Google Meet",
            location: "Online",
            interviewer: "Neha Kapoor",
            email: "neha@pixeltech.com",
            meetingLink: "https://meet.google.com/xyz-abc-def",
            status: "Completed",
            duration: "45 minutes",
            notes: "Frontend interview focused on React and UI development.",
        },
        {
            id: 4,
            position: "Full Stack Developer",
            company: "Innovate Labs",
            date: "August 15, 2026",
            time: "11:30 AM - 12:15 PM",
            type: "Technical Interview",
            mode: "Google Meet",
            location: "Online",
            interviewer: "Vikas Mehta",
            email: "vikas@innovatelabs.com",
            meetingLink: "https://meet.google.com/old-interview",
            status: "Cancelled",
            duration: "45 minutes",
            notes: "Interview was cancelled by the recruiter.",
        },
        {
            id: 5,
            position: "Node.js Developer",
            company: "Cloud Systems",
            date: "August 10, 2026",
            time: "04:00 PM - 04:45 PM",
            type: "Technical Interview",
            mode: "Microsoft Teams",
            location: "Online",
            interviewer: "Ankit Mehra",
            email: "ankit@cloudsystems.com",
            meetingLink: "https://teams.microsoft.com/example",
            status: "Completed",
            duration: "45 minutes",
            notes: "Discussion about backend architecture and database design.",
        },
    ]);

    const [selectedInterview, setSelectedInterview] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("recent");
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [meetingInterview, setMeetingInterview] = useState(null);
    const [copied, setCopied] = useState(false);

    const upcomingInterviews = interviews.filter(
        (interview) => interview.status === "Upcoming"
    );

    const completedInterviews = interviews.filter(
        (interview) => interview.status === "Completed"
    );

    const cancelledInterviews = interviews.filter(
        (interview) => interview.status === "Cancelled"
    );

    const filteredInterviews = useMemo(() => {
        let result = interviews.filter((interview) => {
            const matchesSearch =
                interview.position
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                interview.company
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                interview.interviewer
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" ||
                interview.status.toUpperCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });

        if (sortBy === "company") {
            result = [...result].sort((a, b) =>
                a.company.localeCompare(b.company)
            );
        }

        if (sortBy === "position") {
            result = [...result].sort((a, b) =>
                a.position.localeCompare(b.position)
            );
        }

        return result;
    }, [interviews, search, statusFilter, sortBy]);

    const cancelInterview = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this interview?"
        );

        if (!confirmed) return;

        setInterviews((current) =>
            current.map((interview) =>
                interview.id === id
                    ? {
                          ...interview,
                          status: "Cancelled",
                      }
                    : interview
            )
        );

        if (selectedInterview?.id === id) {
            setSelectedInterview((current) =>
                current
                    ? {
                          ...current,
                          status: "Cancelled",
                      }
                    : null
            );
        }
    };

    const completeInterview = (id) => {
        setInterviews((current) =>
            current.map((interview) =>
                interview.id === id
                    ? {
                          ...interview,
                          status: "Completed",
                      }
                    : interview
            )
        );

        if (selectedInterview?.id === id) {
            setSelectedInterview((current) =>
                current
                    ? {
                          ...current,
                          status: "Completed",
                      }
                    : null
            );
        }
    };

    const openJoinModal = (interview) => {
        setMeetingInterview(interview);
        setShowJoinModal(true);
        setCopied(false);
    };

    const copyMeetingLink = async () => {
        if (!meetingInterview?.meetingLink) return;

        try {
            await navigator.clipboard.writeText(
                meetingInterview.meetingLink
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            alert("Unable to copy meeting link");
        }
    };

    const getStatusClasses = (status) => {
        if (status === "Completed") {
            return "bg-green-50 text-green-600";
        }

        if (status === "Cancelled") {
            return "bg-red-50 text-red-600";
        }

        return "bg-indigo-50 text-indigo-600";
    };

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

            {/* Summary */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Upcoming */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Upcoming
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {upcomingInterviews.length}
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
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {completedInterviews.length}
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
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Cancelled
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {cancelledInterviews.length}
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

            {/* Toolbar */}
            <section className="mt-7">
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            All Interviews
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredInterviews.length} interviews found
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {/* Search */}
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search interviews..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400"
                        >
                            <option value="ALL">All Status</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400"
                        >
                            <option value="recent">Recent</option>
                            <option value="company">Company</option>
                            <option value="position">Position</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Upcoming Interviews */}
            {filteredInterviews.filter(
                (interview) => interview.status === "Upcoming"
            ).length > 0 && (
                <section>
                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-900">
                            Upcoming Interviews
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            Your scheduled interviews and meeting details.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {filteredInterviews
                            .filter(
                                (interview) =>
                                    interview.status === "Upcoming"
                            )
                            .map((interview) => (
                                <div
                                    key={interview.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Information */}
                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <CalendarDays size={22} />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h4 className="font-semibold text-slate-900">
                                                        {
                                                            interview.position
                                                        }
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
                                        <div className="flex flex-col gap-3 lg:min-w-52">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openJoinModal(interview)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                            >
                                                Join Interview
                                                <ExternalLink size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedInterview(
                                                        interview
                                                    )
                                                }
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
            )}

            {/* History */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h3 className="font-semibold text-slate-900">
                        Interview History
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Review your previous interviews.
                    </p>
                </div>

                {filteredInterviews.filter(
                    (interview) => interview.status !== "Upcoming"
                ).length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredInterviews
                            .filter(
                                (interview) =>
                                    interview.status !== "Upcoming"
                            )
                            .map((interview) => (
                                <div
                                    key={interview.id}
                                    className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                interview.status ===
                                                "Completed"
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {interview.status ===
                                            "Completed" ? (
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
                                                <span>
                                                    {interview.date}
                                                </span>

                                                <span>
                                                    {interview.time}
                                                </span>

                                                <span>
                                                    Interviewer:{" "}
                                                    {
                                                        interview.interviewer
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                                interview.status
                                            )}`}
                                        >
                                            {interview.status}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedInterview(
                                                    interview
                                                )
                                            }
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <CalendarDays size={24} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No interviews found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filter.
                        </p>
                    </div>
                )}
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
                        onClick={() =>
                            alert("Navigate to Jobs page")
                        }
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        View Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* Interview Details Modal */}
            {selectedInterview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedInterview(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {selectedInterview.position}
                                    </h2>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                            selectedInterview.status
                                        )}`}
                                    >
                                        {selectedInterview.status}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    {selectedInterview.company}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedInterview(null)
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <CalendarDays size={15} />
                                        Date
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedInterview.date}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Clock3 size={15} />
                                        Time
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedInterview.time}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Video size={15} />
                                        Platform
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedInterview.mode}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <MapPin size={15} />
                                        Location
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedInterview.location}
                                    </p>
                                </div>
                            </div>

                            {/* Interviewer */}
                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Interviewer
                                </h3>

                                <div className="mt-3 rounded-2xl border border-slate-100 p-4">
                                    <p className="font-semibold text-slate-800">
                                        {selectedInterview.interviewer}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {selectedInterview.email}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Interview Notes
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {selectedInterview.notes}
                                </p>
                            </div>

                            {/* Meeting */}
                            {selectedInterview.status === "Upcoming" && (
                                <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600">
                                            <Video size={19} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Online Interview
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {selectedInterview.mode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                {selectedInterview.status === "Upcoming" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openJoinModal(
                                                    selectedInterview
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            Join Interview
                                            <ExternalLink size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                cancelInterview(
                                                    selectedInterview.id
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                        >
                                            <XCircle size={17} />
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {selectedInterview.status ===
                                    "Completed" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedInterview(null)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                                    >
                                        <CheckCircle2 size={17} />
                                        Interview Completed
                                    </button>
                                )}

                                {selectedInterview.status ===
                                    "Cancelled" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedInterview(null)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                                    >
                                        <XCircle size={17} />
                                        Interview Cancelled
                                    </button>
                                )}
                            </div>

                            {/* Demo completion action */}
                            {selectedInterview.status === "Upcoming" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        completeInterview(
                                            selectedInterview.id
                                        )
                                    }
                                    className="mt-3 w-full rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Join Interview Modal */}
            {showJoinModal && meetingInterview && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={() => setShowJoinModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Video size={22} />
                                </div>

                                <h2 className="mt-4 text-xl font-bold text-slate-900">
                                    Join Interview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {meetingInterview.position} at{" "}
                                    {meetingInterview.company}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowJoinModal(false)
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <CalendarDays size={16} />
                                {meetingInterview.date}
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                <Clock3 size={16} />
                                {meetingInterview.time}
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Meeting Link
                            </label>

                            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                                <input
                                    value={
                                        meetingInterview.meetingLink
                                    }
                                    readOnly
                                    className="min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-600 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={copyMeetingLink}
                                    className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={14} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                window.open(
                                    meetingInterview.meetingLink,
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                            }}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Open Meeting
                            <ExternalLink size={17} />
                        </button>

                        <p className="mt-4 text-center text-xs text-slate-400">
                            This is a frontend demo. The meeting link is
                            currently static.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interviews;
