import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    Clock3,
    Eye,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    Sparkles,
    User,
    Users,
    X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination, { usePagination } from "../../components/Pagination.jsx";
import {
    getJobApplications,
    getRankedJobApplications,
    getRecruiterApplications,
    runJobAtsAnalysis,
    updateApplicationStatus as updateApplicationStatusRequest,
} from "../../services/applicationService";

const statusLabels = {
    APPLIED: "Applied",
    UNDER_REVIEW: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    SELECTED: "Selected",
    REJECTED: "Rejected",
};

const mapApplication = (item) => {
    const candidate = item.candidate || {};
    const job = item.job || {};

    return {
        ...item,
        jobId: item.jobId || job.id,
        candidate: candidate.user?.name || "Candidate",
        email: candidate.user?.email || "",
        phone: candidate.user?.phone || "",
        jobTitle: job.title || item.jobTitle || "Job",
        categoryId: job.categoryId || job.category?.id,
        category: job.category?.name || job.Category?.name || job.categoryName || item.category || "Uncategorized",
        location: candidate.location || job.location || "",
        experience: candidate.experienceYears
            ? `${candidate.experienceYears} Years`
            : "Not specified",
        status: statusLabels[item.status] || item.status,
        applicationStatus: item.status,
        appliedDate: item.appliedAt
            ? new Date(item.appliedAt).toLocaleDateString()
            : "",
        skills: (candidate.skills || []).map((skill) =>
            typeof skill === "string" ? skill : skill.name
        ).filter(Boolean),
        resume: item.resume || "",
        education: candidate.education || "Not specified",
        summary: candidate.bio || "No professional summary provided.",
        atsAnalysis: item.atsAnalysis || null,
    };
};

