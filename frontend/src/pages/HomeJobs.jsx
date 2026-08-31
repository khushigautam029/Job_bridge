import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    LockKeyhole,
    LogIn,
    MapPin,
    Search,
    UserPlus,
    X,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import jobsData from "./data/jobsData";

const HomeJobs = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");

    const [search, setSearch] = useState("");
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authAction, setAuthAction] = useState("");

    const isLoggedIn = Boolean(localStorage.getItem("token"));

    // --------------------------------------------------
    // Filter Jobs
    // --------------------------------------------------

    const filteredJobs = useMemo(() => {
        return jobsData.filter((job) => {
            const matchesCategory = category
                ? job.category === category
                : true;

            const searchValue = search.toLowerCase();

            const matchesSearch =
                !searchValue ||
                job.title.toLowerCase().includes(searchValue) ||
                job.company.toLowerCase().includes(searchValue) ||
                job.location.toLowerCase().includes(searchValue) ||
                job.skills.some((skill) =>
                    skill.toLowerCase().includes(searchValue)
                );

            return matchesCategory && matchesSearch;
        });
    }, [category, search]);

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    const requireLogin = (action) => {
        if (!isLoggedIn) {
            setAuthAction(action);
            setShowAuthModal(true);
            return;
        }

        if (action === "apply") {
            // Later this can navigate to:
            // /jobs/:jobId/apply

            console.log("User can apply");
        }

        if (action === "save") {
            // Later connect this with save-job API

            console.log("User can save job");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    <div className="flex items-center gap-3">

                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Dashboard
                            </button>
                        )}

                    </div>
                </div>
            </header>

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <section className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <button
                        onClick={() => navigate("/")}
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Job opportunities
                            </p>

                            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                                {category
                                    ? `${category} Jobs`
                                    : "Find Your Next Job"}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                {category
                                    ? `Explore the latest ${category.toLowerCase()} opportunities and find a role that matches your skills.`
                                    : "Search and explore job opportunities from companies hiring now."}
                            </p>

                        </div>

                        <div className="rounded-xl bg-indigo-50 px-4 py-3">

                            <p className="text-xs font-medium text-indigo-500">
                                Available Jobs
                            </p>

                            <p className="mt-1 text-xl font-bold text-indigo-700">
                                {filteredJobs.length}
                            </p>

                        </div>

                    </div>
                </div>
            </section>

            {/* =====================================================
                SEARCH
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">

                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">

                        <Search
                            size={19}
                            className="text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by job title, company, skill or location..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />

                    </div>
                </div>
            </section>

            {/* =====================================================
                JOB LIST
            ===================================================== */}

            <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                {filteredJobs.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <Search size={25} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-slate-900">
                            No jobs found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or explore another
                            category.
                        </p>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Browse All Jobs
                        </button>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {filteredJobs.map((job) => (

                            <article
                                key={job.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50"
                            >

                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                    {/* Job information */}

                                    <div className="flex gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Building2 size={24} />
                                        </div>

                                        <div>

                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {job.title}
                                            </h2>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                                {job.company}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={15} />
                                                    {job.location}
                                                </span>

                                                <span className="flex items-center gap-1.5">
                                                    <BriefcaseBusiness size={15} />
                                                    {job.type}
                                                </span>

                                                <span>
                                                    {job.experience}
                                                </span>

                                            </div>

                                        </div>
                                    </div>

                                    {/* Actions */}

                                    <div className="flex shrink-0 gap-2">

                                        <button
                                            onClick={() =>
                                                requireLogin("save")
                                            }
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() =>
                                                requireLogin("apply")
                                            }
                                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                        >
                                            View & Apply
                                            <ArrowRight size={15} />
                                        </button>

                                    </div>
                                </div>

                                {/* Bottom */}

                                <div className="mt-6 border-t border-slate-100 pt-5">

                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                        <div className="flex flex-wrap gap-2">

                                            {job.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                                                >
                                                    {skill}
                                                </span>
                                            ))}

                                        </div>

                                        <div className="text-left sm:text-right">

                                            <p className="text-xs text-slate-400">
                                                Salary
                                            </p>

                                            <p className="font-semibold text-slate-800">
                                                {job.salary}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Posted {job.posted}
                                            </p>

                                        </div>

                                    </div>
                                </div>

                            </article>
                        ))}

                    </div>
                )}
            </main>

            {/* =====================================================
                AUTH MODAL
            ===================================================== */}

            {showAuthModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                    <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

                        <button
                            onClick={() =>
                                setShowAuthModal(false)
                            }
                            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <LockKeyhole size={22} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Login required
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                            {authAction === "apply"
                                ? "Please login or create a JobBridge account before applying for this job."
                                : "Please login or create an account before saving jobs."}

                        </p>

                        <div className="mt-6 space-y-3">

                            <button
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                <LogIn size={18} />
                                Login
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <UserPlus size={18} />
                                Create an Account
                            </button>

                        </div>

                        <p className="mt-5 text-center text-xs text-slate-400">
                            Join JobBridge and start your career journey.
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeJobs;

