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
    X,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getRecruiterApplications } from "../../services/applicationService";

import Pagination, { usePagination } from "../../components/Pagination.jsx";
import {
    cancelInterview,
    getInterview,
    getRecruiterInterviews,
    scheduleInterview,
    updateInterview,
    updateInterviewStatus,
} from "../../services/interviewService";

const emptyForm = {
    applicationId: "",
    scheduledAt: "",
    interviewType: "ONLINE",
    meetingLink: "",
    location: "",
};

const getCandidateAssetUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;

    const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
        .replace(/\/api\/?$/, "");
    return `${apiUrl}/${String(path).replace(/^[\\/]+/, "").replaceAll("\\", "/")}`;
};

const normalizeCandidateLink = (url) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [selectedInterview, setSelectedInterview] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editingInterviewId, setEditingInterviewId] = useState(null);
    const [formError, setFormError] = useState("");

    const [saving, setSaving] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const getErrorMessage = (requestError, fallback) =>
        requestError?.response?.data?.message ||
        requestError?.response?.data?.errors?.message ||
        fallback;

    const loadInterviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRecruiterInterviews();
            setInterviews(Array.isArray(data) ? data : []);
        } catch (loadError) {
            setError(
                getErrorMessage(loadError, "Unable to load interviews.")
            );
        } finally {
            setLoading(false);
        }
    };

    const loadApplications = async () => {
        try {
            setApplicationsLoading(true);

            const data = await getRecruiterApplications();
            setApplications(Array.isArray(data) ? data : []);
        } catch (loadError) {
            setError(
                getErrorMessage(loadError, "Unable to load applications.")
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const getInitials = (name = "Candidate") =>
        String(name)
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    const formatDate = (date) => {
        if (!date) return "Not scheduled";

        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return "";

        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateTime = (date) =>
        date ? `${formatDate(date)} at ${formatTime(date)}` : "Not scheduled";

    const getDateTimeInputValue = (date) => {
        if (!date) return "";

        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return "";

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        const hours = String(value.getHours()).padStart(2, "0");
        const minutes = String(value.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "ONLINE":
                return "Online";
            case "OFFLINE":
                return "In-person";
            case "PHONE":
                return "Phone";
            default:
                return type || "Interview";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "SCHEDULED":
                return "Scheduled";
            case "COMPLETED":
                return "Completed";
            case "CANCELLED":
                return "Cancelled";
            case "RESCHEDULED":
                return "Rescheduled";
            default:
                return status || "Unknown";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-indigo-50 text-indigo-600";
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-600";
            case "CANCELLED":
                return "bg-red-50 text-red-600";
            case "RESCHEDULED":
                return "bg-amber-50 text-amber-600";
            default:
                return "bg-slate-50 text-slate-500";
        }
    };

    const getInterviewTypeIcon = (type) => {
        if (type === "ONLINE") return <Video size={15} />;
        if (type === "PHONE") return <Phone size={15} />;
        return <MapPin size={15} />;
    };

    const getCandidateFromInterview = (interview) =>
        interview?.application?.candidate ||
        interview?.application?.Candidate ||
        null;

    const getCandidateProfileLabel = (interview) => {
        const profile = getCandidateFromInterview(interview);
        const details = [];
        if (profile?.location) details.push(profile.location);
        if (profile?.experienceYears !== undefined && profile?.experienceYears !== null) {
            details.push(`${profile.experienceYears} years experience`);
        }
        return details.join(" · ");
    };

    const getCandidateName = (interview) => {
        const candidate = getCandidateFromInterview(interview);

        return (
            candidate?.user?.name ||
            candidate?.User?.name ||
            candidate?.name ||
            "Candidate"
        );
    };

    const getCandidateEmail = (interview) => {
        const candidate = getCandidateFromInterview(interview);

        return (
            candidate?.user?.email ||
            candidate?.User?.email ||
            candidate?.email ||
            ""
        );
    };

    const getCandidatePhone = (interview) => {
        const candidate = getCandidateFromInterview(interview);

        return (
            candidate?.user?.phone ||
            candidate?.User?.phone ||
            candidate?.phone ||
            ""
        );
    };

    const getJobTitle = (interview) =>
        interview?.application?.job?.title ||
        interview?.application?.Job?.title ||
        "Job Position";

    const getJobCategory = (interview) =>
        interview?.application?.job?.category?.name ||
        interview?.application?.job?.Category?.name ||
        interview?.application?.job?.categoryName ||
        interview?.application?.Job?.category?.name ||
        interview?.application?.Job?.Category?.name ||
        interview?.application?.Job?.categoryName ||
        "Uncategorized";

    const categoryOptions = useMemo(
        () => [...new Set(interviews.map(getJobCategory))].sort(),
        [interviews]
    );

    const filteredInterviews = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return interviews.filter((interview) => {
            const candidateName = getCandidateName(interview).toLowerCase();
            const candidateEmail = getCandidateEmail(interview).toLowerCase();
            const jobTitle = getJobTitle(interview).toLowerCase();
            const interviewType = getTypeLabel(
                interview.interviewType
            ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                candidateName.includes(searchValue) ||
                candidateEmail.includes(searchValue) ||
                jobTitle.includes(searchValue) ||
                interviewType.includes(searchValue);

            const matchesStatus =
                statusFilter === "All" || interview.status === statusFilter;

            const matchesType =
                typeFilter === "All" ||
                interview.interviewType === typeFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                getJobCategory(interview) === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType &&
                matchesCategory
            );
        });
    }, [interviews, search, statusFilter, typeFilter, categoryFilter]);
    const paginationResetKey = JSON.stringify([search, statusFilter, typeFilter, categoryFilter]);
    const { pageItems: pageInterviews, currentPage, setCurrentPage, pageCount } =
        usePagination(filteredInterviews, paginationResetKey);

    const statistics = useMemo(
        () => ({
            total: interviews.length,
            scheduled: interviews.filter(
                (item) => item.status === "SCHEDULED"
            ).length,
            completed: interviews.filter(
                (item) => item.status === "COMPLETED"
            ).length,
            cancelled: interviews.filter(
                (item) => item.status === "CANCELLED"
            ).length,
        }),
        [interviews]
    );

    const eligibleApplications = useMemo(
        () => {
            // An application can be interviewed only once after it reaches
            // the interview stage. Key by application (candidate + job), so
            // the same candidate remains eligible for a different job.
            const alreadyInterviewedApplicationIds = new Set(
                interviews
                    .filter((interview) =>
                        ["SCHEDULED", "RESCHEDULED", "COMPLETED"].includes(interview.status)
                    )
                    .map((interview) => Number(interview.applicationId))
            );
            return applications.filter(
                (application) =>
                    application.status === "SHORTLISTED" ||
                    application.status === "INTERVIEW"
            ).filter((application) =>
                !alreadyInterviewedApplicationIds.has(Number(application.id))
            );
        },
        [applications, interviews]
    );

    const openScheduleModal = async () => {
        clearMessages();
        setFormError("");
        setEditingInterviewId(null);
        setForm(emptyForm);
        setSelectedInterview(null);
        setScheduleModalOpen(true);

        if (applications.length === 0) {
            await loadApplications();
        }
    };

    const openRescheduleModal = (interview) => {
        clearMessages();
        setFormError("");
        setEditingInterviewId(interview.id);

        setForm({
            applicationId: interview.applicationId?.toString() || "",
            scheduledAt: getDateTimeInputValue(interview.scheduledAt),
            interviewType: interview.interviewType || "ONLINE",
            meetingLink: interview.meetingLink || "",
            location: interview.location || "",
        });

        setSelectedInterview(interview);
        setScheduleModalOpen(true);
    };

    const closeScheduleModal = () => {
        if (saving) return;

        setScheduleModalOpen(false);
        setEditingInterviewId(null);
        setForm(emptyForm);
        setFormError("");
    };

    const closeViewModal = () => {
        setViewModalOpen(false);
        setSelectedInterview(null);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
        setError("");
    };

    const handleInterviewTypeChange = (event) => {
        const type = event.target.value;

        setForm((previous) => ({
            ...previous,
            interviewType: type,
            meetingLink:
                type === "ONLINE" ? previous.meetingLink : "",
            location: type === "OFFLINE" ? previous.location : "",
        }));

        setFormError("");
    };

    const validateForm = () => {
        if (!editingInterviewId && !form.applicationId) {
            return "Please select an application.";
        }

        if (!form.scheduledAt) {
            return "Please select the interview date and time.";
        }

        const selectedDate = new Date(form.scheduledAt);

        if (Number.isNaN(selectedDate.getTime())) {
            return "Please enter a valid interview date and time.";
        }

        if (selectedDate.getTime() <= Date.now()) {
            return "Interview date and time must be in the future.";
        }

        if (!form.interviewType) {
            return "Please select an interview type.";
        }

        if (
            form.interviewType === "OFFLINE" &&
            !form.location.trim()
        ) {
            return "Office location or address is required for an in-person interview.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearMessages();

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        const payload = {
            scheduledAt: form.scheduledAt,
            interviewType: form.interviewType,
        };

        if (form.interviewType === "OFFLINE") {
            payload.location = form.location.trim();
        }

        try {
            setSaving(true);

            if (editingInterviewId) {
                await updateInterview(editingInterviewId, payload);
                setSuccess("Interview rescheduled successfully.");
            } else {
                await scheduleInterview(Number(form.applicationId), payload);
                setSuccess("Interview scheduled successfully.");
            }

            setScheduleModalOpen(false);
            setEditingInterviewId(null);
            setForm(emptyForm);

            await loadInterviews();
        } catch (saveError) {
            setFormError(
                getErrorMessage(
                    saveError,
                    editingInterviewId
                        ? "Unable to reschedule interview."
                        : "Unable to schedule interview."
                )
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancelInterview = async (interview) => {
        const candidateName = getCandidateName(interview);

        const confirmed = window.confirm(
            `Are you sure you want to cancel the interview with ${candidateName}?`
        );

        if (!confirmed) return;

        try {
            clearMessages();
            setActionLoadingId(interview.id);

            await cancelInterview(interview.id);
            setSuccess("Interview cancelled successfully.");

            await loadInterviews();

            if (selectedInterview?.id === interview.id) {
                setSelectedInterview(null);
                setViewModalOpen(false);
            }
        } catch (cancelError) {
            setError(
                getErrorMessage(
                    cancelError,
                    "Unable to cancel interview."
                )
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleStatusUpdate = async (interview, status) => {
        try {
            clearMessages();
            setActionLoadingId(interview.id);

            await updateInterviewStatus(interview.id, status);

            setSuccess(
                `Interview marked as ${getStatusLabel(status).toLowerCase()}.`
            );

            await loadInterviews();

            if (selectedInterview?.id === interview.id) {
                try {
                    const updated = await getInterview(interview.id);
                    setSelectedInterview(updated);
                } catch {
                    setSelectedInterview({
                        ...interview,
                        status,
                    });
                }
            }
        } catch (statusError) {
            setError(
                getErrorMessage(
                    statusError,
                    "Unable to update interview status."
                )
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    const openInterview = async (interview) => {
        try {
            clearMessages();
            setSelectedInterview(interview);
            setViewModalOpen(true);

            const detailedInterview = await getInterview(interview.id);
            setSelectedInterview(detailedInterview);
        } catch (viewError) {
            setError(
                getErrorMessage(
                    viewError,
                    "Unable to load interview details."
                )
            );
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setTypeFilter("All");
        setCategoryFilter("All");
    };

    const selectedCandidateProfile = selectedInterview
        ? getCandidateFromInterview(selectedInterview)
        : null;

    return (
        <div className="min-w-0">
            {/* PAGE HEADER */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Interviews
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Schedule and manage candidate interviews for your open positions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openScheduleModal}
                    className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                    <CalendarDays size={17} />
                    Schedule Interview
                </button>
            </section>

            {/* MESSAGES */}
            {(success || error) && (
                <section className="mt-5 space-y-2">
                    {success && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </section>
            )}

            {/* STATISTICS */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Interviews",
                        value: statistics.total,
                        icon: <CalendarDays size={17} />,
                        iconClass: "bg-indigo-50 text-indigo-600",
                    },
                    {
                        label: "Scheduled",
                        value: statistics.scheduled,
                        icon: <Clock3 size={17} />,
                        iconClass: "bg-indigo-50 text-indigo-600",
                    },
                    {
                        label: "Completed",
                        value: statistics.completed,
                        icon: <CheckCircle2 size={17} />,
                        iconClass: "bg-emerald-50 text-emerald-600",
                    },
                    {
                        label: "Cancelled",
                        value: statistics.cancelled,
                        icon: <XCircle size={17} />,
                        iconClass: "bg-red-50 text-red-600",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconClass}`}
                            >
                                {stat.icon}
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    {stat.label}
                                </p>
                                <p className="mt-0.5 text-lg font-bold text-slate-800">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* FILTERS */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
                    <div className="relative min-w-0">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search candidates, jobs or interview type..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {[
                        {
                            value: categoryFilter,
                            onChange: setCategoryFilter,
                            allLabel: "All Categories",
                            options: categoryOptions.map((category) => ({
                                value: category,
                                label: category,
                            })),
                        },
                        {
                            value: statusFilter,
                            onChange: setStatusFilter,
                            allLabel: "All Status",
                            options: [
                                { value: "SCHEDULED", label: "Scheduled" },
                                { value: "RESCHEDULED", label: "Rescheduled" },
                                { value: "COMPLETED", label: "Completed" },
                                { value: "CANCELLED", label: "Cancelled" },
                            ],
                        },
                        {
                            value: typeFilter,
                            onChange: setTypeFilter,
                            allLabel: "All Interview Types",
                            options: [
                                { value: "ONLINE", label: "Online" },
                                { value: "OFFLINE", label: "In-person" },
                                { value: "PHONE", label: "Phone" },
                            ],
                        },
                    ].map((filter, index) => (
                        <div className="relative min-w-0" key={index}>
                            <select
                                value={filter.value}
                                onChange={(event) =>
                                    filter.onChange(event.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="All">{filter.allLabel}</option>
                                {filter.options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* INTERVIEW RESULTS */}
            <section className="mt-7">
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

                {loading ? (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                        Loading interviews...
                    </div>
                ) : filteredInterviews.length > 0 ? (
                    <>
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {pageInterviews.map((interview) => {
                                const candidateName = getCandidateName(interview);
                                const candidateEmail = getCandidateEmail(interview);
                                const candidateProfile = getCandidateFromInterview(interview);
                                const candidateProfileLabel = getCandidateProfileLabel(interview);
                                const jobTitle = getJobTitle(interview);
                                const category = getJobCategory(interview);
                                const isActionLoading =
                                    actionLoadingId === interview.id;

                                return (
                                    <article
                                        key={interview.id}
                                        className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5"
                                    >
                                        {/* CANDIDATE HEADER */}
                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                                                    {getInitials(candidateName)}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="break-words font-semibold text-slate-900">
                                                        {candidateName}
                                                    </h3>
                                                    <p className="mt-1 break-words text-sm text-indigo-600">
                                                        {jobTitle}
                                                    </p>
                                                    {category !== "Uncategorized" && (
                                                        <p className="mt-1 inline-flex rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
                                                            {category}
                                                        </p>
                                                    )}
                                                    {candidateEmail && (
                                                        <p className="mt-1 break-all text-xs text-slate-400">
                                                            {candidateEmail}
                                                        </p>
                                                    )}
                                                    {candidateProfileLabel && (
                                                        <p className="mt-1 break-words text-xs text-slate-500">
                                                            {candidateProfileLabel}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                                                    interview.status
                                                )}`}
                                            >
                                                {getStatusLabel(interview.status)}
                                            </span>
                                        </div>

                                        {/* INTERVIEW DETAILS */}
                                        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    <CalendarDays size={15} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-400">
                                                        Date
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                        {formatDate(
                                                            interview.scheduledAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    <Clock3 size={15} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-400">
                                                        Time
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                        {formatTime(
                                                            interview.scheduledAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    {getInterviewTypeIcon(
                                                        interview.interviewType
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-400">
                                                        Interview Type
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                        {getTypeLabel(
                                                            interview.interviewType
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {(interview.status === "SCHEDULED" ||
                                                interview.status === "RESCHEDULED") &&
                                                interview.interviewType === "ONLINE" &&
                                                interview.meetingLink && (
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                            <Video size={15} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] text-slate-400">
                                                                Meeting Link
                                                            </p>
                                                            <a
                                                                href={interview.meetingLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-0.5 block truncate text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                                            >
                                                                Join Meeting
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                            {interview.interviewType === "OFFLINE" &&
                                                interview.location && (
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                            <MapPin size={15} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] text-slate-400">
                                                                Location
                                                            </p>
                                                            <p className="mt-0.5 break-words text-xs font-medium text-slate-600">
                                                                {interview.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                            {interview.interviewType === "PHONE" && (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                        <Phone size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-400">
                                                            Interview Method
                                                        </p>
                                                        <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                            Phone Call
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {candidateProfile?.skills?.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {candidateProfile.skills.slice(0, 4).map((skill) => (
                                                    <span key={skill.id || skill.name} className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-600">
                                                        {skill.name || skill}
                                                    </span>
                                                ))}
                                                {candidateProfile.skills.length > 4 && (
                                                    <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
                                                        +{candidateProfile.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}


                                        {/* ACTIONS */}
                                        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openInterview(interview)
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>

                                            {(interview.status === "SCHEDULED" ||
                                                interview.status === "RESCHEDULED") && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openRescheduleModal(interview)
                                                        }
                                                        disabled={isActionLoading}
                                                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
                                                    >
                                                        <CalendarDays size={14} />
                                                        Reschedule
                                                    </button>
                                                )}

                                            {(interview.status === "SCHEDULED" ||
                                                interview.status === "RESCHEDULED") && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            interview,
                                                            "COMPLETED"
                                                        )
                                                    }
                                                    disabled={isActionLoading}
                                                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                                                >
                                                    <CheckCircle2 size={14} />
                                                    {isActionLoading
                                                        ? "Updating..."
                                                        : "Complete"}
                                                </button>
                                            )}

                                            {(interview.status === "SCHEDULED" ||
                                                interview.status === "RESCHEDULED") && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelInterview(interview)
                                                        }
                                                        disabled={isActionLoading}
                                                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <XCircle size={14} />
                                                        {isActionLoading
                                                            ? "Cancelling..."
                                                            : "Cancel"}
                                                    </button>
                                                )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        <Pagination totalItems={filteredInterviews.length} currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
                    </>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <CalendarDays size={25} />
                        </div>
                        <h3 className="mt-4 font-semibold text-slate-800">
                            No interviews found
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            There are no interviews matching your search or selected filters.
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

            {/* SCHEDULE / RESCHEDULE MODAL */}
            {scheduleModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4"
                    onClick={closeScheduleModal}
                >
                    <div
                        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                    Interview Management
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {editingInterviewId
                                        ? "Reschedule Interview"
                                        : "Schedule Interview"}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeScheduleModal}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {!editingInterviewId && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Candidate / Application
                                        <span className="text-red-500"> *</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <select
                                            name="applicationId"
                                            required
                                            value={form.applicationId}
                                            onChange={handleFormChange}
                                            disabled={applicationsLoading}
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                                        >
                                            <option value="">
                                                {applicationsLoading
                                                    ? "Loading applications..."
                                                    : "Select candidate / application"}
                                            </option>
                                            {eligibleApplications.map(
                                                (application) => {
                                                    const candidate =
                                                        application.candidate;
                                                    const candidateName =
                                                        candidate?.user?.name ||
                                                        candidate?.User?.name ||
                                                        candidate?.name ||
                                                        "Candidate";
                                                    const jobTitle =
                                                        application.job?.title ||
                                                        application.Job?.title ||
                                                        "Job Position";
                                                    const profileDetail = [
                                                        candidate?.location,
                                                        candidate?.experienceYears !== undefined && candidate?.experienceYears !== null
                                                            ? `${candidate.experienceYears}y`
                                                            : "",
                                                    ].filter(Boolean).join(", ");
                                                    const category =
                                                        application.job?.category?.name ||
                                                        application.job?.Category?.name;

                                                    return (
                                                        <option
                                                            key={application.id}
                                                            value={application.id}
                                                        >
                                                            {candidateName} - {jobTitle}{category ? ` · ${category}` : ""}{profileDetail ? ` · ${profileDetail}` : ""} (
                                                            {application.status})
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>

                                    {eligibleApplications.length === 0 &&
                                        !applicationsLoading && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                Only shortlisted applications without a scheduled or completed interview are available. Cancelled interviews can be scheduled again.
                                            </p>
                                        )}
                                </div>
                            )}

                            {editingInterviewId && selectedInterview && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                            <BriefcaseBusiness size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Candidate
                                            </p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {getCandidateName(selectedInterview)}
                                            </p>
                                            <p className="mt-0.5 text-xs text-indigo-600">
                                                {getJobTitle(selectedInterview)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Interview Date & Time
                                        <span className="text-red-500"> *</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="scheduledAt"
                                        required
                                        value={form.scheduledAt}
                                        onChange={handleFormChange}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Interview Type
                                        <span className="text-red-500"> *</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <select
                                            name="interviewType"
                                            value={form.interviewType}
                                            onChange={handleInterviewTypeChange}
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="ONLINE">Online</option>
                                            <option value="OFFLINE">In-person</option>
                                            <option value="PHONE">Phone</option>
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {form.interviewType === "ONLINE" && (
                                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                            <Video size={19} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Jitsi Meet Video Interview
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                JobBridge will automatically generate a unique
                                                video meeting link when you schedule the interview.
                                                The candidate and recruiter will use the same link.
                                            </p>

                                            {editingInterviewId && selectedInterview?.meetingLink && (
                                                <p className="mt-2 text-xs font-medium text-indigo-600">
                                                    The existing meeting link will be reused.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {form.interviewType === "OFFLINE" && (
                                <div className="mt-5">
                                    <label className="text-xs font-semibold text-slate-700">
                                        Office Location / Address
                                        <span className="text-red-500"> *</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <MapPin
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={form.location}
                                            onChange={handleFormChange}
                                            placeholder="Office address or interview location"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400">
                                        Provide the complete address where the candidate should arrive.
                                    </p>
                                </div>
                            )}

                            {form.interviewType === "PHONE" && (
                                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                                        <Phone size={17} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Phone Interview
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-400">
                                            No meeting link or physical location is required.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {formError && (
                                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </p>
                            )}

                            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                                <button
                                    type="button"
                                    onClick={closeScheduleModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        (!editingInterviewId &&
                                            (applicationsLoading ||
                                                eligibleApplications.length === 0))
                                    }
                                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {saving
                                        ? editingInterviewId
                                            ? "Rescheduling..."
                                            : "Scheduling..."
                                        : editingInterviewId
                                            ? "Reschedule Interview"
                                            : "Schedule Interview"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW INTERVIEW MODAL */}
            {viewModalOpen && selectedInterview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4"
                    onClick={closeViewModal}
                >
                    <div
                        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                    Interview Details
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Interview Information
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeViewModal}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                    {getInitials(
                                        getCandidateName(selectedInterview)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-900">
                                        {getCandidateName(selectedInterview)}
                                    </h3>
                                    <p className="mt-1 text-xs text-indigo-600">
                                        {getJobTitle(selectedInterview)}
                                    </p>
                                    {getCandidateEmail(selectedInterview) && (
                                        <p className="mt-1 break-all text-xs text-slate-400">
                                            {getCandidateEmail(selectedInterview)}
                                        </p>
                                    )}
                                    {getCandidatePhone(selectedInterview) && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            {getCandidatePhone(selectedInterview)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                                <div>
                                    <p className="text-[11px] text-slate-400">
                                        Status
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {getStatusLabel(selectedInterview.status)}
                                    </p>
                                </div>
                                <span
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                        selectedInterview.status
                                    )}`}
                                >
                                    {getStatusLabel(selectedInterview.status)}
                                </span>
                            </div>

                            {selectedCandidateProfile && (
                                <section className="mt-5 rounded-2xl border border-slate-100 p-4">
                                    <h4 className="text-sm font-semibold text-slate-900">
                                        Candidate Profile
                                    </h4>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="text-[11px] text-slate-400">Location</p>
                                            <p className="mt-1 text-sm text-slate-700">
                                                {selectedCandidateProfile.location || "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">Experience</p>
                                            <p className="mt-1 text-sm text-slate-700">
                                                {selectedCandidateProfile.experienceYears !== undefined && selectedCandidateProfile.experienceYears !== null
                                                    ? `${selectedCandidateProfile.experienceYears} years`
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedCandidateProfile.bio && (
                                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                            {selectedCandidateProfile.bio}
                                        </p>
                                    )}

                                    {selectedCandidateProfile.skills?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-[11px] font-medium text-slate-400">Skills</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedCandidateProfile.skills.map((skill) => (
                                                    <span key={skill.id || skill.name} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600">
                                                        {skill.name || skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCandidateProfile.experiences?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-[11px] font-medium text-slate-400">Work Experience</p>
                                            <div className="mt-2 space-y-2">
                                                {selectedCandidateProfile.experiences.map((experience) => (
                                                    <div key={experience.id} className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {[experience.jobTitle, experience.companyName].filter(Boolean).join(" · ") || "Position"}
                                                        </p>
                                                        {(experience.startDate || experience.endDate || experience.currentlyWorking) && (
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {experience.startDate || ""} – {experience.currentlyWorking ? "Present" : experience.endDate || ""}
                                                            </p>
                                                        )}
                                                        {experience.description && <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-500">{experience.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCandidateProfile.educations?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-[11px] font-medium text-slate-400">Education</p>
                                            <div className="mt-2 space-y-2">
                                                {selectedCandidateProfile.educations.map((education) => (
                                                    <div key={education.id} className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {[education.degree, education.fieldOfStudy].filter(Boolean).join(" · ") || "Education"}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">{education.institution || "Institution not provided"}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCandidateProfile.projects?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-[11px] font-medium text-slate-400">Projects</p>
                                            <div className="mt-2 space-y-2">
                                                {selectedCandidateProfile.projects.map((project) => (
                                                    <div key={project.id} className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-sm font-medium text-slate-700">{project.title}</p>
                                                        {project.description && <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-500">{project.description}</p>}
                                                        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                                                            <p className="mt-2 text-xs text-slate-500">{project.technologies.join(" · ")}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(selectedCandidateProfile.linkedinUrl || selectedCandidateProfile.githubUrl || selectedCandidateProfile.portfolioUrl) && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {[
                                                ["LinkedIn", selectedCandidateProfile.linkedinUrl],
                                                ["GitHub", selectedCandidateProfile.githubUrl],
                                                ["Portfolio", selectedCandidateProfile.portfolioUrl],
                                            ].filter(([, url]) => url).map(([label, url]) => (
                                                <a
                                                    key={label}
                                                    href={normalizeCandidateLink(url)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    {label}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {(selectedCandidateProfile.resume || selectedInterview.application?.resume) && (
                                        <a
                                            href={getCandidateAssetUrl(selectedCandidateProfile.resume || selectedInterview.application.resume)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <FileText size={14} />
                                            View Resume
                                        </a>
                                    )}
                                </section>
                            )}

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                            <CalendarDays size={17} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Date & Time
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {formatDateTime(
                                                    selectedInterview.scheduledAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                            {getInterviewTypeIcon(
                                                selectedInterview.interviewType
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Interview Type
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {getTypeLabel(
                                                    selectedInterview.interviewType
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedInterview.interviewType === "ONLINE" &&
                                selectedInterview.meetingLink && (
                                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                                <Video size={17} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-slate-400">
                                                    Meeting Link
                                                </p>
                                                <a
                                                    href={selectedInterview.meetingLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 block break-all text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                >
                                                    {selectedInterview.meetingLink}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {selectedInterview.interviewType === "OFFLINE" &&
                                selectedInterview.location && (
                                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                                <MapPin size={17} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Interview Location
                                                </p>
                                                <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-700">
                                                    {selectedInterview.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {selectedInterview.interviewType === "PHONE" && (
                                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                            <Phone size={17} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Interview Method
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                Phone Call
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}



                            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                                {(selectedInterview.status === "SCHEDULED" ||
                                    selectedInterview.status === "RESCHEDULED") && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const interview = selectedInterview;
                                                    closeViewModal();
                                                    openRescheduleModal(interview);
                                                }}
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <CalendarDays size={14} />
                                                Reschedule
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        selectedInterview,
                                                        "COMPLETED"
                                                    )
                                                }
                                                disabled={
                                                    actionLoadingId ===
                                                    selectedInterview.id
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                                            >
                                                <CheckCircle2 size={14} />
                                                Mark Completed
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCancelInterview(
                                                        selectedInterview
                                                    )
                                                }
                                                disabled={
                                                    actionLoadingId ===
                                                    selectedInterview.id
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <XCircle size={14} />
                                                Cancel Interview
                                            </button>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;
