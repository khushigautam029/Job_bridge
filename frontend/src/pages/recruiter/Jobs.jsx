import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Clock,
    Edit,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import {
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    deleteJob as deleteJobRequest,
    formatJobCard,
    getJobCategories,
    getMyJobs,
    updateJob,
} from "../../services/jobService";

import { getJobApplications } from "../../services/applicationService";


const formatRecruiterJob = (job) => ({
    ...formatJobCard(job),
    categoryId: job.categoryId,
    applications: job.applications?.length || 0,
    postedDate: job.createdAt
        ? new Date(job.createdAt).toLocaleDateString()
        : "",
    status:
        job.status === "OPEN"
            ? "Active"
            : job.status === "CLOSED"
                ? "Closed"
                : "Draft",
    deadline: job.applicationDeadline || "",
    responsibilities: job.responsibilities
        ? job.responsibilities.split("\n").filter(Boolean)
        : [],
    requirements: job.requirements
        ? job.requirements.split("\n").filter(Boolean)
        : [],
});


const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100";


/*
 * Normalize an application response.
 * Keep the original API data so the modal can display
 * all additional candidate details returned by the backend.
 */
const formatApplication = (application) => {
    const candidate = application.candidate || {};
    const user = candidate.user || {};

    return {
        id: application.id,
        name: user.name || candidate.name || "Candidate",
        email: user.email || candidate.email || "",
        phone: user.phone || candidate.phone || "",
        experienceYears: candidate.experienceYears,
        candidate,
        user,
        application,
    };
};


const Detail = ({ icon: Icon, label, value }) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
    ) {
        return null;
    }

    const displayValue = Array.isArray(value)
        ? value
            .map((item) => {
                if (typeof item === "object" && item !== null) {
                    return (
                        item.name ||
                        item.title ||
                        item.skillName ||
                        JSON.stringify(item)
                    );
                }
                return item;
            })
            .join(", ")
        : typeof value === "object"
            ? value.name ||
              value.title ||
              value.url ||
              JSON.stringify(value)
            : String(value);

    return (
        <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3">
            {Icon && (
                <Icon
                    size={17}
                    className="mt-0.5 shrink-0 text-indigo-500"
                />
            )}

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm text-slate-700">
                    {displayValue}
                </p>
            </div>
        </div>
    );
};


const getInitials = (name = "Candidate") =>
    name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();


