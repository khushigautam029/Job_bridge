import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    FileText,
    LogIn,
    LogOut,
    MapPin,
    Search,
    Settings,
    ShieldCheck,
    User,
    UserCircle,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationDropdown from "../pages/Notification";
import {
    formatJobCard,
    getJobCategories,
    getJobs,
    getSavedJobs,
    saveJob,
    unsaveJob,
} from "../services/projectService";

const Home = () => {
    const navigate = useNavigate();

    const storedUser = JSON.parse(
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "null"
    );

    const storedToken =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const isLoggedIn = Boolean(storedToken);

    const userRole = storedUser?.role || "CANDIDATE";

    const userName =
        storedUser?.name ||
        (userRole === "RECRUITER"
            ? "Recruiter"
            : "Candidate");

    const userEmail = storedUser?.email || "";

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authAction, setAuthAction] = useState("");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [homeError, setHomeError] = useState("");

    useEffect(() => {
        let active = true;

        Promise.all([
            getJobs({ limit: 50 }),
            getJobCategories(),
        ])
            .then(([jobResult, categoryResult]) => {
                if (!active) return;

                const jobs = (jobResult.jobs || []).map(
                    formatJobCard
                );

                setFeaturedJobs(jobs.slice(0, 3));

                setCategories(
                    categoryResult.map((category) => ({
                        ...category,
                        jobs: Number(category.jobCount || 0),
                    }))
                );
            })
            .catch((error) => {
                if (active) {
                    setHomeError(
                        error.response?.data?.message ||
                        "Unable to load current jobs."
                    );
                }
            });

        if (
            isLoggedIn &&
            userRole === "CANDIDATE"
        ) {
            getSavedJobs()
                .then((saved) => {
                    if (active) {
                        setSavedJobIds(
                            saved.map((entry) =>
                                String(entry.jobId)
                            )
                        );
                    }
                })
                .catch(() => {
                    if (active) {
                        setHomeError(
                            "Unable to load your saved jobs."
                        );
                    }
                });
        }

        return () => {
            active = false;
        };
    }, [isLoggedIn, userRole]);

    const toggleFeaturedSave = async (jobId) => {
        if (!isLoggedIn) {
            setAuthAction("save");
            setShowAuthModal(true);
            return;
        }

        if (userRole !== "CANDIDATE") return;

        const id = String(jobId);

        try {
            setHomeError("");

            if (savedJobIds.includes(id)) {
                await unsaveJob(jobId);

                setSavedJobIds((current) =>
                    current.filter(
                        (savedId) => savedId !== id
                    )
                );
            } else {
                await saveJob(jobId);

                setSavedJobIds((current) => [
                    ...current,
                    id,
                ]);
            }
        } catch (error) {
            setHomeError(
                error.response?.data?.message ||
                "Unable to update saved jobs."
            );
        }
    };

    useEffect(() => {
        const message = sessionStorage.getItem(
            "authSuccessMessage"
        );

        if (message) {
            setSuccessMessage(message);

            sessionStorage.removeItem(
                "authSuccessMessage"
            );

            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, []);

    const getJobsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/jobs";
        }

        if (userRole === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/candidate/jobs";
    };

    const getApplicationsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/applications";
        }

        if (userRole === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/candidate/applications";
    };

    const getInterviewsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/interviews";
        }

        if (userRole === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/candidate/interviews";
    };

    const requireLogin = (action, jobId = null) => {
        if (!isLoggedIn) {
            setAuthAction(action);
            setShowAuthModal(true);
            return;
        }

        if (userRole === "RECRUITER") {
            if (jobId) {
                navigate(`/recruiter/jobs/${jobId}`);
            } else {
                navigate("/recruiter/jobs");
            }

            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        if (jobId) {
            navigate(`/candidate/jobs/${jobId}`);
            return;
        }

        navigate("/candidate/jobs");
    };

    const handleJobsNavigation = () => {
        if (!isLoggedIn) {
            setAuthAction("jobs");
            setShowAuthModal(true);
            return;
        }

        navigate(getJobsRoute());
    };

    const handleApplicationsNavigation = () => {
        if (!isLoggedIn) {
            setAuthAction("applications");
            setShowAuthModal(true);
            return;
        }

        navigate(getApplicationsRoute());
    };

    const handleInterviewsNavigation = () => {
        if (!isLoggedIn) {
            setAuthAction("interviews");
            setShowAuthModal(true);
            return;
        }

        navigate(getInterviewsRoute());
    };

    const handleCategoryClick = (category) => {
        if (!isLoggedIn) {
            setAuthAction("category");
            setShowAuthModal(true);
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        navigate(
            `${getJobsRoute()}?category=${encodeURIComponent(
                category
            )}`
        );
    };

    const handleFeaturedJobClick = (jobId) => {
        if (!isLoggedIn) {
            setAuthAction("featured");
            setShowAuthModal(true);
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        navigate(
            `${getJobsRoute()}?jobId=${jobId}`
        );
    };

    const handleSearch = () => {
        if (!isLoggedIn) {
            setAuthAction("jobs");
            setShowAuthModal(true);
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        const params = new URLSearchParams();

        if (searchKeyword.trim()) {
            params.set(
                "search",
                searchKeyword.trim()
            );
        }

        if (searchLocation.trim()) {
            params.set(
                "location",
                searchLocation.trim()
            );
        }

        const queryString = params.toString();

        navigate(
            queryString
                ? `${getJobsRoute()}?${queryString}`
                : getJobsRoute()
        );
    };

    const handlePopularSearch = (keyword) => {
        if (!isLoggedIn) {
            setAuthAction("jobs");
            setShowAuthModal(true);
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        navigate(
            `${getJobsRoute()}?search=${encodeURIComponent(
                keyword
            )}`
        );
    };

    const handleProfileClick = () => {
        setProfileMenuOpen(false);

        if (userRole === "RECRUITER") {
            navigate("/recruiter/profile");
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        navigate("/candidate/profile");
    };

    const handleSettingsClick = () => {
        setProfileMenuOpen(false);

        if (userRole === "RECRUITER") {
            navigate("/recruiter/settings");
            return;
        }

        if (userRole === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        navigate("/candidate/settings");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setProfileMenuOpen(false);

        navigate("/");
        window.location.reload();
    };

    const features = [
        {
            icon: Search,
            title: "Find the Right Job",
            description:
                "Search thousands of opportunities and find jobs that match your skills and career goals.",
        },
        {
            icon: CheckCircle2,
            title: "Easy Applications",
            description:
                "Apply for jobs quickly and keep all your applications organized in one place.",
        },
        {
            icon: ShieldCheck,
            title: "Track Everything",
            description:
                "Stay updated with application status, interviews, and notifications throughout your journey.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* SUCCESS MESSAGE */}
            {successMessage && (
                <div className="fixed left-1/2 top-4 z-[100] -translate-x-1/2 px-4">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={17} />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                            {successMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage("")
                            }
                            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">

                    {/* LOGO */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex shrink-0 items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    {/* DESKTOP NAVIGATION */}
                    {isLoggedIn && (
                        <nav className="hidden items-center gap-0.5 lg:flex">
                            {userRole !== "RECRUITER" &&
                                userRole !== "ADMIN" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={
                                                handleJobsNavigation
                                            }
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Search size={16} />
                                            Find Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplicationsNavigation
                                            }
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <FileText size={16} />
                                            Applications
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/candidate/saved-jobs"
                                                )
                                            }
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Bookmark size={16} />
                                            Saved Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleInterviewsNavigation
                                            }
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <CalendarDays size={16} />
                                            Interviews
                                        </button>
                                    </>
                                )}

                            {userRole === "RECRUITER" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={
                                            handleJobsNavigation
                                        }
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <BriefcaseBusiness size={16} />
                                        Jobs
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleApplicationsNavigation
                                        }
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <FileText size={16} />
                                        Applications
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/recruiter/candidates"
                                            )
                                        }
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <Users size={16} />
                                        Candidates
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleInterviewsNavigation
                                        }
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <CalendarDays size={16} />
                                        Interviews
                                    </button>
                                </>
                            )}
                        </nav>
                    )}

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-1.5">

                        {isLoggedIn && (
                            <NotificationDropdown
                                role={userRole}
                            />
                        )}

                        {/* PROFILE */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileMenuOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${
                                    profileMenuOpen
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={17} />
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-[120px] truncate text-sm font-semibold leading-4 text-slate-800">
                                        {isLoggedIn
                                            ? userName
                                            : "Account"}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        {isLoggedIn
                                            ? userRole === "RECRUITER"
                                                ? "Recruiter"
                                                : userRole === "ADMIN"
                                                    ? "Administrator"
                                                    : "Candidate"
                                            : "Login / Register"}
                                    </p>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className={`hidden text-slate-400 transition-transform sm:block ${
                                        profileMenuOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {/* PROFILE DROPDOWN */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

                                    {!isLoggedIn && (
                                        <>
                                            <div className="border-b border-slate-100 px-4 py-3.5">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Welcome to JobBridge
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    Sign in or create an account to explore jobs and manage your career.
                                                </p>
                                            </div>

                                            <div className="p-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/login"
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    <LogIn size={17} />
                                                    Login
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/register"
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    <UserPlus size={17} />
                                                    Register
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {isLoggedIn && (
                                        <>
                                            <div className="border-b border-slate-100 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                        <User size={17} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {userName}
                                                        </p>

                                                        <p className="truncate text-xs text-slate-500">
                                                            {userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-1.5">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleProfileClick
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    <UserCircle size={17} />
                                                    My Profile
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleSettingsClick
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    <Settings size={17} />
                                                    Settings
                                                </button>
                                            </div>

                                            <div className="border-t border-slate-100 p-1.5">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleLogout
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                                >
                                                    <LogOut size={17} />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-slate-100 bg-white">
                <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-50 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />

                <div className="relative mx-auto max-w-[1400px] px-5 pb-14 pt-12 sm:px-7 lg:px-8 lg:pb-16 lg:pt-16">

                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            Thousands of opportunities waiting for you
                        </div>

                        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]">
                            Find work that moves your{" "}
                            <span className="text-indigo-600">
                                career forward.
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Discover jobs from trusted companies, apply with confidence, and build the career you deserve with JobBridge.
                        </p>
                    </div>

                    {/* SEARCH */}
                    <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-2.5 shadow-lg shadow-slate-200/60">
                        <div className="grid gap-2.5 md:grid-cols-[1fr_1fr_auto]">

                            {/* KEYWORD */}
                            <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                <Search
                                    size={19}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold text-slate-400">
                                        JOB TITLE OR KEYWORD
                                    </p>

                                    <input
                                        type="text"
                                        value={searchKeyword}
                                        onChange={(event) =>
                                            setSearchKeyword(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="e.g. React Developer"
                                        className="mt-0.5 w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                <MapPin
                                    size={19}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-semibold text-slate-400">
                                        LOCATION
                                    </p>

                                    <input
                                        type="text"
                                        value={searchLocation}
                                        onChange={(event) =>
                                            setSearchLocation(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="City or Remote"
                                        className="mt-0.5 w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* SEARCH BUTTON */}
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Search size={18} />
                                Search Jobs
                            </button>
                        </div>
                    </div>

                    {/* POPULAR SEARCHES */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                        <span className="font-medium text-slate-500">
                            Popular:
                        </span>

                        {[
                            "React Developer",
                            "Node.js",
                            "UI/UX Designer",
                            "Data Analyst",
                        ].map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    handlePopularSearch(item)
                                }
                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section
                id="categories"
                className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-8"
            >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Explore opportunities
                        </p>

                        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Browse jobs by category
                        </h2>

                        <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                            Find opportunities across industries and discover where your skills can make an impact.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleJobsNavigation}
                        className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                        View all jobs
                        <ArrowRight size={15} />
                    </button>
                </div>

                {homeError && (
                    <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {homeError}
                    </div>
                )}

                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => {
                        const Icon =
                            /design|marketing|sales/i.test(
                                category.name
                            )
                                ? Building2
                                : BriefcaseBusiness;

                        return (
                            <button
                                key={category.name}
                                type="button"
                                onClick={() =>
                                    handleCategoryClick(
                                        category.name
                                    )
                                }
                                className="group flex min-h-[150px] flex-col rounded-xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-slate-200/60"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Icon size={19} />
                                    </div>

                                    <ArrowRight
                                        size={17}
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                    />
                                </div>

                                <div className="mt-auto pt-5">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {category.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {category.jobs}{" "}
                                        {category.jobs === 1
                                            ? "Job"
                                            : "Jobs"}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* FEATURED JOBS */}
            <section
                id="jobs"
                className="border-y border-slate-200 bg-white"
            >
                <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-8">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                Latest opportunities
                            </p>

                            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Featured jobs
                            </h2>

                            <p className="mt-1.5 text-sm text-slate-500">
                                Explore roles from companies looking for talented people like you.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleJobsNavigation}
                            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            Browse all jobs
                            <ArrowRight size={15} />
                        </button>
                    </div>

                    <div className="mt-7 grid gap-4 lg:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                            >
                                {/* COMPANY */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                                            <Building2 size={19} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                Company
                                            </p>

                                            <p className="truncate text-sm font-semibold text-slate-700">
                                                {job.company}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleFeaturedSave(
                                                job.id
                                            )
                                        }
                                        className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                            savedJobIds.includes(
                                                String(job.id)
                                            )
                                                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                                : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
                                        }`}
                                    >
                                        <Bookmark
                                            size={13}
                                            className={
                                                savedJobIds.includes(
                                                    String(
                                                        job.id
                                                    )
                                                )
                                                    ? "fill-current"
                                                    : ""
                                            }
                                        />

                                        {savedJobIds.includes(
                                            String(job.id)
                                        )
                                            ? "Saved"
                                            : "Save"}
                                    </button>
                                </div>

                                {/* JOB TITLE */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleFeaturedJobClick(
                                            job.id
                                        )
                                    }
                                    className="mt-5 text-left"
                                >
                                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-indigo-600">
                                        {job.title}
                                    </h3>
                                </button>

                                {/* JOB DETAILS */}
                                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={14}
                                            className="shrink-0"
                                        />
                                        <span className="truncate">
                                            {job.location}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness
                                            size={14}
                                            className="shrink-0"
                                        />
                                        <span>
                                            {job.type}
                                        </span>
                                    </div>
                                </div>

                                {/* SKILLS */}
                                <div className="mt-4 flex min-h-[28px] flex-wrap gap-1.5">
                                    {job.skills
                                        .slice(0, 4)
                                        .map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-600"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                </div>

                                {/* FOOTER */}
                                <div className="mt-5 border-t border-slate-200 pt-4">
                                    <div className="flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                Salary
                                            </p>

                                            <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                                                {job.salary}
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Posted {job.posted}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                requireLogin(
                                                    "apply",
                                                    job.id
                                                )
                                            }
                                            className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            {userRole ===
                                            "RECRUITER"
                                                ? "View Job"
                                                : "View & Apply"}

                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-8"
            >
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Why JobBridge?
                    </p>

                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Your career journey, simplified
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        From discovering your next opportunity to tracking your applications, JobBridge keeps everything in one place.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <button
                                key={feature.title}
                                type="button"
                                onClick={() =>
                                    requireLogin(
                                        "feature"
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <Icon size={21} />
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                    {feature.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            {!isLoggedIn && (
                <section className="px-5 pb-14 sm:px-7 lg:px-8">
                    <div className="mx-auto max-w-[1400px] overflow-hidden rounded-2xl bg-indigo-600 px-6 py-10 text-center shadow-lg shadow-indigo-200">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                            <BriefcaseBusiness size={24} />
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                            Your next opportunity is waiting.
                        </h2>

                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                            Create your free JobBridge account and start exploring jobs that match your skills and ambitions.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                            Create Free Account
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
                            <BriefcaseBusiness size={15} />
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </div>

                    <p className="text-xs text-slate-500">
                        © 2026 JobBridge. All rights reserved.
                    </p>

                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById(
                                        "features"
                                    )
                                    ?.scrollIntoView({
                                        behavior:
                                            "smooth",
                                    })
                            }
                            className="transition hover:text-indigo-600"
                        >
                            About
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById(
                                        "features"
                                    )
                                    ?.scrollIntoView({
                                        behavior:
                                            "smooth",
                                    })
                            }
                            className="transition hover:text-indigo-600"
                        >
                            Contact
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById(
                                        "features"
                                    )
                                    ?.scrollIntoView({
                                        behavior:
                                            "smooth",
                                    })
                            }
                            className="transition hover:text-indigo-600"
                        >
                            Privacy
                        </button>
                    </div>
                </div>
            </footer>

            {/* AUTH MODAL */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

                        <button
                            type="button"
                            onClick={() =>
                                setShowAuthModal(false)
                            }
                            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            Sign in to continue
                        </h2>

                        <p className="mt-1.5 text-sm leading-5 text-slate-500">
                            {authAction === "apply"
                                ? "You need an account before you can apply for this job."
                                : authAction === "save"
                                    ? "Sign in to save jobs and access them later from your Saved Jobs."
                                    : authAction === "category"
                                        ? "Sign in to browse jobs by category and discover opportunities that match your skills."
                                        : authAction === "featured"
                                            ? "Sign in to view job details and apply for available positions."
                                            : "Create an account or sign in to explore jobs and manage your career journey."}
                        </p>

                        <div className="mt-5 space-y-2.5">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <LogIn size={17} />
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <UserPlus size={17} />
                                Create an Account
                            </button>
                        </div>

                        <p className="mt-4 text-center text-[11px] text-slate-400">
                            It's free to join JobBridge.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
