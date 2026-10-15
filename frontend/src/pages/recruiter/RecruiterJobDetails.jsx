
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit3,
    MapPin,
    Users,
    Wallet,
    Laptop,
    FileText,
    GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJob } from "../../services/jobService";
import { getJobApplications } from "../../services/applicationService";

const RecruiterJobDetails = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [loadedJobId, setLoadedJobId] = useState(null);
    const [error, setError] = useState("");
    const loading = loadedJobId !== jobId;

    useEffect(() => {
        let active = true;

        setError("");
        setJob(null);

        Promise.all([
            getJob(jobId),
            getJobApplications(jobId),
        ])
            .then(([jobDetails, applications]) => {
                if (!active) return;

                setJob({
                    ...jobDetails,
                    applicants: Array.isArray(applications)
                        ? applications.length
                        : 0,
                });
            })
            .catch((loadError) => {
                if (!active) return;

                setError(
                    loadError?.response?.data?.message ||
                    "Unable to load this job."
                );
            })
            .finally(() => {
                if (active) {
                    setLoadedJobId(jobId);
                }
            });

        return () => {
            active = false;
        };
    }, [jobId]);

    const handleBack = () => {
        navigate("/recruiter/jobs");
    };

    const handleEditJob = () => {
        navigate("/recruiter/jobs", {
            state: { editJobId: Number(jobId) },
        });
    };

    const handleViewApplications = () => {
        navigate(`/recruiter/jobs/${jobId}/applications`);
    };

    const formatLabel = (value) => {
        if (!value) return "Not specified";

        return String(value)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatExperience = () => {
        if (!job) return "Not specified";

        const min = Number(job.experienceMin || 0);
        const max = job.experienceMax;

        if (max === null || max === undefined) {
            return `${min}+ years`;
        }

        if (min === Number(max)) {
            return `${min} years`;
        }

        return `${min}–${max} years`;
    };

    const formatSalary = () => {
        if (
            (job?.minSalary == null || job.minSalary === "") &&
            (job?.maxSalary == null || job.maxSalary === "")
        ) {
            return "Not disclosed";
        }

        const formatAmount = (amount) =>
            `₹${Number(amount).toLocaleString("en-IN")}`;

        const min =
            job.minSalary != null && job.minSalary !== ""
                ? formatAmount(job.minSalary)
                : "";

        const max =
            job.maxSalary != null && job.maxSalary !== ""
                ? formatAmount(job.maxSalary)
                : "";

        if (min && max) return `${min} – ${max}`;
        return min || max;
    };

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not specified";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const toList = (value) => {
        if (Array.isArray(value)) {
            return value
                .map((item) =>
                    typeof item === "string"
                        ? item.trim()
                        : item?.name || item?.title || ""
                )
                .filter(Boolean);
        }

        if (typeof value === "string") {
            return value
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    const handleExternalLink = (url) => {
        if (!url) return;

        const formattedUrl = /^https?:\/\//i.test(url)
            ? url
            : `https://${url}`;

        window.open(formattedUrl, "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <div className="w-full space-y-6 pb-8">
                <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

                <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-7">
                    <div className="h-5 w-32 rounded bg-slate-200" />
                    <div className="mt-4 h-9 max-w-md rounded bg-slate-200" />
                    <div className="mt-4 h-4 max-w-sm rounded bg-slate-100" />

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-24 rounded-2xl bg-slate-100"
                            />
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="h-[500px] animate-pulse rounded-3xl bg-white" />
                    <div className="h-80 animate-pulse rounded-3xl bg-white" />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex min-h-[65vh] w-full items-center justify-center px-4">
                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Unable to open job details
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error ||
                            "This job may have been removed or is no longer available."}
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <ArrowLeft size={17} />
                        Back to My Jobs
                    </button>
                </div>
            </div>
        );
    }

    const responsibilities = toList(job.responsibilities);
    const requirements = toList(job.requirements);
    const skills = toList(job.skills);

    const companyName = job.company?.name || "Company not specified";
    const jobType = formatLabel(job.jobType);
    const workMode = formatLabel(job.workMode);
    const applicants = job.applicants || 0;

    const isDeadlinePassed =
        job.applicationDeadline &&
        new Date(job.applicationDeadline).getTime() < Date.now();

    const StatCard = ({ icon: Icon, label, value, detail }) => (
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                    {detail && (
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            {detail}
                        </p>
                    )}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={19} />
                </div>
            </div>
        </div>
    );

    const ContentSection = ({ icon: Icon, title, children, count }) => (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                        <Icon size={19} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                            {title}
                        </h2>
                        {count !== undefined && (
                            <p className="mt-0.5 text-xs text-slate-400">
                                {count} {count === 1 ? "item" : "items"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-5">{children}</div>
        </section>
    );

    const DetailRow = ({ label, value }) => (
        <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="max-w-[60%] break-words text-right text-sm font-semibold text-slate-800">
                {value || "Not specified"}
            </span>
        </div>
    );

    return (
        <div className="min-h-full w-full space-y-6 pb-8">
            {/* Breadcrumb and navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 font-medium text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        My Jobs
                    </button>

                    <span className="text-slate-300">/</span>

                    <span className="font-medium text-slate-800">
                        Job Details
                    </span>
                </div>

                <span className="text-xs text-slate-400">
                    Job ID: #{job.id || jobId}
                </span>
            </div>

            {/* Main job header */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-indigo-600" />

                <div className="p-5 sm:p-8 xl:p-9">
                    <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-start">
                        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 sm:h-[72px] sm:w-[72px]">
                                <Building2 size={30} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                        {job.category?.name || "Job Opportunity"}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            isDeadlinePassed
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-emerald-50 text-emerald-700"
                                        }`}
                                    >
                                        {isDeadlinePassed
                                            ? "Deadline passed"
                                            : "Recruitment listing"}
                                    </span>
                                </div>

                                <h1 className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl xl:text-4xl">
                                    {job.title || "Untitled Position"}
                                </h1>

                                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-600 sm:text-base">
                                    <Building2 size={16} className="shrink-0 text-slate-400" />
                                    {companyName}
                                    {job.company?.location && (
                                        <>
                                            <span className="text-slate-300">·</span>
                                            <span>{job.company.location}</span>
                                        </>
                                    )}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 sm:text-sm">
                                        <MapPin size={15} className="text-slate-400" />
                                        {job.location || "Location not specified"}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 sm:text-sm">
                                        <BriefcaseBusiness size={15} className="text-slate-400" />
                                        {jobType}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 sm:text-sm">
                                        <Laptop size={15} className="text-slate-400" />
                                        {workMode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:min-w-48 xl:flex-col">
                            <button
                                type="button"
                                onClick={handleViewApplications}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            >
                                <Users size={17} />
                                View Applications
                                <ArrowRight size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={handleEditJob}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <Edit3 size={16} />
                                Edit Job
                            </button>
                        </div>
                    </div>

                    {/* Quick information */}
                    <div className="mt-8 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            icon={Users}
                            label="Total Applicants"
                            value={applicants}
                            detail="Applications received for this job"
                        />

                        <StatCard
                            icon={Wallet}
                            label="Salary Range"
                            value={formatSalary()}
                            detail="Compensation offered"
                        />

                        <StatCard
                            icon={GraduationCap}
                            label="Experience Required"
                            value={formatExperience()}
                            detail="Expected experience level"
                        />

                        <StatCard
                            icon={CalendarDays}
                            label="Application Deadline"
                            value={formatDate(job.applicationDeadline)}
                            detail={isDeadlinePassed ? "Deadline has passed" : "Last date to apply"}
                        />
                    </div>
                </div>
            </section>

            {/* Main content and sidebar */}
            <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <main className="min-w-0 space-y-6">
                    {/* Description */}
                    <ContentSection icon={FileText} title="Job Description">
                        {job.description ? (
                            <div className="space-y-4">
                                {String(job.description)
                                    .split(/\r?\n/)
                                    .filter((paragraph) => paragraph.trim())
                                    .map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 sm:text-[15px]"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm leading-7 text-slate-400">
                                No description has been provided for this position.
                            </p>
                        )}
                    </ContentSection>

                    {/* Responsibilities */}
                    <ContentSection
                        icon={CheckCircle2}
                        title="Key Responsibilities"
                        count={responsibilities.length}
                    >
                        {responsibilities.length > 0 ? (
                            <ul className="space-y-4">
                                {responsibilities.map((item, index) => (
                                    <li
                                        key={`${index}-${item}`}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 size={14} />
                                        </span>
                                        <p className="break-words text-sm leading-6 text-slate-600">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm leading-6 text-slate-400">
                                No responsibilities have been added to this job listing.
                            </p>
                        )}
                    </ContentSection>

                    {/* Requirements */}
                    <ContentSection
                        icon={GraduationCap}
                        title="Requirements & Qualifications"
                        count={requirements.length}
                    >
                        {requirements.length > 0 ? (
                            <ul className="space-y-4">
                                {requirements.map((item, index) => (
                                    <li
                                        key={`${index}-${item}`}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                        <p className="break-words text-sm leading-6 text-slate-600">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm leading-6 text-slate-400">
                                No specific requirements have been added.
                            </p>
                        )}
                    </ContentSection>

                    {/* Skills */}
                    <ContentSection
                        icon={BriefcaseBusiness}
                        title="Required Skills"
                        count={skills.length}
                    >
                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3.5 py-2 text-sm font-medium text-indigo-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm leading-6 text-slate-400">
                                No specific skills have been listed for this position.
                            </p>
                        )}
                    </ContentSection>
                </main>

                {/* Sidebar */}
                <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
                    {/* Application management */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Users size={21} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Applications
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Candidate management
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="text-sm leading-6 text-slate-500">
                                Review applicants, evaluate their profiles, and manage their progress through your hiring process.
                            </p>

                            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Applications received
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {applicants}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                    <Users size={20} />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleViewApplications}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Manage Applications
                                <ArrowRight size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={handleEditJob}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Edit3 size={16} />
                                Edit Job Posting
                            </button>
                        </div>
                    </section>

                    {/* Company information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Company Information
                        </p>

                        <div className="mt-5 flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-indigo-600">
                                <Building2 size={22} />
                            </div>

                            <div className="min-w-0">
                                <h3 className="break-words font-bold text-slate-900">
                                    {companyName}
                                </h3>

                                {job.company?.location && (
                                    <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                                        <MapPin size={14} className="mt-0.5 shrink-0" />
                                        {job.company.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {job.company?.description && (
                            <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-500">
                                {job.company.description}
                            </p>
                        )}

                        {job.company?.website && (
                            <button
                                type="button"
                                onClick={() => handleExternalLink(job.company.website)}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                            >
                                Visit company website
                                <ArrowRight size={15} />
                            </button>
                        )}

                        {!job.company?.description &&
                            !job.company?.location &&
                            !job.company?.website && (
                                <p className="mt-4 text-xs leading-5 text-slate-400">
                                    Additional company information has not been provided.
                                </p>
                            )}
                    </section>

                    {/* Job information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                                <BriefcaseBusiness size={19} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Job Information
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Posting overview
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4 divide-y divide-slate-100">
                            <div className="pb-4">
                                <DetailRow label="Work mode" value={workMode} />
                            </div>

                            <div className="pb-4">
                                <DetailRow label="Job type" value={jobType} />
                            </div>

                            <div className="pb-4">
                                <DetailRow
                                    label="Experience"
                                    value={formatExperience()}
                                />
                            </div>

                            <div className="pb-4">
                                <DetailRow
                                    label="Posted on"
                                    value={formatDate(job.createdAt)}
                                />
                            </div>

                            <div>
                                <DetailRow
                                    label="Application deadline"
                                    value={formatDate(job.applicationDeadline)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Helpful reminder */}
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                                <Clock3 size={18} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Hiring tip
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Review applications regularly and keep candidate statuses updated to maintain an organized hiring process.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RecruiterJobDetails;
