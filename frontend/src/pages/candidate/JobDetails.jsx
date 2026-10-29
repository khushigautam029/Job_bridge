import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getApplications } from "../../services/applicationService";
import { getJob } from "../../services/jobService";
import {
    isJobSaved,
    saveJob,
    unsaveJob,
} from "../../services/savedJobService";

const JobDetails = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [loadedJobId, setLoadedJobId] = useState(null);
    const loading = loadedJobId !== jobId;
    const [error, setError] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        let active = true;

        // Load job details
        getJob(jobId)
            .then((selectedJob) => {
                if (!active) return;

                setJob({
                    ...selectedJob,
                    responsibilities: selectedJob.responsibilities
                        ? selectedJob.responsibilities
                            .split("\n")
                            .filter(Boolean)
                        : [],
                    requirements: selectedJob.requirements
                        ? selectedJob.requirements
                            .split("\n")
                            .filter(Boolean)
                        : [],
                    skills: (selectedJob.skills || []).map(
                        (skill) =>
                            typeof skill === "string"
                                ? skill
                                : skill.name
                    ),
                });

                setError("");
            })
            .catch((loadError) => {
                if (active) {
                    setJob(null);
                    const errorMessage =
                        loadError.response?.data?.message ||
                        "This job could not be found.";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            })
            .finally(() => {
                if (active) {
                    setLoadedJobId(jobId);
                }
            });

        const isAuthenticated = Boolean(
            localStorage.getItem("token") ||
            sessionStorage.getItem("token")
        );

        if (isAuthenticated) {
            // Check whether the job is saved
            isJobSaved(jobId)
                .then((saved) => {
                    if (active) {
                        setIsSaved(saved);
                    }
                })
                .catch((loadError) => {
                    if (active) {
                        const errorMessage =
                            loadError.response?.data?.message ||
                            "Unable to check whether this job is saved.";

                        setError(errorMessage);
                        toast.error(errorMessage);
                    }
                });

            // Check whether the candidate has applied
            getApplications()
                .then((applications) => {
                    if (active) {
                        setIsApplied(
                            applications.some(
                                (application) =>
                                    String(application.jobId) ===
                                    String(jobId) &&
                                    application.status !== "WITHDRAWN"
                            )
                        );
                    }
                })
                .catch((loadError) => {
                    if (active) {
                        const errorMessage =
                            loadError.response?.data?.message ||
                            "Unable to load your applications.";

                        setError(errorMessage);
                        toast.error(errorMessage);
                    }
                });
        } else {
            setIsSaved(false);
            setIsApplied(false);
        }

        return () => {
            active = false;
        };
    }, [jobId]);

    const isAuthenticated = Boolean(
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );


    const toggleSavedJob = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to save jobs.");
            navigate("/login");
            return;
        }

        if (!job) return;

        try {
            setError("");

            if (isSaved) {
                await unsaveJob(job.id);
                setIsSaved(false);

                toast.success("Job removed from saved jobs.");
            } else {
                await saveJob(job.id);
                setIsSaved(true);

                toast.success("Job saved successfully!");
            }
        } catch (requestError) {
            const errorMessage =
                requestError.response?.data?.message ||
                "Unable to update saved jobs.";

            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    // Format enum values for display
    const formatText = (value) => {
        if (!value) return "Not specified";

        return String(value)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    // Direct Hiring / Consultancy Hiring badge
    const getHiringInfo = (companyType) => {
        const type = String(companyType || "").toUpperCase();

        if (type === "DIRECT") {
            return {
                label: "Direct Hiring",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
            };
        }

        if (type === "CONSULTANCY") {
            return {
                label: "Consultancy Hiring",
                className:
                    "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
            };
        }

        return null;
    };

    const hiringInfo = getHiringInfo(
        job?.company?.companyType || job?.companyType
    );

    // Format experience
    const formatExperience = () => {
        if (!job) return "Not specified";

        const min = Number(job.experienceMin || 0);
        const max = job.experienceMax;

        if (max === null || max === undefined) {
            return `${min}+ Years`;
        }

        if (min === max) {
            return `${min} Years`;
        }

        return `${min} - ${max} Years`;
    };

    // Format salary
    const formatSalary = () => {
        if (!job?.minSalary && !job?.maxSalary) {
            return "Salary not disclosed";
        }

        const min = job.minSalary
            ? `₹${Number(job.minSalary).toLocaleString("en-IN")}`
            : "";

        const max = job.maxSalary
            ? `₹${Number(job.maxSalary).toLocaleString("en-IN")}`
            : "";

        if (min && max) {
            return `${min} - ${max}`;
        }

        return min || max;
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Calculate when the job was posted
    const getDaysAgo = (date) => {
        if (!date) return "";

        const postedDate = new Date(date);
        const today = new Date();

        const difference =
            today.getTime() - postedDate.getTime();

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        if (days <= 0) {
            return "Posted today";
        }

        if (days === 1) {
            return "Posted 1 day ago";
        }

        return `Posted ${days} days ago`;
    };

    // Display description paragraphs
    const formatDescription = (text) => {
        if (!text) {
            return (
                <p className="text-sm leading-7 text-slate-500">
                    No description has been provided for this
                    position.
                </p>
            );
        }

        return text.split("\n").map((paragraph, index) => (
            <p
                key={index}
                className="mb-4 text-sm leading-7 text-slate-600 last:mb-0"
            >
                {paragraph}
            </p>
        ));
    };

    // Apply for the job
    const handleApply = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (job) {
            navigate(`/candidate/jobs/${job.id}/apply`);
        }
    };

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-full bg-slate-50">
                <div className="p-5 sm:p-6 lg:p-7">
                    <div className="animate-pulse space-y-6">
                        <div className="h-5 w-32 rounded bg-slate-200" />

                        <div className="h-64 rounded-3xl bg-white" />

                        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                            <div className="h-[500px] rounded-2xl bg-white" />
                            <div className="h-80 rounded-2xl bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error screen
    if (error || !job) {
        return (
            <div className="flex min-h-full items-center justify-center bg-slate-50 px-5 py-10">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <BriefcaseBusiness size={22} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Job not found
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error ||
                            "This job may have been removed or is no longer available."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/candidate/jobs")}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <ArrowLeft size={17} />
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const responsibilities = job.responsibilities || [];
    const requirements = job.requirements || [];
    const skills = job.skills || [];

    return (
        <div className="min-h-full bg-slate-50 text-slate-800">
            <main className="w-full px-5 py-6 sm:px-6 lg:px-7">
                {/* Back Navigation */}
                <div className="mb-5">
                    <button
                        type="button"
                        onClick={() => navigate("/candidate/jobs")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Jobs
                    </button>
                </div>

                {/* Job Header */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        {/* Company and Job Details */}
                        <div className="flex min-w-0 gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Building2 size={26} />
                            </div>

                            <div className="min-w-0">
                                {/* Category, Status and Hiring Type */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium text-indigo-600">
                                        {job.category?.name ||
                                            "Job Opportunity"}
                                    </p>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${job.status === "OPEN"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {job.status === "OPEN" ? "Open" : "Closed"}
                                    </span>

                                    {hiringInfo && (
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${hiringInfo.className}`}
                                        >
                                            {hiringInfo.label}
                                        </span>
                                    )}
                                </div>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    {job.title}
                                </h1>

                                <p className="mt-2 text-sm font-medium text-slate-600">
                                    {job.company?.name || "Company"}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.location ||
                                            "Location not specified"}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <BriefcaseBusiness size={16} />
                                        {formatText(job.jobType)}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <Clock3 size={16} />
                                        {formatText(job.workMode)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Save Job */}
                        <button
                            type="button"
                            onClick={toggleSavedJob}
                            className={`flex shrink-0 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${isSaved
                                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                : "border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                        >
                            {isSaved ? (
                                <BookmarkCheck size={17} />
                            ) : (
                                <Bookmark size={17} />
                            )}

                            {isSaved ? "Saved" : "Save Job"}
                        </button>
                    </div>

                    {/* Job Stats */}
                    <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-6">
                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Salary
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatSalary()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Experience
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatExperience()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Job Type
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatText(job.jobType)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Openings Remaining
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {Number(job.remainingOpenings ?? job.totalOpenings ?? 1)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Applicants
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {job.applicants || 0}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Deadline
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(job.applicationDeadline)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content and Sidebar */}
                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
                    {/* Main Content */}
                    <div className="space-y-5">
                        {/* Description */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">
                                Job Description
                            </h2>

                            <div className="mt-4">
                                {formatDescription(job.description)}
                            </div>
                        </section>

                        {/* Responsibilities */}
                        {responsibilities.length > 0 && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Responsibilities
                                </h2>

                                <div className="mt-4 space-y-3">
                                    {responsibilities.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-indigo-600"
                                                />

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {item}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Requirements */}
                        {requirements.length > 0 && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Requirements
                                </h2>

                                <div className="mt-4 space-y-3">
                                    {requirements.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-indigo-600"
                                                />

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {item}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Required Skills
                                </h2>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-5">
                        {/* Apply Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">
                                {isApplied
                                    ? "Application Submitted"
                                    : job.status === "OPEN"
                                        ? "Interested in this job?"
                                        : "Applications are closed"}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {isApplied
                                    ? "Your application has been recorded. The recruiter will review your profile."
                                    : job.status === "OPEN"
                                        ? "Submit your application and take the next step in your career."
                                        : "This job is no longer accepting applications."}
                            </p>

                            {isApplied ? (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 flex w-full cursor-default items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white"
                                >
                                    <CheckCircle2 size={17} />
                                    Applied
                                </button>
                            ) : job.status === "OPEN" ? (
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Apply Now
                                    <ArrowRight size={17} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-500"
                                >
                                    Applications Closed
                                </button>
                            )}

                            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <CalendarDays
                                        size={17}
                                        className="text-slate-400"
                                    />
                                    <span>
                                        {getDaysAgo(job.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <Users
                                        size={17}
                                        className="text-slate-400"
                                    />
                                    <span>
                                        {job.applicants || 0} applicants
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                About the company
                            </p>

                            <div className="mt-4 flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Building2 size={20} />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-800">
                                        {job.company?.name || "Company"}
                                    </p>

                                    {job.company?.location && (
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {job.company.location}
                                        </p>
                                    )}

                                    {/* Hiring Type Badge */}
                                    {hiringInfo && (
                                        <span
                                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${hiringInfo.className}`}
                                        >
                                            {hiringInfo.label}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {job.company?.description && (
                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                    {job.company.description}
                                </p>
                            )}

                            {job.company?.website && (
                                <a
                                    href={job.company.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    Visit company website →
                                </a>
                            )}
                        </div>

                        {/* Quick Job Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Job Information
                            </p>

                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Category
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {job.category?.name ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Work Mode
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {formatText(job.workMode)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Application Deadline
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {formatDate(
                                            job.applicationDeadline
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default JobDetails;
