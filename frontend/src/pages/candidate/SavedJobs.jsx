import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    Clock3,
    MapPin,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination, { usePagination } from "../../components/Pagination";
import { formatJobCard } from "../../services/jobService";
import {
    getSavedJobs,
    saveJob,
    unsaveJob,
} from "../../services/savedJobService";

const SavedJobs = () => {
    const navigate = useNavigate();

    const [savedJobs, setSavedJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("salary");
    const [category, setCategory] = useState("");
    const [deletedJob, setDeletedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getSavedJobs()
            .then((saved) => {
                if (!active) return;

                setSavedJobs(
                    saved.map((entry) => ({
                        ...formatJobCard(entry.job),
                        savedDate: entry.createdAt
                            ? new Date(
                                  entry.createdAt
                              ).toLocaleDateString()
                            : "",
                        description: entry.job.description || "",
                        applied: false,
                    }))
                );
            })
            .catch((loadError) => {
                if (!active) return;

                setSavedJobs([]);
                setError(
                    loadError.response?.data?.message ||
                        "Unable to load saved jobs."
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const categories = useMemo(
        () =>
            [...new Set(savedJobs.map((job) => job.category).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b)),
        [savedJobs]
    );

    const filteredJobs = useMemo(() => {
        let jobs = savedJobs.filter((job) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                (job.title || "").toLowerCase().includes(searchText) ||
                (job.company || "").toLowerCase().includes(searchText) ||
                (job.location || "").toLowerCase().includes(searchText) ||
                (job.skills || []).some((skill) =>
                    skill.toLowerCase().includes(searchText)
                );

            return (!category || job.category === category) && matchesSearch;
        });

        if (sortBy === "salary") return jobs;

        return jobs.sort((a, b) => {
            const salaryA = Number(
                sortBy === "salaryLow"
                    ? a.minSalary || a.maxSalary || 0
                    : a.maxSalary || a.minSalary || 0
            );
            const salaryB = Number(
                sortBy === "salaryLow"
                    ? b.minSalary || b.maxSalary || 0
                    : b.maxSalary || b.minSalary || 0
            );
            return sortBy === "salaryLow" ? salaryA - salaryB : salaryB - salaryA;
        });
    }, [savedJobs, search, category, sortBy]);
    const { pageItems: pageJobs, currentPage, setCurrentPage, pageCount } =
        usePagination(filteredJobs, JSON.stringify([search, category, sortBy]));

    const remoteJobs = savedJobs.filter(
        (job) => job.workMode === "Remote"
    ).length;

    const fullTimeJobs = savedJobs.filter(
        (job) => job.type === "Full Time"
    ).length;

    // Open the individual job details page.
    const viewJob = (job) => {
        navigate(`/candidate/jobs/${job.id}`);
    };

    // Open the application page for the selected job.
    const applyForJob = (job) => {
        navigate(`/candidate/jobs/${job.id}/apply`);
    };

    const removeJob = async (job) => {
        try {
            await unsaveJob(job.id);
            setError("");
        } catch (removeError) {
            setError(
                removeError.response?.data?.message ||
                    "Unable to remove this saved job."
            );
            return;
        }

        setSavedJobs((current) =>
            current.filter((item) => item.id !== job.id)
        );

        setDeletedJob(job);
    };

    const undoDelete = async () => {
        if (!deletedJob) return;

        try {
            await saveJob(deletedJob.id);
        } catch (saveError) {
            setError(
                saveError.response?.data?.message ||
                    "Unable to restore this saved job."
            );
            return;
        }

        setSavedJobs((current) => {
            const alreadyExists = current.some(
                (job) => job.id === deletedJob.id
            );

            if (alreadyExists) return current;

            return [...current, deletedJob];
        });

        setDeletedJob(null);
    };

    if (loading) {
        return (
            <p className="py-10 text-center text-sm text-slate-500">
                Loading saved jobs...
            </p>
        );
    }

    return (
        <div className="relative w-full">
            {error && (
                <div
                    role="alert"
                    className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="font-semibold hover:text-red-900"
                    >
                        Dismiss
                    </button>
                </div>
            )}

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
                            Keep track of jobs you are interested in and
                            apply when you're ready.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
                        <Bookmark size={17} />
                        {savedJobs.length} Saved
                    </div>
                </div>
            </section>

            {/* Summary Cards */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SummaryCard
                    label="Saved Jobs"
                    value={savedJobs.length}
                    description="Jobs in your shortlist"
                    icon={<Bookmark size={21} />}
                />

                <SummaryCard
                    label="Full Time"
                    value={fullTimeJobs}
                    description="Full-time opportunities"
                    icon={<BriefcaseBusiness size={21} />}
                />

                <SummaryCard
                    label="Remote"
                    value={remoteJobs}
                    description="Remote opportunities"
                    icon={<MapPin size={21} />}
                />
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

                    <div className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap">
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

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400"
                        >
                            <option value="">All Categories</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400"
                        >
                            <option value="salary">Salary</option>
                            <option value="salaryHigh">
                                Salary: High to Low
                            </option>
                            <option value="salaryLow">
                                Salary: Low to High
                            </option>
                        </select>
                    </div>
                </div>

                {/* No Search Results */}
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

                {/* Empty Saved Jobs */}
                {savedJobs.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <Bookmark size={28} />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-slate-900">
                            No saved jobs
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            You haven't saved any jobs yet. Explore
                            available opportunities and bookmark the ones
                            you like.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/candidate/jobs")
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
                        {pageJobs.map((job) => (
                            <div
                                key={job.id}
                                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Building2 size={22} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeJob(job)}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                        title="Remove from saved jobs"
                                        aria-label={`Remove ${job.title} from saved jobs`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Job Information */}
                                <div className="mt-5">
                                    <h4 className="text-lg font-semibold text-slate-900">
                                        {job.title}
                                    </h4>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        {job.company}
                                    </p>
                                </div>

                                {/* Job Details */}
                                <div className="mt-4 space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                        <span>{job.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                        <span>{job.type}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock3
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                        <span>{job.experience}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Users
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                        <span>
                                            {Number(job.remainingOpenings ?? 1)}{" "}
                                            {Number(job.remainingOpenings ?? 1) === 1
                                                ? "opening"
                                                : "openings"}
                                            {" "}remaining
                                        </span>
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
                                    {(job.skills || []).map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-5">
                                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-400">
                                            Saved on {job.savedDate || "—"}
                                        </p>

                                        <span className="text-xs font-medium text-slate-400">
                                            {job.workMode}
                                        </span>
                                    </div>

                                    {/* View and Apply Buttons */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => viewJob(job)}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                                        >
                                            View Job
                                            <ArrowRight size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => applyForJob(job)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            Apply Now
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Pagination
                    totalItems={filteredJobs.length}
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={setCurrentPage}
                />
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
                        onClick={() => navigate("/candidate/jobs")}
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Find More Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* Undo Delete Toast */}
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
        </div>
    );
};

const SummaryCard = ({ label, value, description, icon }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">
                    {label}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    {description}
                </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {icon}
            </div>
        </div>
    </div>
);

export default SavedJobs;
