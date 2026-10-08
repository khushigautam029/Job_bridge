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
    Plus,
    RefreshCw,
    Search,
    Video,
    X,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
    cancelInterview,
    getInterview,
    getRecruiterInterviews,
    scheduleInterview,
    updateInterview,
    updateInterviewStatus,
} from "../../services/interviewService";

import { getRecruiterApplications } from "../../services/applicationService";

const INITIAL_FORM = {
    applicationId: "",
    scheduledAt: "",
    interviewType: "ONLINE",
    meetingLink: "",
    location: "",
    notes: "",
};

const STATUS_OPTIONS = [
    {
        value: "ALL",
        label: "All Status",
    },
    {
        value: "SCHEDULED",
        label: "Scheduled",
    },
    {
        value: "COMPLETED",
        label: "Completed",
    },
    {
        value: "RESCHEDULED",
        label: "Rescheduled",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
    },
];

const TYPE_OPTIONS = [
    {
        value: "ALL",
        label: "All Types",
    },
    {
        value: "ONLINE",
        label: "Online",
    },
    {
        value: "OFFLINE",
        label: "In-person",
    },
    {
        value: "PHONE",
        label: "Phone",
    },
];

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

const getTypeLabel = (type) => {
    switch (type) {
        case "ONLINE":
            return "Online";
        case "OFFLINE":
            return "In-person";
        case "PHONE":
            return "Phone";
        default:
            return type || "Unknown";
    }
};

const getTypeIcon = (type) => {
    switch (type) {
        case "ONLINE":
            return <Video size={15} />;
        case "OFFLINE":
            return <MapPin size={15} />;
        case "PHONE":
            return <Phone size={15} />;
        default:
            return <CalendarDays size={15} />;
    }
};

const getStatusClasses = (status) => {
    switch (status) {
        case "SCHEDULED":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "COMPLETED":
            return "bg-green-50 text-green-700 border-green-200";

        case "RESCHEDULED":
            return "bg-amber-50 text-amber-700 border-amber-200";

        case "CANCELLED":
            return "bg-red-50 text-red-700 border-red-200";

        default:
            return "bg-gray-50 text-gray-600 border-gray-200";
    }
};

const getApplicationStatus = (application) => {
    return (
        application?.status ||
        application?.applicationStatus ||
        application?.currentStatus ||
        ""
    ).toUpperCase();
};

const getCandidateName = (application) => {
    return (
        application?.candidate?.user?.name ||
        application?.candidate?.name ||
        application?.candidate?.user?.fullName ||
        application?.user?.name ||
        "Candidate"
    );
};

const getCandidateEmail = (application) => {
    return (
        application?.candidate?.user?.email ||
        application?.candidate?.email ||
        application?.user?.email ||
        ""
    );
};

const getCandidateNameFromInterview = (interview) => {
    return (
        interview?.application?.candidate?.user?.name ||
        interview?.application?.candidate?.name ||
        interview?.application?.candidate?.user?.fullName ||
        "Candidate"
    );
};

const getCandidateEmailFromInterview = (interview) => {
    return (
        interview?.application?.candidate?.user?.email ||
        interview?.application?.candidate?.email ||
        ""
    );
};

const getJobTitle = (application) => {
    return (
        application?.job?.title ||
        application?.Job?.title ||
        "Job"
    );
};

const getJobTitleFromInterview = (interview) => {
    return (
        interview?.application?.job?.title ||
        interview?.application?.Job?.title ||
        "Job"
    );
};

const toDateTimeLocal = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (dateValue) => {
    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getApiErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.errors?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        fallback
    );
};

