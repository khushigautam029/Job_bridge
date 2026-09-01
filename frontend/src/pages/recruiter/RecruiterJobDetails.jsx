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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const jobs = [
    {
        id: 1,
        title: "Senior React Developer",

        company: {
            id: 1,
            name: "TechNova Solutions",
            location: "Delhi, India",
            description:
                "TechNova Solutions is a technology company building modern digital products and scalable software solutions.",
            website: "https://technova.example.com",
        },

        category: {
            id: 1,
            name: "Software Development",
        },

        location: "Delhi, India",
        jobType: "FULL_TIME",
        workMode: "HYBRID",

        minSalary: 800000,
        maxSalary: 1400000,

        experienceMin: 3,
        experienceMax: 5,

        applicationDeadline: "2026-09-30",
        createdAt: "2026-08-29",

        description:
            "We are looking for an experienced React Developer to join our engineering team and help us build modern, scalable and user-friendly web applications.",

        responsibilities: [
            "Build and maintain modern React applications.",
            "Develop reusable and scalable UI components.",
            "Collaborate with designers and backend developers.",
            "Improve application performance and user experience.",
            "Write clean, maintainable and well-tested code.",
        ],

        requirements: [
            "3+ years of experience with React.",
            "Strong knowledge of JavaScript and TypeScript.",
            "Experience working with REST APIs.",
            "Good understanding of responsive design.",
            "Experience with Git and modern development workflows.",
        ],

        skills: [
            "React",
            "JavaScript",
            "TypeScript",
            "Node.js",
            "REST API",
        ],

        applicants: 42,
    },

    {
        id: 2,
        title: "Backend Developer",

        company: {
            id: 2,
            name: "CloudCore Technologies",
            location: "Bangalore, India",
            description:
                "CloudCore Technologies builds cloud-based platforms and enterprise software solutions.",
            website: "https://cloudcore.example.com",
        },

        category: {
            id: 2,
            name: "Backend Development",
        },

        location: "Bangalore, India",
        jobType: "FULL_TIME",
        workMode: "ONSITE",

        minSalary: 700000,
        maxSalary: 1200000,

        experienceMin: 2,
        experienceMax: 4,

        applicationDeadline: "2026-09-25",
        createdAt: "2026-08-28",

        description:
            "We are looking for a Backend Developer to develop reliable APIs and scalable server-side applications.",

        responsibilities: [
            "Build REST APIs using Node.js and Express.",
            "Design and optimize database queries.",
            "Implement authentication and authorization.",
            "Work closely with frontend developers.",
        ],

        requirements: [
            "2+ years of Node.js experience.",
            "Experience with Express.js.",
            "Strong knowledge of MySQL.",
            "Understanding of REST API architecture.",
        ],

        skills: [
            "Node.js",
            "Express",
            "MySQL",
            "Sequelize",
        ],

        applicants: 28,
    },
];

