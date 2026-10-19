
import {
    BriefcaseBusiness,
    CalendarDays,
    Edit,
    Eye,
    MapPin,
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
import { getJobApplications } from "../../services/applicationService";
import {
    deleteJob as deleteJobRequest,
    formatJobCard,
    getJobCategories,
    getMyJobs,
    updateJob,
} from "../../services/jobService";
import { getSkills } from "../../services/skillService";
import Pagination, { usePagination } from "../../components/Pagination.jsx";

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
    const [skillCatalog, setSkillCatalog] = useState([]);
    const [remoteApplications, setRemoteApplications] = useState({});
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load only the logged-in recruiter's jobs and available categories.
    useEffect(() => {
        let active = true;

        Promise.all([getMyJobs(), getJobCategories(), getSkills()])
            .then(([myJobs, jobCategories, availableSkills]) => {
                if (!active) return;

                setJobs(myJobs.map(formatRecruiterJob));
                setCategories(jobCategories);
                setSkillCatalog(availableSkills);
                setError("");
            })
            .catch((loadError) => {
                if (!active) return;

                setJobs([]);
                setError(
                    loadError.response?.data?.message ||
                    "Unable to load your job postings."
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // Open the edit modal when navigating here with an editJobId.
    useEffect(() => {
        const editJobId = location.state?.editJobId;

        if (loading || !editJobId) return;

        const selected = jobs.find(
            (job) => job.id === Number(editJobId)
        );

        if (selected) handleEdit(selected);

        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, [jobs, loading, location.pathname, location.state, navigate]);

    // Search and filter the recruiter's jobs.
    const filteredJobs = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return jobs.filter((job) => {
            const matchesSearch =
                (job.title || "").toLowerCase().includes(searchValue) ||
                (job.category || "").toLowerCase().includes(searchValue) ||
                (job.location || "").toLowerCase().includes(searchValue) ||
                (job.type || "").toLowerCase().includes(searchValue) ||
                (job.skills || []).some((skill) =>
                    skill.toLowerCase().includes(searchValue)
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
    const { pageItems: pageJobs, currentPage, setCurrentPage, pageCount } =
        usePagination(filteredJobs, JSON.stringify([search, statusFilter, categoryFilter]));

    const getStatusClasses = (status) => {
        if (status === "Active") {
            return "bg-green-50 text-green-600";
        }

        return "bg-slate-100 text-slate-500";
    };

    // Display only real applications returned by the backend.
    const selectedApplications = selectedJob
        ? remoteApplications[selectedJob.id] || []
        : [];
    const applicationPagination = usePagination(
        selectedApplications,
        selectedJob?.id || "no-job-selected"
    );

    const handleViewJob = (job) => {
        navigate(`/recruiter/jobs/${job.id}`, {
            state: { job },
        });
    };

    // Fetch applications for the selected job.
    const handleViewApplications = async (job) => {
        setSelectedJob(job);
        setShowApplications(true);
        setApplicationsLoading(true);
        setError("");

        try {
            const result = await getJobApplications(job.id);

            setRemoteApplications((current) => ({
                ...current,
                [job.id]: result.map((application) => ({
                    id: application.id,
                    name:
                        application.candidate?.user?.name ||
                        "Candidate",
                    email:
                        application.candidate?.user?.email ||
                        "Email not available",
                })),
            }));
        } catch (loadError) {
            setRemoteApplications((current) => ({
                ...current,
                [job.id]: [],
            }));

            setError(
                loadError.response?.data?.message ||
                "Unable to load applications for this job."
            );
        } finally {
            setApplicationsLoading(false);
        }
    };

    const handleEdit = (job) => {
        setSelectedJob({
            ...job,
            minSalary: job.minSalary ?? "",
            maxSalary: job.maxSalary ?? "",
            experienceMin: job.experienceMin ?? 0,
            experienceMax: job.experienceMax ?? "",
            deadline: job.applicationDeadline
                ? String(job.applicationDeadline).slice(0, 10)
                : "",
            responsibilities: Array.isArray(job.responsibilities)
                ? job.responsibilities.join("\n")
                : job.responsibilities || "",
            requirements: Array.isArray(job.requirements)
                ? job.requirements.join("\n")
                : job.requirements || "",
            skills: job.skills || [],
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setSelectedJob((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        const category = categories.find(
            (item) => item.name === selectedJob.category
        );

        try {
            const response = await updateJob(selectedJob.id, {
                title: selectedJob.title,
                categoryId: category?.id || selectedJob.categoryId,
                location: selectedJob.location,
                jobType: selectedJob.type
                    .toUpperCase()
                    .replaceAll(" ", "_"),
                workMode: (selectedJob.workMode || "Hybrid")
                    .toUpperCase()
                    .replaceAll("-", "")
                    .replaceAll(" ", "_"),
                status: ({ Active: "OPEN", Closed: "CLOSED", Draft: "DRAFT" })[
                    selectedJob.status
                ] || selectedJob.status,
                description: Array.isArray(selectedJob.description)
                    ? selectedJob.description.join("\n")
                    : selectedJob.description,
                responsibilities: selectedJob.responsibilities || "",
                requirements: selectedJob.requirements || "",
                minSalary: selectedJob.minSalary === "" ? null : Number(selectedJob.minSalary),
                maxSalary: selectedJob.maxSalary === "" ? null : Number(selectedJob.maxSalary),
                experienceMin: Number(selectedJob.experienceMin || 0),
                experienceMax: selectedJob.experienceMax === ""
                    ? null
                    : Number(selectedJob.experienceMax),
                applicationDeadline: selectedJob.deadline || null,
                skillIds: skillCatalog
                    .filter((skill) => selectedJob.skills.includes(skill.name))
                    .map((skill) => skill.id),
            });

            const updatedJob = formatRecruiterJob(response.job);

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === updatedJob.id ? updatedJob : job
                )
            );

            setError("");
            setShowEditModal(false);
            setSelectedJob(null);
        } catch (updateError) {
            setError(
                updateError.response?.data?.message ||
                "Unable to update this job."
            );
        }
    };

    const handleDelete = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteJobRequest(selectedJob.id);

            setJobs((prevJobs) =>
                prevJobs.filter(
                    (job) => job.id !== selectedJob.id
                )
            );

            setRemoteApplications((current) => {
                const updated = { ...current };
                delete updated[selectedJob.id];
                return updated;
            });

            setShowDeleteModal(false);
            setSelectedJob(null);
            setError("");
        } catch (deleteError) {
            setError(
                deleteError.response?.data?.message ||
                "Unable to delete this job."
            );
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
        <div className="w-full min-w-0 space-y-7">
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Jobs
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your job postings and view candidate applications.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/recruiter/post-job")}
                    className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Post a Job
                </button>
            </section>

            {/* Selected Category */}
            {selectedCategory && (
                <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
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

            {/* Search and Filters */}
            <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_180px_200px]">
                    <div className="relative min-w-0">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs, skills, location..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            const value = e.target.value;

                            setCategoryFilter(value);

                            if (value === "All") {
                                navigate("/recruiter/jobs");
                            } else {
                                navigate(
                                    `/recruiter/jobs?category=${encodeURIComponent(value)}`
                                );
                            }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">All Categories</option>

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

            {/* Job Count */}
            <section className="flex items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        {categoryFilter !== "All"
                            ? `${categoryFilter} Jobs`
                            : "Your Job Postings"}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {filteredJobs.length}{" "}
                        {filteredJobs.length === 1 ? "job" : "jobs"} found
                    </p>
                </div>

                {(search ||
                    statusFilter !== "All" ||
                    categoryFilter !== "All") && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear filters
                    </button>
                )}
            </section>

            {/* Responsive Job Grid: 3 jobs per row on large screens */}
            {filteredJobs.length > 0 ? (
                <>
                    <section className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {pageJobs.map((job) => (
                        <article
                            key={job.id}
                            className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="break-words font-semibold leading-5 text-slate-900">
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

                            {/* Job Information */}
                            <div className="mt-5 grid grid-cols-1 gap-3">
                                <div className="flex min-w-0 items-start gap-2 text-xs text-slate-500">
                                    <MapPin
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />
                                    <span className="break-words">
                                        {job.location || "Location not specified"}
                                    </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <BriefcaseBusiness
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />
                                    <span>{job.type}</span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <Users
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />
                                    <span>
                                        {job.applications} applications
                                    </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <CalendarDays
                                        size={15}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />
                                    <span>Posted {job.postedDate || "N/A"}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-5 line-clamp-4 break-words text-sm leading-6 text-slate-500">
                                {job.description || "No description provided."}
                            </p>

                            {/* Skills */}
                            {job.skills?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {job.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Actions stay at the bottom of each card */}
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
                                    onClick={() => handleViewApplications(job)}
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
                                    <Edit size={14} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(job)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-2 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                    </section>
                    <Pagination totalItems={filteredJobs.length} currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No jobs found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                        We couldn't find any jobs matching your search or
                        selected filters.
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

            {/* Applications Modal: Candidate name and email only */}
            {showApplications && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4">
                    <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Applications
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedJob.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Candidate names and email addresses
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowApplications(false);
                                    setSelectedJob(null);
                                    setApplicationsLoading(false);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close applications"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6">
                            {applicationsLoading ? (
                                <p className="py-10 text-center text-sm text-slate-500">
                                    Loading applications...
                                </p>
                            ) : selectedApplications.length > 0 ? (
                                <>
                                <div className="space-y-3">
                                    {applicationPagination.pageItems.map((application) => (
                                        <div
                                            key={application.id}
                                            className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                <Users size={18} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="break-words text-sm font-semibold text-slate-900">
                                                    {application.name}
                                                </h3>

                                                <p className="mt-1 break-all text-sm text-slate-500">
                                                    {application.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Pagination
                                    totalItems={selectedApplications.length}
                                    currentPage={applicationPagination.currentPage}
                                    pageCount={applicationPagination.pageCount}
                                    onPageChange={applicationPagination.setCurrentPage}
                                />
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <Users
                                        size={35}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No applications yet
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        No candidates have applied for this job yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {showEditModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4">
                    <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close edit modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Draft">Draft</option>
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
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Onsite">Onsite</option>
                                </select>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Minimum Experience (years)</label>
                                    <input type="number" min="0" max="99" name="experienceMin" value={selectedJob.experienceMin ?? 0} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Maximum Experience (years, optional)</label>
                                    <input type="number" min="0" max="99" name="experienceMax" value={selectedJob.experienceMax ?? ""} onChange={handleEditChange} placeholder="No maximum" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Minimum Salary (annual, ₹)</label>
                                    <input type="number" min="1" name="minSalary" value={selectedJob.minSalary ?? ""} onChange={handleEditChange} placeholder="Not disclosed" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Maximum Salary (annual, ₹)</label>
                                    <input type="number" min="1" name="maxSalary" value={selectedJob.maxSalary ?? ""} onChange={handleEditChange} placeholder="Not disclosed" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Application Deadline</label>
                                    <input type="date" name="deadline" value={selectedJob.deadline || ""} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        Array.isArray(selectedJob.description)
                                            ? selectedJob.description.join("\n")
                                            : selectedJob.description || ""
                                    }
                                    onChange={handleEditChange}
                                    rows={5}
                                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Key Responsibilities</label>
                                <textarea name="responsibilities" value={selectedJob.responsibilities || ""} onChange={handleEditChange} rows={5} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Requirements & Qualifications</label>
                                <textarea name="requirements" value={selectedJob.requirements || ""} onChange={handleEditChange} rows={6} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Required Skills</label>
                                <select
                                    multiple
                                    value={selectedJob.skills || []}
                                    onChange={(event) => setSelectedJob((prev) => ({
                                        ...prev,
                                        skills: Array.from(event.target.selectedOptions, (option) => option.value),
                                    }))}
                                    className="min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    {skillCatalog.map((skill) => <option key={skill.id} value={skill.name}>{skill.name}</option>)}
                                </select>
                                <p className="mt-1 text-xs text-slate-400">Select multiple skills with Ctrl (Windows) or Command (Mac).</p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedJob(null);
                                    }}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4">
                    <div className="w-full max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl">
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
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