const isValidUrl = (value) => {
    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
};

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] =
        useState(false);

    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [showScheduleModal, setShowScheduleModal] =
        useState(false);

    const [showViewModal, setShowViewModal] =
        useState(false);

    const [showCancelModal, setShowCancelModal] =
        useState(false);

    const [selectedInterview, setSelectedInterview] =
        useState(null);

    const [editingInterview, setEditingInterview] =
        useState(null);

    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const loadInterviews = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const data = await getRecruiterInterviews();

            setInterviews(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to load recruiter interviews."
                )
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    const loadApplications = async () => {
        try {
            setApplicationsLoading(true);

            const data = await getRecruiterApplications();

            setApplications(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to load recruiter applications."
                )
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const handleRefresh = async () => {
        clearMessages();
        await loadInterviews();
    };

    const handleOpenSchedule = async () => {
        clearMessages();

        setEditingInterview(null);
        setSelectedInterview(null);
        setForm(INITIAL_FORM);
        setFormErrors({});
        setShowScheduleModal(true);

        await loadApplications();
    };

    const handleCloseSchedule = () => {
        if (actionLoading) {
            return;
        }

        setShowScheduleModal(false);
        setEditingInterview(null);
        setForm(INITIAL_FORM);
        setFormErrors({});
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        if (name === "interviewType") {
            setForm((previous) => ({
                ...previous,
                interviewType: value,
                meetingLink:
                    value === "ONLINE"
                        ? previous.meetingLink
                        : "",
                location:
                    value === "OFFLINE"
                        ? previous.location
                        : "",
            }));

            setFormErrors((previous) => ({
                ...previous,
                interviewType: "",
                meetingLink: "",
                location: "",
            }));

            return;
        }

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!form.applicationId) {
            errors.applicationId =
                "Please select a candidate/application.";
        }

        if (!form.scheduledAt) {
            errors.scheduledAt =
                "Please select the interview date and time.";
        } else {
            const selectedDate = new Date(form.scheduledAt);

            if (Number.isNaN(selectedDate.getTime())) {
                errors.scheduledAt =
                    "Please select a valid date and time.";
            } else if (
                selectedDate.getTime() <= Date.now()
            ) {
                errors.scheduledAt =
                    "Interview date and time must be in the future.";
            }
        }

        if (!form.interviewType) {
            errors.interviewType =
                "Please select an interview type.";
        }

        if (form.interviewType === "ONLINE") {
            if (!form.meetingLink.trim()) {
                errors.meetingLink =
                    "Meeting link is required for online interviews.";
            } else if (!isValidUrl(form.meetingLink.trim())) {
                errors.meetingLink =
                    "Please enter a valid meeting URL.";
            }
        }

        if (form.interviewType === "OFFLINE") {
            if (!form.location.trim()) {
                errors.location =
                    "Office location/address is required for in-person interviews.";
            }
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const buildInterviewPayload = () => {
        const payload = {
            scheduledAt: new Date(
                form.scheduledAt
            ).toISOString(),
            interviewType: form.interviewType,
            notes: form.notes.trim() || null,
        };

        if (form.interviewType === "ONLINE") {
            payload.meetingLink =
                form.meetingLink.trim();
        }

        if (form.interviewType === "OFFLINE") {
            payload.location =
                form.location.trim();
        }

        return payload;
    };

    const handleSubmitInterview = async (event) => {
        event.preventDefault();

        clearMessages();

        if (!validateForm()) {
            return;
        }

        try {
            setActionLoading(true);

            const payload = buildInterviewPayload();

            if (editingInterview) {
                await updateInterview(
                    editingInterview.id,
                    payload
                );

                setSuccessMessage(
                    "Interview rescheduled successfully."
                );
            } else {
                await scheduleInterview(
                    Number(form.applicationId),
                    payload
                );

                setSuccessMessage(
                    "Interview scheduled successfully."
                );
            }

            setShowScheduleModal(false);
            setEditingInterview(null);
            setForm(INITIAL_FORM);
            setFormErrors({});

            await loadInterviews(false);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    editingInterview
                        ? "Failed to reschedule interview."
                        : "Failed to schedule interview."
                )
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReschedule = (interview) => {
        clearMessages();

        setEditingInterview(interview);

        setForm({
            applicationId:
                interview.applicationId ||
                interview.application?.id ||
                "",
            scheduledAt: toDateTimeLocal(
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

        setFormErrors({});
        setShowScheduleModal(true);
    };

    const handleViewInterview = async (interview) => {
        try {
            clearMessages();
            setActionLoading(true);

            const data = await getInterview(interview.id);

            setSelectedInterview(data);
            setShowViewModal(true);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to load interview details."
                )
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenCancel = (interview) => {
        clearMessages();
        setSelectedInterview(interview);
        setShowCancelModal(true);
    };

    const handleCloseCancel = () => {
        if (actionLoading) {
            return;
        }

        setSelectedInterview(null);
        setShowCancelModal(false);
    };

    const handleCancelInterview = async () => {
        if (!selectedInterview?.id) {
            return;
        }

        try {
            setActionLoading(true);
            clearMessages();

            await cancelInterview(selectedInterview.id);

            setSuccessMessage(
                "Interview cancelled successfully."
            );

            setSelectedInterview(null);
            setShowCancelModal(false);

            await loadInterviews(false);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to cancel interview."
                )
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusUpdate = async (
        interview,
        status
    ) => {
        try {
            setActionLoading(true);
            clearMessages();

            await updateInterviewStatus(
                interview.id,
                status
            );

            setSuccessMessage(
                `Interview marked as ${getStatusLabel(
                    status
                ).toLowerCase()}.`
            );

            await loadInterviews(false);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to update interview status."
                )
            );
        } finally {
            setActionLoading(false);
        }
    };

    const filteredInterviews = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return interviews.filter((interview) => {
            const candidateName =
                getCandidateNameFromInterview(
                    interview
                ).toLowerCase();

            const candidateEmail =
                getCandidateEmailFromInterview(
                    interview
                ).toLowerCase();

            const jobTitle =
                getJobTitleFromInterview(
                    interview
                ).toLowerCase();

            const interviewType =
                (
                    interview.interviewType || ""
                ).toLowerCase();

            const status =
                (
                    interview.status || ""
                ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                candidateName.includes(searchValue) ||
                candidateEmail.includes(searchValue) ||
                jobTitle.includes(searchValue) ||
                interviewType.includes(searchValue) ||
                status.includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                interview.status === statusFilter;

            const matchesType =
                typeFilter === "ALL" ||
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
                (item) =>
                    item.status === "SCHEDULED"
            ).length,

            completed: interviews.filter(
                (item) =>
                    item.status === "COMPLETED"
            ).length,

            cancelled: interviews.filter(
                (item) =>
                    item.status === "CANCELLED"
            ).length,
        };
    }, [interviews]);

    const availableApplications = useMemo(() => {
        return applications.filter((application) => {
            const status =
                getApplicationStatus(application);

            return (
                status === "SHORTLISTED" ||
                status === "INTERVIEW"
            );
        });
    }, [applications]);

    const selectedApplication = useMemo(() => {
        if (!form.applicationId) {
            return null;
        }

        return (
            applications.find(
                (application) =>
                    String(application.id) ===
                    String(form.applicationId)
            ) || null
        );
    }, [applications, form.applicationId]);

    const renderInterviewMode = (interview) => {
        if (interview.interviewType === "ONLINE") {
            return (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video
                        size={15}
                        className="shrink-0"
                    />

                    {interview.meetingLink ? (
                        <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="max-w-[260px] truncate text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Join Meeting
                        </a>
                    ) : (
                        <span>Online Interview</span>
                    )}
                </div>
            );
        }

        if (interview.interviewType === "OFFLINE") {
            return (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin
                        size={15}
                        className="shrink-0"
                    />

                    <span className="max-w-[260px] truncate">
                        {interview.location ||
                            "Office location"}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone
                    size={15}
                    className="shrink-0"
                />
                <span>Phone Interview</span>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-gray-50 p-4 md:p-5">
            <div className="mx-auto max-w-7xl space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Interviews
                        </h1>

                        <p className="mt-0.5 text-sm text-gray-500">
                            Manage and track candidate interviews.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenSchedule}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Schedule Interview
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="shrink-0 text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <span>{successMessage}</span>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage("")
                            }
                            className="shrink-0 text-green-500 hover:text-green-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Total
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {statistics.total}
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                                <CalendarDays size={19} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Scheduled
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {statistics.scheduled}
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                                <Clock3 size={19} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Completed
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {statistics.completed}
                                </p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                                <CheckCircle2 size={19} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Cancelled
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {statistics.cancelled}
                                </p>
                            </div>

                            <div className="rounded-lg bg-red-50 p-2.5 text-red-600">
                                <XCircle size={19} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search candidate, email or job..."
                                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
                            >
                                {STATUS_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {option.label}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
                            >
                                {TYPE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {option.label}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Interview List */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Interview Schedule
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                {filteredInterviews.length}{" "}
                                interview
                                {filteredInterviews.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-[220px] items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <RefreshCw
                                    size={17}
                                    className="animate-spin"
                                />
                                Loading interviews...
                            </div>
                        </div>
                    ) : filteredInterviews.length === 0 ? (
                        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                            <div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-500">
                                <CalendarDays size={22} />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No interviews found
                            </h3>

                            <p className="mt-1 max-w-md text-xs text-gray-500">
                                {interviews.length === 0
                                    ? "There are no interviews scheduled yet."
                                    : "Try changing your search or filter options."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredInterviews.map(
                                (interview) => {
                                    const candidateName =
                                        getCandidateNameFromInterview(
                                            interview
                                        );

                                    const candidateEmail =
                                        getCandidateEmailFromInterview(
                                            interview
                                        );

                                    const jobTitle =
                                        getJobTitleFromInterview(
                                            interview
                                        );

                                    const isActive =
                                        interview.status ===
                                            "SCHEDULED" ||
                                        interview.status ===
                                            "RESCHEDULED";

                                    return (
                                        <div
                                            key={
                                                interview.id
                                            }
                                            className="px-5 py-4 transition hover:bg-gray-50"
                                        >
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-gray-900">
                                                            {
                                                                candidateName
                                                            }
                                                        </h3>

                                                        <span
                                                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusClasses(
                                                                interview.status
                                                            )}`}
                                                        >
                                                            {getStatusLabel(
                                                                interview.status
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <BriefcaseBusiness
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                            {
                                                                jobTitle
                                                            }
                                                        </span>

                                                        {candidateEmail && (
                                                            <span className="flex items-center gap-1.5">
                                                                <FileText
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                                {
                                                                    candidateEmail
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <CalendarDays
                                                                size={
                                                                    15
                                                                }
                                                                className="text-gray-400"
                                                            />
                                                            <span>
                                                                {formatDate(
                                                                    interview.scheduledAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Clock3
                                                                size={
                                                                    15
                                                                }
                                                                className="text-gray-400"
                                                            />
                                                            <span>
                                                                {formatTime(
                                                                    interview.scheduledAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            {getTypeIcon(
                                                                interview.interviewType
                                                            )}
                                                            <span>
                                                                {getTypeLabel(
                                                                    interview.interviewType
                                                                )}
                                                            </span>
                                                        </div>

                                                        {renderInterviewMode(
                                                            interview
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewInterview(
                                                                interview
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Eye
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        View
                                                    </button>

                                                    {isActive && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleReschedule(
                                                                        interview
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                                    handleOpenCancel(
                                                                        interview
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <XCircle
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                                Cancel
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        interview,
                                                                        "COMPLETED"
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-medium text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <CheckCircle2
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                                Complete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule / Reschedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    {editingInterview
                                        ? "Reschedule Interview"
                                        : "Schedule Interview"}
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-500">
                                    {editingInterview
                                        ? "Update the interview date, time or interview details."
                                        : "Schedule an interview with a shortlisted candidate."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseSchedule
                                }
                                disabled={actionLoading}
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmitInterview
                            }
                        >
                            <div className="space-y-4 px-5 py-4">
                                {/* Candidate/Application */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Candidate / Application
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    {editingInterview ? (
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                                            <p className="text-sm font-medium text-gray-800">
                                                {getCandidateNameFromInterview(
                                                    editingInterview
                                                )}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {getJobTitleFromInterview(
                                                    editingInterview
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <select
                                            name="applicationId"
                                            value={
                                                form.applicationId
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            disabled={
                                                applicationsLoading ||
                                                actionLoading
                                            }
                                            className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                                                formErrors.applicationId
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                            }`}
                                        >
                                            <option value="">
                                                {applicationsLoading
                                                    ? "Loading applications..."
                                                    : availableApplications.length ===
                                                        0
                                                      ? "No eligible applications"
                                                      : "Select candidate"}
                                            </option>

                                            {availableApplications.map(
                                                (
                                                    application
                                                ) => (
                                                    <option
                                                        key={
                                                            application.id
                                                        }
                                                        value={
                                                            application.id
                                                        }
                                                    >
                                                        {getCandidateName(
                                                            application
                                                        )}{" "}
                                                        —{" "}
                                                        {getJobTitle(
                                                            application
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    )}

                                    {selectedApplication &&
                                        !editingInterview && (
                                            <p className="mt-1.5 text-xs text-gray-500">
                                                {
                                                    getCandidateEmail(
                                                        selectedApplication
                                                    )
                                                }
                                            </p>
                                        )}

                                    {formErrors.applicationId && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {
                                                formErrors.applicationId
                                            }
                                        </p>
                                    )}

                                    {!editingInterview &&
                                        !applicationsLoading &&
                                        availableApplications.length ===
                                            0 && (
                                            <p className="mt-1.5 text-xs text-amber-600">
                                                Only SHORTLISTED or INTERVIEW
                                                applications can be scheduled.
                                            </p>
                                        )}
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Date & Time
                                        <span className="ml-1 text-red-500">
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
                                        disabled={
                                            actionLoading
                                        }
                                        min={toDateTimeLocal(
                                            new Date()
                                        )}
                                        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                                            formErrors.scheduledAt
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {formErrors.scheduledAt && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {
                                                formErrors.scheduledAt
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Interview Type */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Interview Type
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            {
                                                value: "ONLINE",
                                                label: "Online",
                                                icon: (
                                                    <Video
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ),
                                            },
                                            {
                                                value: "OFFLINE",
                                                label: "In-person",
                                                icon: (
                                                    <MapPin
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ),
                                            },
                                            {
                                                value: "PHONE",
                                                label: "Phone",
                                                icon: (
                                                    <Phone
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ),
                                            },
                                        ].map((type) => {
                                            const selected =
                                                form.interviewType ===
                                                type.value;

                                            return (
                                                <button
                                                    key={
                                                        type.value
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleFormChange(
                                                            {
                                                                target: {
                                                                    name: "interviewType",
                                                                    value: type.value,
                                                                },
                                                            }
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition ${
                                                        selected
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {
                                                        type.icon
                                                    }
                                                    {
                                                        type.label
                                                    }
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {formErrors.interviewType && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {
                                                formErrors.interviewType
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Online Meeting Link */}
                                {form.interviewType ===
                                    "ONLINE" && (
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Meeting Link
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <Video
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                                                disabled={
                                                    actionLoading
                                                }
                                                placeholder="https://meet.google.com/..."
                                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                                                    formErrors.meetingLink
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                                }`}
                                            />
                                        </div>

                                        {formErrors.meetingLink && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {
                                                    formErrors.meetingLink
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Offline Location */}
                                {form.interviewType ===
                                    "OFFLINE" && (
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Office Location /
                                            Address
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <MapPin
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                                                disabled={
                                                    actionLoading
                                                }
                                                placeholder="Enter office address"
                                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                                                    formErrors.location
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                                }`}
                                            />
                                        </div>

                                        {formErrors.location && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {
                                                    formErrors.location
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Phone information */}
                                {form.interviewType ===
                                    "PHONE" && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Phone
                                                size={16}
                                            />
                                            Phone Interview
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            No meeting link or office
                                            location is required.
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>

                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={
                                            handleFormChange
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        rows={3}
                                        placeholder="Add interview instructions or notes..."
                                        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                                <button
                                    type="button"
                                    onClick={
                                        handleCloseSchedule
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        actionLoading ||
                                        (!editingInterview &&
                                            availableApplications.length ===
                                                0)
                                    }
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {actionLoading && (
                                        <RefreshCw
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingInterview
                                        ? "Save Changes"
                                        : "Schedule Interview"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Interview Modal */}
            {showViewModal &&
                selectedInterview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Interview Details
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Complete interview information.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowViewModal(
                                            false
                                        );
                                        setSelectedInterview(
                                            null
                                        );
                                    }}
                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            <div className="space-y-4 px-5 py-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Candidate
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {getCandidateNameFromInterview(
                                            selectedInterview
                                        )}
                                    </p>

                                    {getCandidateEmailFromInterview(
                                        selectedInterview
                                    ) && (
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {getCandidateEmailFromInterview(
                                                selectedInterview
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Job
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-800">
                                            {getJobTitleFromInterview(
                                                selectedInterview
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Status
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(
                                                selectedInterview.status
                                            )}`}
                                        >
                                            {getStatusLabel(
                                                selectedInterview.status
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Date
                                        </p>

                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-800">
                                            <CalendarDays
                                                size={15}
                                                className="text-gray-400"
                                            />
                                            {formatDate(
                                                selectedInterview.scheduledAt
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Time
                                        </p>

                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-800">
                                            <Clock3
                                                size={15}
                                                className="text-gray-400"
                                            />
                                            {formatTime(
                                                selectedInterview.scheduledAt
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Interview Type
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                                        {getTypeIcon(
                                            selectedInterview.interviewType
                                        )}

                                        {getTypeLabel(
                                            selectedInterview.interviewType
                                        )}
                                    </div>
                                </div>

                                {selectedInterview.interviewType ===
                                    "ONLINE" &&
                                    selectedInterview.meetingLink && (
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Meeting Link
                                            </p>

                                            <a
                                                href={
                                                    selectedInterview.meetingLink
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 block truncate text-sm text-blue-600 hover:underline"
                                            >
                                                {
                                                    selectedInterview.meetingLink
                                                }
                                            </a>
                                        </div>
                                    )}

                                {selectedInterview.interviewType ===
                                    "OFFLINE" &&
                                    selectedInterview.location && (
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Location
                                            </p>

                                            <p className="mt-1 flex items-start gap-2 text-sm text-gray-800">
                                                <MapPin
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-gray-400"
                                                />

                                                {
                                                    selectedInterview.location
                                                }
                                            </p>
                                        </div>
                                    )}

                                {selectedInterview.interviewType ===
                                    "PHONE" && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Interview Method
                                        </p>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-800">
                                            <Phone
                                                size={15}
                                                className="text-gray-400"
                                            />
                                            Phone Interview
                                        </p>
                                    </div>
                                )}

                                {selectedInterview.notes && (
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Notes
                                        </p>

                                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-2.5 text-sm leading-5 text-gray-700">
                                            {
                                                selectedInterview.notes
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end border-t border-gray-100 px-5 py-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowViewModal(
                                            false
                                        );
                                        setSelectedInterview(
                                            null
                                        );
                                    }}
                                    className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal &&
                selectedInterview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
                            <div className="px-5 py-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <XCircle size={21} />
                                </div>

                                <h2 className="text-base font-semibold text-gray-900">
                                    Cancel Interview?
                                </h2>

                                <p className="mt-1.5 text-sm leading-5 text-gray-500">
                                    Are you sure you want to cancel
                                    the interview with{" "}
                                    <span className="font-medium text-gray-700">
                                        {getCandidateNameFromInterview(
                                            selectedInterview
                                        )}
                                    </span>
                                    ?
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                                <button
                                    type="button"
                                    onClick={
                                        handleCloseCancel
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Keep Interview
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelInterview
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {actionLoading && (
                                        <RefreshCw
                                            size={14}
                                            className="animate-spin"
                                        />
                                    )}
                                    Cancel Interview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default RecruiterInterviews;
