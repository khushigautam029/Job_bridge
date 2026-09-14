import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Clock3,
    MapPin,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            workMode: "Hybrid",
            salary: "₹8L - ₹14L",
            savedDate: "August 26, 2026",
            posted: "2 days ago",
            experience: "3-5 years",
            description:
                "We are looking for a Senior React Developer to build scalable and high-performance web applications. You will work closely with designers, backend developers and product managers.",
            skills: ["React", "JavaScript", "Node.js"],
            applied: false,
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            workMode: "On-site",
            salary: "₹7L - ₹12L",
            savedDate: "August 24, 2026",
            posted: "4 days ago",
            experience: "2-4 years",
            description:
                "Join our backend engineering team to design APIs, databases and scalable server-side applications using Node.js, Express and MySQL.",
            skills: ["Node.js", "Express", "MySQL"],
            applied: false,
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Full Time",
            workMode: "Remote",
            salary: "₹5L - ₹9L",
            savedDate: "August 22, 2026",
            posted: "1 week ago",
            experience: "1-3 years",
            description:
                "We are looking for a creative UI/UX Designer who can transform complex problems into simple and beautiful user experiences.",
            skills: ["Figma", "UI Design", "UX"],
            applied: false,
        },
        {
            id: 4,
            title: "MERN Stack Developer",
            company: "Digital Solutions",
            location: "Delhi, India",
            type: "Full Time",
            workMode: "Hybrid",
            salary: "₹7L - ₹12L",
            savedDate: "August 20, 2026",
            posted: "1 week ago",
            experience: "2-4 years",
            description:
                "Work with our development team to build modern full-stack applications using MongoDB, Express, React and Node.js.",
            skills: ["MongoDB", "Express", "React", "Node.js"],
            applied: false,
        },
        {
            id: 5,
            title: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            type: "Full Time",
            workMode: "Remote",
            salary: "₹6L - ₹10L",
            savedDate: "August 18, 2026",
            posted: "2 weeks ago",
            experience: "1-3 years",
            description:
                "Build responsive and accessible user interfaces using React, Tailwind CSS and modern JavaScript.",
            skills: ["React", "Tailwind CSS", "JavaScript"],
            applied: false,
        },
        {
            id: 6,
            title: "Node.js Developer",
            company: "Cloud Systems",
            location: "Bangalore, India",
            type: "Full Time",
            workMode: "On-site",
            salary: "₹8L - ₹14L",
            savedDate: "August 16, 2026",
            posted: "2 weeks ago",
            experience: "3-5 years",
            description:
                "Develop secure and scalable backend services and REST APIs using Node.js, Express and MySQL.",
            skills: ["Node.js", "Express", "MySQL"],
            applied: false,
        },
    ]);

    const [selectedJob, setSelectedJob] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [deletedJob, setDeletedJob] = useState(null);

    const filteredJobs = useMemo(() => {
        let jobs = savedJobs.filter((job) => {
            const searchText = search.toLowerCase();

            return (
                job.title.toLowerCase().includes(searchText) ||
                job.company.toLowerCase().includes(searchText) ||
                job.location.toLowerCase().includes(searchText) ||
                job.skills.some((skill) =>
                    skill.toLowerCase().includes(searchText)
                )
            );
        });

        if (sortBy === "salaryHigh") {
            jobs = [...jobs].sort(
                (a, b) =>
                    parseInt(b.salary.match(/\d+/)?.[0] || 0) -
                    parseInt(a.salary.match(/\d+/)?.[0] || 0)
            );
        }

        if (sortBy === "salaryLow") {
            jobs = [...jobs].sort(
                (a, b) =>
                    parseInt(a.salary.match(/\d+/)?.[0] || 0) -
                    parseInt(b.salary.match(/\d+/)?.[0] || 0)
            );
        }

        if (sortBy === "company") {
            jobs = [...jobs].sort((a, b) =>
                a.company.localeCompare(b.company)
            );
        }

        return jobs;
    }, [savedJobs, search, sortBy]);

    const remoteJobs = savedJobs.filter(
        (job) => job.workMode === "Remote"
    ).length;

    const fullTimeJobs = savedJobs.filter(
        (job) => job.type === "Full Time"
    ).length;

    const removeJob = (job) => {
        setSavedJobs((current) =>
            current.filter((item) => item.id !== job.id)
        );

        setDeletedJob(job);

        if (selectedJob?.id === job.id) {
            setSelectedJob(null);
        }

        setTimeout(() => {
            setDeletedJob(null);
        }, 4000);
    };

    const undoDelete = () => {
        if (!deletedJob) return;

        setSavedJobs((current) => {
            const alreadyExists = current.some(
                (job) => job.id === deletedJob.id
            );

            if (alreadyExists) return current;

            return [...current, deletedJob];
        });

        setDeletedJob(null);
    };

    const applyForJob = (jobId) => {
        setSavedJobs((current) =>
            current.map((job) =>
                job.id === jobId
                    ? {
                        ...job,
                        applied: true,
                    }
                    : job
            )
        );

        setSelectedJob((current) =>
            current
                ? {
                    ...current,
                    applied: true,
                }
                : current
        );
    };

    return (
        <div className="relative">
            {/* Page Header */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Your Shortlist
                </p>

                <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Saved Jobs
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep track of jobs you are interested in and apply
                            when you're ready.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
                        <Bookmark size={17} />
                        {savedJobs.length} Saved
                    </div>
                </div>
            </section>

            {/* Summary */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Saved Jobs
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {savedJobs.length}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Jobs in your shortlist
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Bookmark size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Full Time
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {fullTimeJobs}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Full-time opportunities
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Remote
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {remoteJobs}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Remote opportunities
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <MapPin size={21} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Toolbar */}
            <section className="mt-7">
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Your Saved Jobs
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredJobs.length} jobs currently showing
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
                                placeholder="Search saved jobs..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400"
                        >
                            <option value="recent">
                                Recently Saved
                            </option>
                            <option value="salaryHigh">
                                Salary: High to Low
                            </option>
                            <option value="salaryLow">
                                Salary: Low to High
                            </option>
                            <option value="company">Company</option>
                        </select>
                    </div>
                </div>

                {/* Empty Search State */}
                {filteredJobs.length === 0 && savedJobs.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Search size={24} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No jobs found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try searching with a different keyword.
                        </p>
                    </div>
                )}

                {/* Completely Empty State */}
                {savedJobs.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <Bookmark size={28} />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-slate-900">
                            No saved jobs
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            You haven't saved any jobs yet. Explore available
                            opportunities and bookmark the ones you like.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                alert("Navigate to Find Jobs page")
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Find Jobs
                            <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* Saved Jobs Grid */}
                {filteredJobs.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Top */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Building2 size={22} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeJob(job)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                        title="Remove from saved jobs"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Job Information */}
                                <div className="mt-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-lg font-semibold text-slate-900">
                                            {job.title}
                                        </h4>

                                        {job.applied && (
                                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                                                Applied
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        {job.company}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="mt-4 space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={16}
                                            className="text-slate-400"
                                        />
                                        <span>{job.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness
                                            size={16}
                                            className="text-slate-400"
                                        />
                                        <span>{job.type}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock3
                                            size={16}
                                            className="text-slate-400"
                                        />
                                        <span>{job.experience}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-400">
                                            ₹
                                        </span>
                                        <span>{job.salary}</span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {job.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-5 border-t border-slate-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400">
                                            Saved on {job.savedDate}
                                        </p>

                                        <span className="text-xs font-medium text-slate-400">
                                            {job.workMode}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedJob(job)
                                        }
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        View Job
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Haven't found the right job yet?
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            Explore more opportunities based on your skills
                            and interests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            alert("Navigate to Find Jobs page")
                        }
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Find More Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* Delete Toast */}
            {deletedJob && (
                <div className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <Trash2 size={17} className="text-red-400" />

                        <div>
                            <p className="text-sm font-medium">
                                Job removed
                            </p>

                            <p className="text-xs text-slate-400">
                                {deletedJob.title}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={undoDelete}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
                    >
                        Undo
                    </button>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedJob(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Building2 size={25} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {selectedJob.title}
                                    </h2>

                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        {selectedJob.company}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedJob(null)}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Job Meta */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <MapPin size={15} />
                                        Location
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedJob.location}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <BriefcaseBusiness size={15} />
                                        Job Type
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedJob.type}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="text-xs font-medium text-slate-400">
                                        Salary
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedJob.salary}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <div className="text-xs font-medium text-slate-400">
                                        Experience
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedJob.experience}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-slate-900">
                                    About the Job
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {selectedJob.description}
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Required Skills
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedJob.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Job Information */}
                            <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Work Mode
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {selectedJob.workMode}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Posted
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {selectedJob.posted}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => removeJob(selectedJob)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <Trash2 size={17} />
                                    Remove Saved Job
                                </button>

                                {selectedJob.applied ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600"
                                    >
                                        <CheckCircle2 size={17} />
                                        Application Submitted
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            applyForJob(selectedJob.id)
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Apply Now
                                        <ArrowRight size={17} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
