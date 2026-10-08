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

import {
    getRecruiterApplications,
} from "../../services/applicationService";

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
    notes: "",
};

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [scheduleModalOpen, setScheduleModalOpen] =
        useState(false);

    const [viewModalOpen, setViewModalOpen] =
        useState(false);

    const [selectedInterview, setSelectedInterview] =
        useState(null);

    const [form, setForm] = useState(emptyForm);

    const [editingInterviewId, setEditingInterviewId] =
        useState(null);

    const [formError, setFormError] = useState("");

    const [saving, setSaving] = useState(false);
    const [actionLoadingId, setActionLoadingId] =
        useState(null);

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const getErrorMessage = (requestError, fallback) => {
        return (
            requestError?.response?.data?.message ||
            requestError?.response?.data?.errors?.message ||
            fallback
        );
    };

    const loadInterviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRecruiterInterviews();

            setInterviews(Array.isArray(data) ? data : []);
        } catch (loadError) {
            setError(
                getErrorMessage(
                    loadError,
                    "Unable to load interviews."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const loadApplications = async () => {
        try {
            setApplicationsLoading(true);

            const data =
                await getRecruiterApplications();

            setApplications(
                Array.isArray(data) ? data : []
            );
        } catch (loadError) {
            setError(
                getErrorMessage(
                    loadError,
                    "Unable to load applications."
                )
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const getInitials = (name = "Candidate") => {
        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return "Not scheduled";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatDateTime = (date) => {
        if (!date) return "Not scheduled";

        return `${formatDate(date)} at ${formatTime(date)}`;
    };

    const getDateTimeInputValue = (date) => {
        if (!date) return "";

        const value = new Date(date);

        const year = value.getFullYear();
        const month = String(
            value.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            value.getDate()
        ).padStart(2, "0");
        const hours = String(
            value.getHours()
        ).padStart(2, "0");
        const minutes = String(
            value.getMinutes()
        ).padStart(2, "0");

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
        if (type === "ONLINE") {
            return <Video size={15} />;
        }

        if (type === "PHONE") {
            return <Phone size={15} />;
        }

        return <MapPin size={15} />;
    };

    const getCandidateFromInterview = (interview) => {
        return (
            interview?.application?.candidate ||
            interview?.application?.Candidate ||
            null
        );
    };

    const getCandidateName = (interview) => {
        const candidate =
            getCandidateFromInterview(interview);

        return (
            candidate?.user?.name ||
            candidate?.User?.name ||
            candidate?.name ||
            "Candidate"
        );
    };

    const getCandidateEmail = (interview) => {
        const candidate =
            getCandidateFromInterview(interview);

        return (
            candidate?.user?.email ||
            candidate?.User?.email ||
            candidate?.email ||
            ""
        );
    };

    const getJobTitle = (interview) => {
        return (
            interview?.application?.job?.title ||
            interview?.application?.Job?.title ||
            "Job Position"
        );
    };

    const filteredInterviews = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return interviews.filter((interview) => {
            const candidateName =
                getCandidateName(interview).toLowerCase();

            const candidateEmail =
                getCandidateEmail(interview).toLowerCase();

            const jobTitle =
                getJobTitle(interview).toLowerCase();

            const interviewType =
                getTypeLabel(
                    interview.interviewType
                ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                candidateName.includes(searchValue) ||
                candidateEmail.includes(searchValue) ||
                jobTitle.includes(searchValue) ||
                interviewType.includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                interview.status === statusFilter;

            const matchesType =
                typeFilter === "All" ||
                interview.interviewType === typeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );
        });
    }, [
        interviews,
        search,
        statusFilter,
        typeFilter,
    ]);

    const statistics = useMemo(() => {
        return {
            total: interviews.length,

            scheduled: interviews.filter(
                (interview) =>
                    interview.status === "SCHEDULED"
            ).length,

            completed: interviews.filter(
                (interview) =>
                    interview.status === "COMPLETED"
            ).length,

            cancelled: interviews.filter(
                (interview) =>
                    interview.status === "CANCELLED"
            ).length,
        };
    }, [interviews]);

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
            applicationId:
                interview.applicationId?.toString() || "",
            scheduledAt:
                getDateTimeInputValue(
                    interview.scheduledAt
                ),
            interviewType:
                interview.interviewType || "ONLINE",
            meetingLink:
                interview.meetingLink || "",
            location:
                interview.location || "",
            notes:
                interview.notes || "",
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
        const {
            name,
            value,
        } = event.target;

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
                type === "ONLINE"
                    ? previous.meetingLink
                    : "",
            location:
                type === "OFFLINE"
                    ? previous.location
                    : "",
        }));

        setFormError("");
    };

    const validateForm = () => {
        if (
            !editingInterviewId &&
            !form.applicationId
        ) {
            return "Please select an application.";
        }

        if (!form.scheduledAt) {
            return "Please select the interview date and time.";
        }

        const selectedDate =
            new Date(form.scheduledAt);

        if (
            Number.isNaN(
                selectedDate.getTime()
            )
        ) {
            return "Please enter a valid interview date and time.";
        }

        if (
            selectedDate.getTime() <=
            Date.now()
        ) {
            return "Interview date and time must be in the future.";
        }

        if (!form.interviewType) {
            return "Please select an interview type.";
        }

        if (
            form.interviewType === "ONLINE" &&
            !form.meetingLink.trim()
        ) {
            return "Meeting link is required for an online interview.";
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

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        const payload = {
            scheduledAt: form.scheduledAt,
            interviewType: form.interviewType,
            notes: form.notes.trim(),
        };

        if (form.interviewType === "ONLINE") {
            payload.meetingLink =
                form.meetingLink.trim();
        }

        if (form.interviewType === "OFFLINE") {
            payload.location =
                form.location.trim();
        }

        try {
            setSaving(true);

            if (editingInterviewId) {
                await updateInterview(
                    editingInterviewId,
                    payload
                );

                setSuccess(
                    "Interview rescheduled successfully."
                );
            } else {
                await scheduleInterview(
                    Number(form.applicationId),
                    payload
                );

                setSuccess(
                    "Interview scheduled successfully."
                );
            }

            closeScheduleModal();
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

    const handleCancelInterview = async (
        interview
    ) => {
        const candidateName =
            getCandidateName(interview);

        const confirmed = window.confirm(
            `Are you sure you want to cancel the interview with ${candidateName}?`
        );

        if (!confirmed) return;

        try {
            clearMessages();

            setActionLoadingId(interview.id);

            await cancelInterview(interview.id);

            setSuccess(
                "Interview cancelled successfully."
            );

            await loadInterviews();

            if (
                selectedInterview?.id ===
                interview.id
            ) {
                setSelectedInterview(
                    null
                );
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

    const handleStatusUpdate = async (
        interview,
        status
    ) => {
        try {
            clearMessages();

            setActionLoadingId(interview.id);

            await updateInterviewStatus(
                interview.id,
                status
            );

            setSuccess(
                `Interview marked as ${getStatusLabel(
                    status
                ).toLowerCase()}.`
            );

            await loadInterviews();

            if (
                selectedInterview?.id ===
                interview.id
            ) {
                try {
                    const updated =
                        await getInterview(
                            interview.id
                        );

                    setSelectedInterview(
                        updated
                    );
                } catch {
                    setSelectedInterview(
                        interview
                    );
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

            setSelectedInterview(
                interview
            );
            setViewModalOpen(true);

            const detailedInterview =
                await getInterview(
                    interview.id
                );

            setSelectedInterview(
                detailedInterview
            );
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
    };

    const eligibleApplications = useMemo(() => {
        return applications.filter(
            (application) =>
                application.status ===
                    "SHORTLISTED" ||
                application.status ===
                    "INTERVIEW"
        );
    }, [applications]);

    return (
        <div>
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
                        Schedule and manage candidate interviews
                        for your open positions.
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
                <section className="mt-5">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <CalendarDays size={17} />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Total Interviews
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-slate-800">
                                {statistics.total}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Clock3 size={17} />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Scheduled
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-slate-800">
                                {statistics.scheduled}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={17} />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Completed
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-slate-800">
                                {statistics.completed}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <XCircle size={17} />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Cancelled
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-slate-800">
                                {statistics.cancelled}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FILTERS */}

            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search candidates, jobs or interview type..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="SCHEDULED">
                                Scheduled
                            </option>

                            <option value="RESCHEDULED">
                                Rescheduled
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(
                                    event.target.value
                                )
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">
                                All Interview Types
                            </option>

                            <option value="ONLINE">
                                Online
                            </option>

                            <option value="OFFLINE">
                                In-person
                            </option>

                            <option value="PHONE">
                                Phone
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* RESULTS */}

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
                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        {filteredInterviews.map(
                            (interview) => {
                                const candidateName =
                                    getCandidateName(
                                        interview
                                    );

                                const candidateEmail =
                                    getCandidateEmail(
                                        interview
                                    );

                                const jobTitle =
                                    getJobTitle(
                                        interview
                                    );

                                const isActionLoading =
                                    actionLoadingId ===
                                    interview.id;

                                return (
                                    <div
                                        key={
                                            interview.id
                                        }
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                                    >
                                        {/* HEADER */}

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                    {getInitials(
                                                        candidateName
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate font-semibold text-slate-900">
                                                        {
                                                            candidateName
                                                        }
                                                    </h3>

                                                    <p className="mt-1 truncate text-sm text-indigo-600">
                                                        {
                                                            jobTitle
                                                        }
                                                    </p>

                                                    {candidateEmail && (
                                                        <p className="mt-1 truncate text-xs text-slate-400">
                                                            {
                                                                candidateEmail
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                    interview.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    interview.status
                                                )}
                                            </span>
                                        </div>

                                        {/* DETAILS */}

                                        <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    <CalendarDays
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </div>

                                                <div>
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

                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    <Clock3
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </div>

                                                <div>
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

                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                    {getInterviewTypeIcon(
                                                        interview.interviewType
                                                    )}
                                                </div>

                                                <div>
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

                                            {interview.interviewType ===
                                                "ONLINE" &&
                                                interview.meetingLink && (
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                            <Video
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-[11px] text-slate-400">
                                                                Meeting Link
                                                            </p>

                                                            <a
                                                                href={
                                                                    interview.meetingLink
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-0.5 block truncate text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                                            >
                                                                Join Meeting
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                            {interview.interviewType ===
                                                "OFFLINE" &&
                                                interview.location && (
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                            <MapPin
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-[11px] text-slate-400">
                                                                Location
                                                            </p>

                                                            <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                                                                {
                                                                    interview.location
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                            {interview.interviewType ===
                                                "PHONE" && (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                            <Phone
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="text-[11px] text-slate-400">
                                                                Interview
                                                            </p>

                                                            <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                                Phone Call
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        {/* NOTES */}

                                        {interview.notes && (
                                            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                                                <div className="flex items-start gap-2">
                                                    <FileText
                                                        size={
                                                            15
                                                        }
                                                        className="mt-0.5 shrink-0 text-slate-400"
                                                    />

                                                    <p className="text-xs leading-5 text-slate-500">
                                                        {
                                                            interview.notes
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* ACTIONS */}

                                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openInterview(
                                                        interview
                                                    )
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Eye
                                                    size={
                                                        14
                                                    }
                                                />
                                                View Interview
                                            </button>

                                            {(interview.status ===
                                                "SCHEDULED" ||
                                                interview.status ===
                                                    "RESCHEDULED") && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openRescheduleModal(
                                                            interview
                                                        )
                                                    }
                                                    disabled={
                                                        isActionLoading
                                                    }
                                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <CalendarDays
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    Reschedule
                                                </button>
                                            )}

                                            {interview.status ===
                                                "SCHEDULED" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            interview,
                                                            "COMPLETED"
                                                        )
                                                    }
                                                    disabled={
                                                        isActionLoading
                                                    }
                                                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <CheckCircle2
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    {isActionLoading
                                                        ? "Updating..."
                                                        : "Mark Completed"}
                                                </button>
                                            )}

                                            {(interview.status ===
                                                "SCHEDULED" ||
                                                interview.status ===
                                                    "RESCHEDULED") && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelInterview(
                                                            interview
                                                        )
                                                    }
                                                    disabled={
                                                        isActionLoading
                                                    }
                                                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <XCircle
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    {isActionLoading
                                                        ? "Cancelling..."
                                                        : "Cancel"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <CalendarDays size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No interviews found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            There are no interviews matching
                            your search or selected filters.
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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={closeScheduleModal}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* HEADER */}

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
                                onClick={
                                    closeScheduleModal
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >
                            {/* FORM ERROR */}

                            {formError && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {formError}
                                </div>
                            )}

                            {/* APPLICATION */}

                            {!editingInterviewId && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Candidate / Application
                                        <span className="text-red-500">
                                            {" "}
                                            *
                                        </span>
                                    </label>

                                    <div className="relative mt-2">
                                        <select
                                            name="applicationId"
                                            value={
                                                form.applicationId
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            disabled={
                                                applicationsLoading
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <option value="">
                                                {applicationsLoading
                                                    ? "Loading applications..."
                                                    : "Select candidate / application"}
                                            </option>

                                            {eligibleApplications.map(
                                                (
                                                    application
                                                ) => {
                                                    const candidate =
                                                        application.candidate;

                                                    const candidateName =
                                                        candidate?.user
                                                            ?.name ||
                                                        candidate?.name ||
                                                        "Candidate";

                                                    const jobTitle =
                                                        application.job
                                                            ?.title ||
                                                        "Job Position";

                                                    return (
                                                        <option
                                                            key={
                                                                application.id
                                                            }
                                                            value={
                                                                application.id
                                                            }
                                                        >
                                                            {
                                                                candidateName
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                jobTitle
                                                            }{" "}
                                                            (
                                                            {
                                                                application.status
                                                            }
                                                            )
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

                                    {eligibleApplications.length ===
                                        0 &&
                                        !applicationsLoading && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                Only shortlisted or
                                                already-interviewed
                                                applications can be
                                                scheduled.
                                            </p>
                                        )}
                                </div>
                            )}

                            {/* RESCHEDULED APPLICATION INFO */}

                            {editingInterviewId &&
                                selectedInterview && (
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                                <BriefcaseBusiness
                                                    size={
                                                        18
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Candidate
                                                </p>

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {getCandidateName(
                                                        selectedInterview
                                                    )}
                                                </p>

                                                <p className="mt-0.5 text-xs text-indigo-600">
                                                    {getJobTitle(
                                                        selectedInterview
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* DATE + TIME */}

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Interview Date & Time
                                        <span className="text-red-500">
                                            {" "}
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="scheduledAt"
                                        value={
                                            form.scheduledAt
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                {/* TYPE */}

                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Interview Type
                                        <span className="text-red-500">
                                            {" "}
                                            *
                                        </span>
                                    </label>

                                    <div className="relative mt-2">
                                        <select
                                            name="interviewType"
                                            value={
                                                form.interviewType
                                            }
                                            onChange={
                                                handleInterviewTypeChange
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="ONLINE">
                                                Online
                                            </option>

                                            <option value="OFFLINE">
                                                In-person
                                            </option>

                                            <option value="PHONE">
                                                Phone
                                            </option>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ONLINE FIELD */}

                            {form.interviewType ===
                                "ONLINE" && (
                                <div className="mt-5">
                                    <label className="text-xs font-semibold text-slate-700">
                                        Meeting Link
                                        <span className="text-red-500">
                                            {" "}
                                            *
                                        </span>
                                    </label>

                                    <div className="relative mt-2">
                                        <Video
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="url"
                                            name="meetingLink"
                                            value={
                                                form.meetingLink
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="https://meet.google.com/..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Add the meeting URL that the
                                        candidate will use to join the
                                        interview.
                                    </p>
                                </div>
                            )}

                            {/* OFFLINE FIELD */}

                            {form.interviewType ===
                                "OFFLINE" && (
                                <div className="mt-5">
                                    <label className="text-xs font-semibold text-slate-700">
                                        Office Location / Address
                                        <span className="text-red-500">
                                            {" "}
                                            *
                                        </span>
                                    </label>

                                    <div className="relative mt-2">
                                        <MapPin
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                form.location
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Office address or interview location"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Provide the complete office
                                        address or location where the
                                        candidate should arrive.
                                    </p>
                                </div>
                            )}

                            {/* PHONE INFO */}

                            {form.interviewType ===
                                "PHONE" && (
                                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                                        <Phone size={17} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Phone Interview
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-400">
                                            No meeting link or physical
                                            location is required for a
                                            phone interview.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* NOTES */}

                            <div className="mt-5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        form.notes
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    rows="4"
                                    placeholder="Add interview instructions, topics or notes..."
                                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            {/* ACTIONS */}

                            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                                <button
                                    type="button"
                                    onClick={
                                        closeScheduleModal
                                    }
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        (!editingInterviewId &&
                                            eligibleApplications.length ===
                                                0)
                                    }
                                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            {viewModalOpen &&
                selectedInterview && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                        onClick={
                            closeViewModal
                        }
                    >
                        <div
                            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            {/* HEADER */}

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
                                    onClick={
                                        closeViewModal
                                    }
                                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* CANDIDATE */}

                                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                        {getInitials(
                                            getCandidateName(
                                                selectedInterview
                                            )
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900">
                                            {getCandidateName(
                                                selectedInterview
                                            )}
                                        </h3>

                                        <p className="mt-1 text-xs text-indigo-600">
                                            {getJobTitle(
                                                selectedInterview
                                            )}
                                        </p>

                                        {getCandidateEmail(
                                            selectedInterview
                                        ) && (
                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {getCandidateEmail(
                                                    selectedInterview
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* STATUS */}

                                <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                                    <div>
                                        <p className="text-[11px] text-slate-400">
                                            Status
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {getStatusLabel(
                                                selectedInterview.status
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                            selectedInterview.status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            selectedInterview.status
                                        )}
                                    </span>
                                </div>

                                {/* INTERVIEW DETAILS */}

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                                <CalendarDays
                                                    size={
                                                        17
                                                    }
                                                />
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

                                {/* ONLINE DETAILS */}

                                {selectedInterview.interviewType ===
                                    "ONLINE" &&
                                    selectedInterview.meetingLink && (
                                        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                                    <Video
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-slate-400">
                                                        Meeting Link
                                                    </p>

                                                    <a
                                                        href={
                                                            selectedInterview.meetingLink
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 block break-all text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                    >
                                                        {
                                                            selectedInterview.meetingLink
                                                        }
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* OFFLINE DETAILS */}

                                {selectedInterview.interviewType ===
                                    "OFFLINE" &&
                                    selectedInterview.location && (
                                        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                                    <MapPin
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[11px] text-slate-400">
                                                        Interview Location
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                                                        {
                                                            selectedInterview.location
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* PHONE DETAILS */}

                                {selectedInterview.interviewType ===
                                    "PHONE" && (
                                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                                <Phone
                                                    size={
                                                        17
                                                    }
                                                />
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

                                {/* NOTES */}

                                {selectedInterview.notes && (
                                    <div className="mt-5">
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Notes
                                        </h4>

                                        <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                                            {
                                                selectedInterview.notes
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* ACTIONS */}

                                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                                    {(selectedInterview.status ===
                                        "SCHEDULED" ||
                                        selectedInterview.status ===
                                            "RESCHEDULED") && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeViewModal();
                                                    openRescheduleModal(
                                                        selectedInterview
                                                    );
                                                }}
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <CalendarDays
                                                    size={
                                                        14
                                                    }
                                                />
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
                                                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <CheckCircle2
                                                    size={
                                                        14
                                                    }
                                                />
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
                                                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <XCircle
                                                    size={
                                                        14
                                                    }
                                                />
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