const CandidateDetails = ({ application }) => {
    const candidate = application.candidate || {};
    const user = application.user || {};

    /*
     * Include common candidate-profile fields.
     * Empty fields are automatically hidden.
     */
    const details = [
        {
            label: "Email",
            value: application.email,
            icon: Mail,
        },
        {
            label: "Phone",
            value:
                application.phone ||
                candidate.phone ||
                user.phone,
            icon: Phone,
        },
        {
            label: "Total Experience",
            value:
                application.experienceYears !== null &&
                application.experienceYears !== undefined
                    ? `${application.experienceYears} years`
                    : null,
            icon: Clock,
        },
        {
            label: "Location",
            value:
                candidate.location ||
                candidate.currentLocation ||
                user.location,
            icon: MapPin,
        },
        {
            label: "Education",
            value:
                candidate.education ||
                candidate.highestQualification ||
                candidate.degree,
            icon: GraduationCap,
        },
        {
            label: "College / University",
            value:
                candidate.college ||
                candidate.university ||
                candidate.institution,
            icon: Building2,
        },
        {
            label: "Current Company",
            value:
                candidate.currentCompany ||
                candidate.companyName,
            icon: Building2,
        },
        {
            label: "Current Designation",
            value:
                candidate.currentDesignation ||
                candidate.designation,
            icon: BriefcaseBusiness,
        },
        {
            label: "Skills",
            value:
                candidate.skills ||
                candidate.CandidateSkills ||
                candidate.candidateSkills,
            icon: FileText,
        },
        {
            label: "Resume",
            value:
                candidate.resumeUrl ||
                candidate.resume ||
                candidate.resumeLink,
            icon: FileText,
        },
        {
            label: "Address",
            value: candidate.address,
            icon: MapPin,
        },
        {
            label: "Date of Birth",
            value: candidate.dateOfBirth,
            icon: CalendarDays,
        },
        {
            label: "Gender",
            value: candidate.gender,
            icon: Users,
        },
        {
            label: "Bio / About",
            value:
                candidate.bio ||
                candidate.about ||
                candidate.summary,
            icon: FileText,
        },
    ];

    /*
     * Add other scalar fields from the candidate profile
     * so new backend fields can also appear without
     * adding a separate UI component for each one.
     */
    const knownKeys = new Set([
        "id",
        "userId",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "user",
        "User",
        "applications",
        "Applications",
        "password",
        "passwordHash",
    ]);

    const extraDetails = Object.entries(candidate)
        .filter(([key, value]) => {
            if (knownKeys.has(key)) return false;

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                return false;
            }

            if (
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                return false;
            }

            return !details.some(
                (detail) =>
                    detail.value === value &&
                    detail.value !== undefined
            );
        })
        .map(([key, value]) => ({
            label: key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (letter) => letter.toUpperCase()),
            value:
                typeof value === "boolean"
                    ? value
                        ? "Yes"
                        : "No"
                    : value,
            icon: FileText,
        }));

    const visibleDetails = [...details, ...extraDetails].filter(
        (detail) =>
            detail.value !== null &&
            detail.value !== undefined &&
            detail.value !== "" &&
            (!Array.isArray(detail.value) ||
                detail.value.length > 0)
    );

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                    {getInitials(application.name)}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-slate-900">
                        {application.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Candidate
                    </p>
                </div>
            </div>

            {visibleDetails.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {visibleDetails.map((detail, index) => (
                        <Detail
                            key={`${detail.label}-${index}`}
                            icon={detail.icon}
                            label={detail.label}
                            value={detail.value}
                        />
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-slate-400">
                    No additional profile details were returned
                    by the API.
                </p>
            )}
        </article>
    );
};


const Jobs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const selectedCategory = searchParams.get("category");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState(
        selectedCategory || "All"
    );

    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplications, setShowApplications] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [remoteApplications, setRemoteApplications] = useState({});
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        Promise.all([getMyJobs(), getJobCategories()])
            .then(([myJobs, jobCategories]) => {
                if (!active) return;

                setJobs(myJobs.map(formatRecruiterJob));
                setCategories(jobCategories);
            })
            .catch((loadError) => {
                if (active) {
                    setJobs([]);
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load your job postings."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const editJobId = location.state?.editJobId;

        if (loading || !editJobId) return;

        const selected = jobs.find(
            (job) => job.id === Number(editJobId)
        );

        if (selected) {
            setSelectedJob({ ...selected });
            setShowEditModal(true);
        }

        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, [
        jobs,
        loading,
        location.pathname,
        location.state,
        navigate,
    ]);

    const filteredJobs = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return jobs.filter((job) => {
            const matchesSearch =
                (job.title || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                (job.category || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                (job.location || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                (job.type || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                (job.skills || []).some((skill) =>
                    String(skill)
                        .toLowerCase()
                        .includes(searchValue)
                );

            const matchesStatus =
                statusFilter === "All" ||
                job.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                job.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [jobs, search, statusFilter, categoryFilter]);

    const selectedApplications = selectedJob
        ? remoteApplications[selectedJob.id] || []
        : [];

    const getStatusClasses = (status) =>
        status === "Active"
            ? "bg-green-50 text-green-600"
            : status === "Closed"
                ? "bg-slate-100 text-slate-500"
                : "bg-amber-50 text-amber-600";

    const handleViewJob = (job) => {
        navigate(`/recruiter/jobs/${job.id}`, {
            state: { job },
        });
    };

    const handleViewApplications = async (job) => {
        setSelectedJob(job);
        setShowApplications(true);
        setApplicationsLoading(true);
        setError("");

        try {
            const result = await getJobApplications(job.id);

            const applicationList = Array.isArray(result)
                ? result
                : result?.applications ||
                  result?.data?.applications ||
                  result?.data ||
                  [];

            const formattedApplications = applicationList.map(
                formatApplication
            );

            setRemoteApplications((current) => ({
                ...current,
                [job.id]: formattedApplications,
            }));
        } catch (loadError) {
            setError(
                loadError.response?.data?.message ||
                "Unable to load applications for this job."
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    const handleEdit = (job) => {
        setSelectedJob({ ...job });
        setShowEditModal(true);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setSelectedJob((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        if (!selectedJob) return;

        const category = categories.find(
            (item) => item.name === selectedJob.category
        );

        setSaving(true);
        setError("");

        try {
            const response = await updateJob(selectedJob.id, {
                title: selectedJob.title,
                categoryId:
                    category?.id || selectedJob.categoryId,
                location: selectedJob.location,
                jobType: selectedJob.type
                    .toUpperCase()
                    .replaceAll(" ", "_"),
                workMode: selectedJob.workMode
                    .toUpperCase()
                    .replaceAll(" ", "_"),
                status:
                    selectedJob.status === "Active"
                        ? "OPEN"
                        : "CLOSED",
                description: Array.isArray(
                    selectedJob.description
                )
                    ? selectedJob.description.join("\n")
                    : selectedJob.description,
            });

            const updatedJob = formatRecruiterJob(
                response.job
            );

            setJobs((previousJobs) =>
                previousJobs.map((job) =>
                    job.id === updatedJob.id
                        ? updatedJob
                        : job
                )
            );

            setShowEditModal(false);
            setSelectedJob(null);
        } catch (updateError) {
            setError(
                updateError.response?.data?.message ||
                "Unable to update this job."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedJob) return;

        setSaving(true);
        setError("");

        try {
            await deleteJobRequest(selectedJob.id);

            setJobs((previousJobs) =>
                previousJobs.filter(
                    (job) => job.id !== selectedJob.id
                )
            );

            setShowDeleteModal(false);
            setSelectedJob(null);
        } catch (deleteError) {
            setError(
                deleteError.response?.data?.message ||
                "Unable to delete this job."
            );
        } finally {
            setSaving(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");
        navigate("/recruiter/jobs");
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] w-full items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading your job postings...
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full max-w-none space-y-7 pb-10">
            {error && (
                <div
                    role="alert"
                    className="flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                >
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Page header */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Jobs
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your job postings and review
                        candidate applications.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/recruiter/post-job")
                    }
                    className="flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Post a Job
                </button>
            </section>

            {selectedCategory && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                    <div>
                        <p className="text-xs font-medium text-indigo-500">
                            Showing jobs in category
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-indigo-700">
                            {selectedCategory}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* Filters */}
            <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_200px_220px]">
                    <div className="relative min-w-0">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search jobs, skills, location..."
                            className={`${inputClass} pl-10`}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(event) => {
                            const value = event.target.value;

                            setCategoryFilter(value);

                            navigate(
                                value === "All"
                                    ? "/recruiter/jobs"
                                    : `/recruiter/jobs?category=${encodeURIComponent(
                                          value
                                      )}`
                            );
                        }}
                        className={inputClass}
                    >
                        <option value="All">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.name}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Job count */}
            <section className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                    {categoryFilter !== "All"
                        ? `${categoryFilter} Jobs`
                        : "Your Job Postings"}
                </h2>

                <p className="text-xs text-slate-400">
                    {filteredJobs.length}{" "}
                    {filteredJobs.length === 1 ? "job" : "jobs"} found
                </p>
            </section>

            {/* Three jobs per row on wide screens */}
            {filteredJobs.length > 0 ? (
                <section className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <article
                            key={job.id}
                            className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5"
                        >
                            {/* Card heading */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="break-words font-semibold leading-6 text-slate-900">
                                            {job.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {job.category}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                        job.status
                                    )}`}
                                >
                                    {job.status}
                                </span>
                            </div>

                            {/* Job information */}
                            <div className="mt-5 grid grid-cols-1 gap-3">
                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <MapPin
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />
                                    <span className="break-words">
                                        {job.location || "Location not specified"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <BriefcaseBusiness
                                        size={15}
                                        className="shrink-0 text-slate-400"
                                    />
                                    <span>{job.type}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Users
                                        size={15}
                                        className="shrink-0 text-slate-400"
                                    />
                                    <span>
                                        {job.applications} applications
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <CalendarDays
                                        size={15}
                                        className="shrink-0 text-slate-400"
                                    />
                                    <span>
                                        Posted {job.postedDate || "recently"}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-4 line-clamp-4 break-words text-sm leading-6 text-slate-500">
                                {job.description ||
                                    "No description provided."}
                            </p>

                            {/* Skills */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(job.skills || []).map(
                                    (skill, index) => (
                                        <span
                                            key={`${skill}-${index}`}
                                            className="max-w-full break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>

                            {/* Actions stay at the bottom */}
                            <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => handleViewJob(job)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Eye size={15} />
                                    View Job
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleViewApplications(job)
                                    }
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Users size={15} />
                                    Applications
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleEdit(job)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <Edit size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(job)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-2 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <section className="flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No jobs found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                        We couldn't find any jobs matching your
                        search or selected filters.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear filters
                    </button>
                </section>
            )}

            {/* Applications modal: candidate names and details only */}
            {showApplications && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="applications-title"
                        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-indigo-600">
                                    Candidate Applications
                                </p>

                                <h2
                                    id="applications-title"
                                    className="mt-1 break-words text-xl font-bold text-slate-900"
                                >
                                    {selectedJob.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review candidate names and
                                    available profile information.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close applications"
                                onClick={() => {
                                    setShowApplications(false);
                                    setSelectedJob(null);
                                }}
                                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                            {applicationsLoading ? (
                                <div className="py-16 text-center text-sm text-slate-500">
                                    Loading candidate details...
                                </div>
                            ) : selectedApplications.length > 0 ? (
                                <>
                                    <p className="mb-4 text-sm text-slate-500">
                                        {selectedApplications.length}{" "}
                                        {selectedApplications.length === 1
                                            ? "candidate"
                                            : "candidates"}
                                    </p>

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        {selectedApplications.map(
                                            (application) => (
                                                <CandidateDetails
                                                    key={application.id}
                                                    application={application}
                                                />
                                            )
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <Users
                                        size={35}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No applications yet
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        No candidates have applied
                                        for this job yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* Edit job modal */}
            {showEditModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
                    <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Hiring Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Edit Job
                                </h2>
                            </div>

                            <button
                                type="button"
                                aria-label="Close edit job"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={selectedJob.title || ""}
                                    onChange={handleEditChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={selectedJob.category || ""}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.name}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={selectedJob.status}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                    >
                                        <option value="Active">
                                            Active
                                        </option>
                                        <option value="Closed">
                                            Closed
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={selectedJob.location || ""}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Job Type
                                    </label>

                                    <select
                                        name="type"
                                        value={selectedJob.type || "Full Time"}
                                        onChange={handleEditChange}
                                        className={inputClass}
                                    >
                                        <option value="Full Time">
                                            Full Time
                                        </option>
                                        <option value="Part Time">
                                            Part Time
                                        </option>
                                        <option value="Contract">
                                            Contract
                                        </option>
                                        <option value="Internship">
                                            Internship
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Work Mode
                                </label>

                                <select
                                    name="workMode"
                                    value={selectedJob.workMode || "Hybrid"}
                                    onChange={handleEditChange}
                                    className={inputClass}
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Onsite">Onsite</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={Array.isArray(selectedJob.description)
                                        ? selectedJob.description.join("\n")
                                        : selectedJob.description || ""}
                                    onChange={handleEditChange}
                                    rows={5}
                                    className={`${inputClass} resize-y leading-6`}
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedJob(null);
                                    }}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={handleSaveEdit}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* Delete confirmation modal */}
            {showDeleteModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
                    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-slate-900">
                            Delete this job?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-700">
                                {selectedJob.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Deleting..." : "Delete Job"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default Jobs;