const RecruiterJobDetails = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        const selectedJob = jobs.find(
            (item) => item.id === Number(jobId)
        );

        const timer = setTimeout(() => {
            if (selectedJob) {
                setJob(selectedJob);
            } else {
                setError("This job could not be found.");
            }

            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [jobId]);

    const formatJobType = (type) => {
        if (!type) return "Not specified";

        return type
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const formatWorkMode = (mode) => {
        if (!mode) return "Not specified";

        return mode
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

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

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDescription = (text) => {
        if (!text) {
            return (
                <p className="text-sm leading-7 text-slate-500">
                    No description has been provided for this
                    position.
                </p>
            );
        }

        return text
            .split("\n")
            .map((paragraph, index) => (
                <p
                    key={index}
                    className="mb-4 text-sm leading-7 text-slate-600 last:mb-0"
                >
                    {paragraph}
                </p>
            ));
    };
    const handleViewApplications = () => {
        navigate(
            `/recruiter/jobs/${jobId}/applications`
        );
    };

    const handleEditJob = () => {
        navigate(`/recruiter/jobs/${jobId}/edit`);
    };

    const handleBack = () => {
        navigate("/recruiter/jobs");
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="mt-6 h-56 rounded-2xl bg-white" />

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="h-96 rounded-2xl bg-white" />

                    <div className="h-72 rounded-2xl bg-white" />
                </div>
            </div>
        );
    }
    if (error || !job) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
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
                        onClick={handleBack}
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
        <div>
            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <section>
                {/* Back Button */}

                <button
                    type="button"
                    onClick={handleBack}
                    className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to Jobs
                </button>

                {/* Job Header */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Job Information */}

                        <div className="flex gap-4 sm:gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-16 sm:w-16 sm:rounded-2xl">
                                <Building2 size={27} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-indigo-600">
                                    {job.category?.name ||
                                        "Job Opportunity"}
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    {job.title}
                                </h1>

                                <p className="mt-2 text-sm font-medium text-slate-600">
                                    {job.company?.name ||
                                        "Company"}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.location ||
                                            "Location not specified"}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <BriefcaseBusiness
                                            size={16}
                                        />
                                        {formatJobType(
                                            job.jobType
                                        )}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <Clock3 size={16} />
                                        {formatWorkMode(
                                            job.workMode
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}

                        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                            <button
                                type="button"
                                onClick={handleEditJob}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                <Edit3 size={17} />
                                Edit Job
                            </button>

                            <button
                                type="button"
                                onClick={handleViewApplications}
                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Users size={17} />
                                View Applications
                            </button>
                        </div>
                    </div>

                    {/* Job Summary */}

                    <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-5">
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
                                {formatJobType(
                                    job.jobType
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Applicants
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                <Users
                                    size={15}
                                    className="text-indigo-600"
                                />

                                {job.applicants || 0}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Application Deadline
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(
                                    job.applicationDeadline
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* =================================================
                    LEFT CONTENT
                ================================================== */}

                <div className="space-y-6">
                    {/* Job Description */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <h2 className="text-xl font-bold text-slate-900">
                            Job Description
                        </h2>

                        <div className="mt-5">
                            {formatDescription(
                                job.description
                            )}
                        </div>
                    </section>

                    {/* Responsibilities */}

                    {responsibilities.length > 0 && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                            <h2 className="text-xl font-bold text-slate-900">
                                Responsibilities
                            </h2>

                            <div className="mt-5 space-y-3">
                                {responsibilities.map(
                                    (
                                        item,
                                        index
                                    ) => (
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
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                            <h2 className="text-xl font-bold text-slate-900">
                                Requirements
                            </h2>

                            <div className="mt-5 space-y-3">
                                {requirements.map(
                                    (
                                        item,
                                        index
                                    ) => (
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
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                            <h2 className="text-xl font-bold text-slate-900">
                                Required Skills
                            </h2>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {skills.map(
                                    (skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* =================================================
                    RIGHT SIDEBAR
                ================================================== */}

                <aside className="space-y-5">
                    {/* Application Management */}

                    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Users size={21} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">
                            Manage Applications
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            View candidates who have
                            applied for this job and
                            manage their applications.
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleViewApplications
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            View Applications
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={handleEditJob}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            <Edit3 size={17} />
                            Edit Job
                        </button>

                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Users
                                    size={17}
                                    className="text-slate-400"
                                />

                                <span>
                                    {job.applicants || 0}{" "}
                                    candidates have
                                    applied
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <CalendarDays
                                    size={17}
                                    className="text-slate-400"
                                />

                                <span>
                                    Applications close on{" "}
                                    {formatDate(
                                        job.applicationDeadline
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Company */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Company
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Building2 size={20} />
                            </div>

                            <div>
                                <p className="font-semibold text-slate-800">
                                    {job.company?.name ||
                                        "Company"}
                                </p>

                                {job.company?.location && (
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {
                                            job.company
                                                .location
                                        }
                                    </p>
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
                                href={
                                    job.company.website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Visit company website →
                            </a>
                        )}
                    </div>

                    {/* Job Information */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Job Information
                        </p>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Work Mode
                                </span>

                                <span className="text-sm font-semibold text-slate-800">
                                    {formatWorkMode(
                                        job.workMode
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Experience
                                </span>

                                <span className="text-sm font-semibold text-slate-800">
                                    {formatExperience()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Posted
                                </span>

                                <span className="text-sm font-semibold text-slate-800">
                                    {formatDate(
                                        job.createdAt
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-500">
                                    Deadline
                                </span>

                                <span className="text-sm font-semibold text-slate-800">
                                    {formatDate(
                                        job.applicationDeadline
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RecruiterJobDetails;