const RecruiterApplications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const currentJobId = jobId ? Number(jobId) : null;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Selected candidate/application
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Modal type
    const [modalType, setModalType] = useState(null);

    const [applications, setApplications] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [atsRunning, setAtsRunning] = useState(false);
    const [atsMessage, setAtsMessage] = useState("");
    const [rankedMode, setRankedMode] = useState(false);
    const [selectedAtsJobId, setSelectedAtsJobId] = useState("");

    useEffect(() => {
        let active = true;
        const request = currentJobId
            ? getJobApplications(currentJobId)
            : getRecruiterApplications();

        request
            .then((items) => {
                if (!active) return;
                const mappedItems = items.map(mapApplication);
                setApplications(mappedItems);
                setAllApplications(mappedItems);
                setRankedMode(false);
                setError("");
            })
            .catch((loadError) => {
                if (active) {
                    setApplications([]);
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load applications."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [currentJobId]);

    // Applications For Current Job
    const jobApplications = useMemo(() => {
        return applications.filter(
            (application) =>
                !currentJobId || application.jobId === currentJobId
        );
    }, [applications, currentJobId]);

    const categories = useMemo(() => {
        return [...new Set(jobApplications.map((application) => application.category))]
            .filter(Boolean)
            .sort((first, second) => first.localeCompare(second));
    }, [jobApplications]);

    // Unique jobs represented in the current application list. This lets recruiters
    // run ATS analysis even when they opened the general Applications page.
    const atsJobOptions = useMemo(() => {
        const jobsById = new Map();

        allApplications.forEach((application) => {
            const id = Number(application.jobId);
            if (!id || jobsById.has(id)) return;

            jobsById.set(id, {
                id,
                title: application.jobTitle || `Job ${id}`,
            });
        });

        return [...jobsById.values()].sort((a, b) => a.title.localeCompare(b.title));
    }, [allApplications]);

    const atsJobId = currentJobId || (
        atsJobOptions.some((job) => job.id === Number(selectedAtsJobId))
            ? Number(selectedAtsJobId)
            : atsJobOptions[0]?.id || null
    );

    // Filter Applications
    const filteredApplications = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return jobApplications.filter((application) => {
            const matchesSearch =
                !searchValue ||
                application.candidate
                    .toLowerCase()
                    .includes(searchValue) ||
                application.email
                    .toLowerCase()
                    .includes(searchValue) ||
                application.location
                    .toLowerCase()
                    .includes(searchValue) ||
                application.experience
                    .toLowerCase()
                    .includes(searchValue) ||
                application.skills.some((skill) =>
                    skill
                        .toLowerCase()
                        .includes(searchValue)
                );

            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                application.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [
        jobApplications,
        search,
        statusFilter,
        categoryFilter,
    ]);
    const paginationResetKey = JSON.stringify([search, statusFilter, categoryFilter, currentJobId]);
    const { pageItems: pageApplications, currentPage, setCurrentPage, pageCount } =
        usePagination(filteredApplications, paginationResetKey);

    // Status Classes
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

    // Initials
    const getInitials = (name) => {
        return (name || "Candidate")
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    // Summary Counts
    const totalApplications =
        jobApplications.length;

    const newApplications =
        jobApplications.filter(
            (application) =>
                application.status === "Applied"
        ).length;

    const shortlistedApplications =
        jobApplications.filter(
            (application) =>
                application.status === "Shortlisted"
        ).length;

    const interviewApplications =
        jobApplications.filter(
            (application) =>
                application.status === "Interview"
        ).length;

    /* Current Job Title */
    const currentJobTitle =
        jobApplications.length > 0
            ? jobApplications[0].jobTitle
            : "Job Applications";

    /* Clear Filters */
    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");
    };

    /* Open Candidate Modal */
    const openCandidateModal = (application) => {
        setSelectedCandidate(application);
        setModalType("candidate");
    };

    /* Open Manage Modal */
    const openManageModal = (application) => {
        setSelectedCandidate(application);
        setModalType("manage");
    };

    /* Close Modal */
    const closeModal = () => {
        setSelectedCandidate(null);
        setModalType(null);
    };

    /* Update Application Status */
    const updateApplicationStatus = async (
        applicationId,
        newStatus
    ) => {
        const statusValues = {
            Applied: "APPLIED",
            "Under Review": "UNDER_REVIEW",
            Shortlisted: "SHORTLISTED",
            Interview: "INTERVIEW",
            Selected: "SELECTED",
            Rejected: "REJECTED",
        };

        try {
            await updateApplicationStatusRequest(
                applicationId,
                statusValues[newStatus]
            );
            setError("");
        } catch (statusError) {
            setError(
                statusError.response?.data?.message ||
                "Unable to update the application status."
            );
            return;
        }

        setApplications(
            (prevApplications) =>
                prevApplications.map(
                    (application) =>
                        application.id ===
                            applicationId
                            ? {
                                ...application,
                                status: newStatus,
                            }
                            : application
                )
        );

        setSelectedCandidate((prev) =>
            prev
                ? {
                    ...prev,
                    status: newStatus,
                }
                : null
        );
    };

    /* Load ATS-ranked applicants for the selected job */
    const loadRankedApplications = async () => {
        if (!atsJobId) {
            setError("There are no job applications available to rank yet.");
            return;
        }

        setError("");
        try {
            const result = await getRankedJobApplications(atsJobId, 1, 100);
            const items = result.applications || [];
            setApplications(items.map(mapApplication));
            setRankedMode(true);
            setSearch("");
            setStatusFilter("All");
            setCategoryFilter("All");
            if (!items.length) setAtsMessage("No applications were returned for this job.");
        } catch (rankError) {
            setError(
                rankError.response?.data?.message ||
                "Unable to load ATS-ranked applicants."
            );
        }
    };

    /* Return to the normal application list */
    const handleShowAllApplications = async () => {
        setLoading(true);
        setError("");
        try {
            const items = currentJobId
                ? await getJobApplications(currentJobId)
                : await getRecruiterApplications();
            const mappedItems = items.map(mapApplication);
            setApplications(mappedItems);
            setAllApplications(mappedItems);
            setRankedMode(false);
            setAtsMessage("");
        } catch (loadError) {
            setError(
                loadError.response?.data?.message ||
                "Unable to reload applications."
            );
        } finally {
            setLoading(false);
        }
    };

    /* Analyze applications in batches of 50 */
    const handleRunAtsAnalysis = async () => {
        if (!atsJobId) {
            setError("There are no job applications available to analyze yet.");
            return;
        }

        setAtsRunning(true);
        setAtsMessage("");
        setError("");

        try {
            let cursor = 0;
            let hasMore = true;
            let completed = 0;
            let failed = 0;
            let skipped = 0;

            while (hasMore) {
                const result = await runJobAtsAnalysis(atsJobId, cursor);
                completed += result.completed || 0;
                failed += result.failed || 0;
                skipped += result.skipped || 0;

                const nextCursor = result.nextCursor;
                hasMore = Boolean(result.hasMore);

                if (hasMore && (nextCursor == null || nextCursor <= cursor)) {
                    throw new Error("ATS batch cursor did not advance. Please try again.");
                }
                if (nextCursor != null) cursor = nextCursor;
            }

            setAtsMessage(
                `ATS analysis finished — ${completed} completed, ${failed} failed, ${skipped} skipped.`
            );
            await loadRankedApplications();
        } catch (atsError) {
            setError(
                atsError.response?.data?.message ||
                atsError.message ||
                "Unable to run ATS analysis."
            );
        } finally {
            setAtsRunning(false);
        }
    };

    /*  View Resume  */
    const handleViewResume = (application) => {
        if (!application.resume) {
            alert("Resume is not available.");
            return;
        }
        window.open(
            application.resume,
            "_blank",
            "noopener,noreferrer"
        );
    };

    /* Back To Job Details */
    const handleBack = () => {
        navigate(
            `/recruiter/jobs/${jobId}`
        );
    };

    /* Page  */
    if (loading) {
        return (
            <p className="py-10 text-center text-sm text-slate-500">
                Loading applications...
            </p>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {/* PAGE HEADER */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Applications
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Review and manage candidates who have
                        applied.
                    </p>
                </div>

                
            </section>

            {/* BACK BUTTON — shown only when opened from a specific job */}
            {currentJobId && (
                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                >
                    <ArrowLeft size={18} />
                    Back to Job
                </button>
            )}

            {/* ATS RESUME SCANNER */}
            {atsJobOptions.length > 0 && (
                <section className="relative mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400" />
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
                        <div className="p-5 sm:p-7">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Sparkles size={17} />
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">Smart hiring tools</span>
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Rule-based ATS</span>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Resume match scanner</h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                Screen resumes against a role's listed skills and keywords. Review match signals, spot skill gaps, and sort applicants to help plan your next hiring step.
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm"><FileText size={16} /></div>
                                    <p className="mt-3 text-xs font-semibold text-slate-800">Resume parsing</p>
                                    <p className="mt-1 text-[11px] leading-4 text-slate-500">Reads supported resume files</p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm"><Users size={16} /></div>
                                    <p className="mt-3 text-xs font-semibold text-slate-800">Skill comparison</p>
                                    <p className="mt-1 text-[11px] leading-4 text-slate-500">Highlights matches and gaps</p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm"><Search size={16} /></div>
                                    <p className="mt-3 text-xs font-semibold text-slate-800">Candidate ranking</p>
                                    <p className="mt-1 text-[11px] leading-4 text-slate-500">Sorts by calculated match score</p>
                                </div>
                            </div>

                            {atsRunning && (
                                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4" role="status" aria-live="polite">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600"><Sparkles size={18} className="animate-pulse" /></span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-indigo-950">Scanning resumes…</p>
                                            <p className="mt-1 text-xs leading-5 text-indigo-700">Please keep this page open while the applications are processed in batches.</p>
                                        </div>
                                        <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                                    </div>
                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" /></div>
                                </div>
                            )}
                            {atsMessage && (
                                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                    <span className="mt-0.5">✓</span><span>{atsMessage}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Analysis workspace</p>
                            <label className="mt-4 block text-xs font-semibold text-slate-700">Job to screen</label>
                            {currentJobId ? (
                                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness size={18} /></span>
                                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{atsJobOptions.find((job) => job.id === currentJobId)?.title || currentJobTitle}</p><p className="mt-1 text-xs text-slate-500">Current job applications</p></div>
                                </div>
                            ) : (
                                <div className="relative mt-2">
                                    <BriefcaseBusiness size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={atsJobId || ""}
                                        onChange={(event) => {
                                            setSelectedAtsJobId(event.target.value);
                                            setAtsMessage("");
                                            setError("");
                                            setRankedMode(false);
                                        }}
                                        disabled={atsRunning}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                                    >
                                        {atsJobOptions.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            )}

                            <button type="button" onClick={handleRunAtsAnalysis} disabled={atsRunning || !atsJobId} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60">
                                <Sparkles size={17} />{atsRunning ? "Scanning resumes…" : "Start resume screening"}
                            </button>
                            <button type="button" onClick={rankedMode ? handleShowAllApplications : loadRankedApplications} disabled={atsRunning || !atsJobId} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/60 disabled:cursor-not-allowed disabled:opacity-60">
                                <Users size={16} />{rankedMode ? "Return to all applications" : "View ranked candidates"}
                            </button>
                            <div className="mt-4 flex items-start gap-2 border-t border-slate-200 pt-4 text-[11px] leading-5 text-slate-500">
                                <span className="mt-0.5 text-indigo-500">ⓘ</span>
                                <p>Scores are based on resume text and job keywords. Use them as decision support—not as the sole reason to reject a candidate.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* SUMMARY CARDS */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total */}
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

                {/* New */}
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

                {/* Shortlisted */}
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

                {/* Interviews */}
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

            {/* FILTERS */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_minmax(10rem,auto)]">
                    {/* Search */}

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search candidate, email, location or skill..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Category */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full min-w-40 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    {/* Status */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="w-full min-w-48 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Applied">
                                Applied
                            </option>

                            <option value="Under Review">
                                Under Review
                            </option>

                            <option value="Shortlisted">
                                Shortlisted
                            </option>

                            <option value="Interview">
                                Interview
                            </option>

                            <option value="Rejected">
                                Rejected
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
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Candidate Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredApplications.length}{" "}
                            {filteredApplications.length ===
                                1
                                ? "application"
                                : "applications"}{" "}
                            found
                        </p>
                    </div>

                    {(search ||
                        statusFilter !== "All") && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="w-fit text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Clear filters
                            </button>
                        )}
                </div>

                {/* APPLICATION LIST */}
                {filteredApplications.length > 0 ? (
                    <>
                    <div className="mt-5 space-y-4">
                        {pageApplications.map(
                            (application) => (
                                <div
                                    key={
                                        application.id
                                    }
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
                                                        {
                                                            application.candidate
                                                        }
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                            application.status
                                                        )}`}
                                                    >
                                                        {
                                                            application.status
                                                        }
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        application.email
                                                    }
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                                    <span>
                                                        📍{" "}
                                                        {
                                                            application.location
                                                        }
                                                    </span>
                                                    <span>
                                                        💼{" "}
                                                        {
                                                            application.experience
                                                        }{" "}
                                                        experience
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Applied Job */}
                                        <div className="flex items-start gap-3 xl:min-w-72">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <BriefcaseBusiness
                                                    size={
                                                        18
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Applied
                                                    for
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {
                                                        application.jobTitle
                                                    }
                                                </p>

                                                {application.category && application.category !== "Uncategorized" && (
                                                    <p className="mt-1 text-xs font-medium text-indigo-600">
                                                        {application.category}
                                                    </p>
                                                )}

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Applied{" "}
                                                    {
                                                        application.appliedDate
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-[auto_1fr]">
                                        {/* Applied Date */}

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                <CalendarDays
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Applied
                                                    Date
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {
                                                        application.appliedDate
                                                    }
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
                                                    (
                                                        skill
                                                    ) => (
                                                        <span
                                                            key={
                                                                skill
                                                            }
                                                            className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ATS RESUME MATCH CARD */}
                                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                        <div className="flex flex-col gap-4 bg-gradient-to-r from-slate-50 via-white to-indigo-50/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                            <div className="flex items-start gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-sm"><Sparkles size={18} /></span>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h4 className="text-sm font-bold text-slate-900">Resume match report</h4>
                                                        {application.atsAnalysis?.status === "COMPLETED" && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Analysis complete</span>}
                                                        {application.atsAnalysis?.status === "FAILED" && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">Analysis failed</span>}
                                                        {application.atsAnalysis?.status === "PROCESSING" && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">Scanning</span>}
                                                        {(!application.atsAnalysis || application.atsAnalysis.status === "PENDING") && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">Awaiting scan</span>}
                                                    </div>
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">Compared with the role's listed skills and keywords</p>
                                                </div>
                                            </div>
                                            {application.atsAnalysis?.status === "COMPLETED" ? (
                                                <div className="flex items-center gap-3 sm:justify-end">
                                                    <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${Number(application.atsAnalysis.score) >= 75 ? '#059669' : Number(application.atsAnalysis.score) >= 50 ? '#4f46e5' : '#d97706'} ${Math.max(0, Math.min(100, Number(application.atsAnalysis.score) || 0))}%, #e2e8f0 0)` }}>
                                                        <div className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white"><span className="text-xl font-extrabold leading-none text-slate-900">{application.atsAnalysis.score}%</span><span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">match</span></div>
                                                    </div>
                                                    <div className="min-w-[100px]">
                                                        <p className="text-xs font-semibold text-slate-700">{Number(application.atsAnalysis.score) >= 75 ? "Strong match" : Number(application.atsAnalysis.score) >= 50 ? "Partial match" : "Lower match"}</p>
                                                        <p className="mt-1 text-[11px] leading-4 text-slate-500">Use this score alongside your review.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`rounded-xl border px-4 py-3 text-xs ${application.atsAnalysis?.status === "FAILED" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white font-semibold text-slate-500"}`}>
                                                    {application.atsAnalysis?.status === "FAILED" ? (
                                                        <div className="flex flex-col gap-2 sm:items-end">
                                                            <span>{application.atsAnalysis.errorMessage || "Could not analyze this resume."}</span>
                                                            {["APPLIED", "UNDER_REVIEW"].includes(application.applicationStatus) && <button type="button" onClick={handleRunAtsAnalysis} disabled={atsRunning} className="font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-2 disabled:opacity-50">{atsRunning ? "Retrying scan…" : "Retry failed scan"}</button>}
                                                        </div>
                                                    ) : application.atsAnalysis?.status === "PROCESSING" ? "Scanning resume…" : "Run screening to generate a match score"}
                                                </div>
                                            )}
                                        </div>

                                        {application.atsAnalysis?.status === "COMPLETED" && (
                                            <div className="grid border-t border-slate-100 md:grid-cols-2">
                                                <div className="p-4 sm:p-5 md:border-r md:border-slate-100">
                                                    <div className="mb-3 flex items-center justify-between gap-2">
                                                        <p className="flex items-center gap-2 text-xs font-bold text-emerald-700"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50">✓</span>Matched skills</p>
                                                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{(application.atsAnalysis.matchedSkills || []).length} found</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(application.atsAnalysis.matchedSkills || []).length ? application.atsAnalysis.matchedSkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-medium text-emerald-800"><span className="text-emerald-600">✓</span>{skill}</span>) : <span className="text-xs text-slate-400">No listed skills matched</span>}
                                                    </div>
                                                </div>
                                                <div className="p-4 sm:p-5">
                                                    <div className="mb-3 flex items-center justify-between gap-2">
                                                        <p className="flex items-center gap-2 text-xs font-bold text-amber-700"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50">!</span>Skills to review</p>
                                                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">{(application.atsAnalysis.missingSkills || []).length} gaps</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(application.atsAnalysis.missingSkills || []).length ? application.atsAnalysis.missingSkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50/70 px-2.5 py-1.5 text-xs font-medium text-amber-800"><span className="text-amber-600">−</span>{skill}</span>) : <span className="text-xs text-slate-400">No listed skill gaps detected</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Resume */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewResume(
                                                    application
                                                )
                                            }
                                            className="flex w-fit items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                                        >
                                            <FileText
                                                size={
                                                    15
                                                }
                                            />
                                            View Resume
                                        </button>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openCandidateModal(
                                                        application
                                                    )
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <Eye
                                                    size={
                                                        15
                                                    }
                                                />
                                                View Candidate
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openManageModal(
                                                        application
                                                    )
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                            >
                                                <User
                                                    size={
                                                        15
                                                    }
                                                />

                                                Manage Application
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <Pagination totalItems={filteredApplications.length} currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
                    </>
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
                            There are no candidate
                            applications matching your
                            search or selected filter.
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

            {/* MODALS */}
            {selectedCandidate && modalType && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4"
                    onClick={closeModal}
                >
                    <div
                        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Hiring Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {modalType ===
                                        "candidate"
                                        ? "Candidate Details"
                                        : "Manage Application"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* CANDIDATE DETAILS */}
                        {modalType ===
                            "candidate" && (
                                <div className="p-6">
                                    {/* Candidate Header */}
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-600">
                                            {getInitials(
                                                selectedCandidate.candidate
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {
                                                        selectedCandidate.candidate
                                                    }
                                                </h3>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                        selectedCandidate.status
                                                    )}`}
                                                >
                                                    {
                                                        selectedCandidate.status
                                                    }
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    selectedCandidate.jobTitle
                                                }
                                            </p>
                                            {selectedCandidate.category && selectedCandidate.category !== "Uncategorized" && (
                                                <p className="mt-1 text-xs font-medium text-indigo-600">
                                                    {selectedCandidate.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail
                                                    size={
                                                        15
                                                    }
                                                />
                                                Email
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.email
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Phone
                                                    size={
                                                        15
                                                    }
                                                />
                                                Phone
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.phone
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <MapPin
                                                    size={
                                                        15
                                                    }
                                                />
                                                Location
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.location
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <BriefcaseBusiness
                                                    size={
                                                        15
                                                    }
                                                />
                                                Experience
                                            </div>

                                            <p className="mt-2 text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.experience
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Education */}

                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Education
                                        </h3>

                                        <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                            {
                                                selectedCandidate.education
                                            }
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Professional Summary
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {
                                                selectedCandidate.summary
                                            }
                                        </p>
                                    </div>

                                    {/* Skills */}

                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Skills
                                        </h3>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedCandidate.skills.map(
                                                (
                                                    skill
                                                ) => (
                                                    <span
                                                        key={
                                                            skill
                                                        }
                                                        className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600"
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Resume */}
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewResume(
                                                    selectedCandidate
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <FileText
                                                size={
                                                    17
                                                }
                                            />
                                            View Resume
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* MANAGE APPLICATION */}
                        {modalType ===
                            "manage" && (
                                <div className="p-6">
                                    {/* Candidate */}
                                    <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                            {getInitials(
                                                selectedCandidate.candidate
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {
                                                    selectedCandidate.candidate
                                                }
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {
                                                    selectedCandidate.jobTitle
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Current Status */}

                                    <div className="mt-6">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Current Status
                                        </p>

                                        <span
                                            className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                                selectedCandidate.status
                                            )}`}
                                        >
                                            {
                                                selectedCandidate.status
                                            }
                                        </span>
                                    </div>

                                    {/* Change Status */}
                                    <div className="mt-6">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Change Application
                                            Status
                                        </p>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {[
                                                "Applied",
                                                "Under Review",
                                                "Shortlisted",
                                                "Interview",
                                                "Rejected",
                                            ].map(
                                                (
                                                    status
                                                ) => (
                                                    <button
                                                        key={
                                                            status
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            updateApplicationStatus(
                                                                selectedCandidate.id,
                                                                status
                                                            )
                                                        }
                                                        className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${selectedCandidate.status ===
                                                            status
                                                            ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-6 border-t border-slate-100 pt-6">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Quick Actions
                                        </p>
                                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewResume(
                                                        selectedCandidate
                                                    )
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <FileText
                                                    size={
                                                        17
                                                    }
                                                />
                                                View Resume
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModalType(
                                                        "candidate"
                                                    )
                                                }
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                                View Candidate
                                            </button>
                                        </div>
                                    </div>

                                    {/* Close */}

                                    <button
                                        type="button"
                                        onClick={
                                            closeModal
                                        }
                                        className="mt-6 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplications;
