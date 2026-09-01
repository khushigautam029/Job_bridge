import {
    ArrowRight,
    Bell,
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
    const [showAuthModal, setShowAuthModal] =
        useState(false);
    const [authAction, setAuthAction] = useState("");
    const [profileMenuOpen, setProfileMenuOpen] =
        useState(false);
    const [searchKeyword, setSearchKeyword] =
        useState("");
    const [searchLocation, setSearchLocation] =
        useState("");
    const [successMessage, setSuccessMessage] =
        useState("");
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

    const getNotificationsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/notifications";
        }

        if (userRole === "ADMIN") {
            return "/admin/dashboard";
        }

        return "/candidate/notifications";
    };

    const requireLogin = (action, jobId = null) => {
        if (!isLoggedIn) {
            setAuthAction(action);
            setShowAuthModal(true);
            return;
        }

        if (jobId) {
            navigate(`${getJobsRoute()}/${jobId}`);
            return;
        }

        navigate(getJobsRoute());
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

    const handleNotificationsNavigation = () => {
        if (!isLoggedIn) {
            setAuthAction("notifications");
            setShowAuthModal(true);
            return;
        }

        navigate(getNotificationsRoute());
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

    const categories = [
        {
            name: "Software Development",
            jobs: "1,240 Jobs",
            icon: BriefcaseBusiness,
        },
        {
            name: "Design",
            jobs: "580 Jobs",
            icon: Users,
        },
        {
            name: "Marketing",
            jobs: "430 Jobs",
            icon: Building2,
        },
        {
            name: "Finance",
            jobs: "320 Jobs",
            icon: BriefcaseBusiness,
        },
        {
            name: "Human Resources",
            jobs: "210 Jobs",
            icon: Users,
        },
        {
            name: "Sales",
            jobs: "390 Jobs",
            icon: Building2,
        },
    ];

    const featuredJobs = [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            salary: "₹8L - ₹14L",
            skills: [
                "React",
                "JavaScript",
                "Node.js",
            ],
            posted: "2 days ago",
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            salary: "₹7L - ₹12L",
            skills: [
                "Node.js",
                "Express",
                "MySQL",
            ],
            posted: "1 day ago",
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Full Time",
            salary: "₹5L - ₹9L",
            skills: [
                "Figma",
                "UI Design",
                "UX",
            ],
            posted: "3 days ago",
        },
    ];

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
            {successMessage && (
                <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 px-4">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-3 shadow-xl shadow-slate-200/70">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={18} />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                            {successMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage("")
                            }
                            className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:px-10">

                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>
                    </button>

                    {isLoggedIn && (
                        <nav className="hidden items-center gap-1 lg:flex">

                            {userRole !== "RECRUITER" &&
                                userRole !== "ADMIN" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={
                                                handleJobsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Search size={17} />
                                            Find Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplicationsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <FileText
                                                size={17}
                                            />
                                            Applications
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/candidate/saved-jobs"
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Bookmark
                                                size={17}
                                            />
                                            Saved Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleInterviewsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <CalendarDays
                                                size={17}
                                            />
                                            Interviews
                                        </button>
                                    </>
                                )}

                            {/* RECRUITER */}

                            {userRole ===
                                "RECRUITER" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={
                                                handleJobsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <BriefcaseBusiness
                                                size={17}
                                            />
                                            Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplicationsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <FileText
                                                size={17}
                                            />
                                            Applications
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/recruiter/candidates"
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Users size={17} />
                                            Candidates
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleInterviewsNavigation
                                            }
                                            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <CalendarDays
                                                size={17}
                                            />
                                            Interviews
                                        </button>
                                    </>
                                )}

                        </nav>
                    )}

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-2">

                        {isLoggedIn && (
                            <button
                                type="button"
                                onClick={
                                    handleNotificationsNavigation
                                }
                                className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                                title="Notifications"
                            >
                                <Bell size={20} />

                                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                                    3
                                </span>
                            </button>
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
                                className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition ${profileMenuOpen
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <User size={18} />
                                </div>

                                <div className="hidden text-left sm:block">

                                    <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                                        {isLoggedIn
                                            ? userName
                                            : "Account"}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {isLoggedIn
                                            ? userRole ===
                                                "RECRUITER"
                                                ? "Recruiter"
                                                : userRole ===
                                                    "ADMIN"
                                                    ? "Administrator"
                                                    : "Candidate"
                                            : "Login / Register"}
                                    </p>

                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`hidden text-slate-400 transition-transform sm:block ${profileMenuOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {/* PROFILE DROPDOWN */}

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">

                                    {!isLoggedIn && (
                                        <>
                                            <div className="border-b border-slate-100 px-4 py-4">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Welcome to JobBridge
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    Sign in or create an account
                                                    to explore jobs and manage
                                                    your career.
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
                                                    <LogIn size={18} />
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
                                                    <UserPlus
                                                        size={18}
                                                    />
                                                    Register
                                                </button>

                                            </div>
                                        </>
                                    )}

                                    {isLoggedIn && (
                                        <>
                                            <div className="border-b border-slate-100 px-4 py-3.5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                        <User size={18} />
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
                                                    <UserCircle
                                                        size={18}
                                                    />
                                                    My Profile
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleSettingsClick
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    <Settings
                                                        size={18}
                                                    />
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
                                                    <LogOut
                                                        size={18}
                                                    />
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

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden bg-white">

                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-50 blur-3xl" />

                <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

                <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-16 sm:px-7 lg:px-10 lg:pb-24 lg:pt-24">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">

                            <span className="h-2 w-2 rounded-full bg-indigo-600" />

                            Thousands of opportunities waiting for you

                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Find work that moves your{" "}
                            <span className="text-indigo-600">
                                career forward.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Discover jobs from trusted companies, apply with
                            confidence, and build the career you deserve with
                            JobBridge.
                        </p>

                    </div>

                    {/* SEARCH */}

                    <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">

                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">

                                <Search
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="text-xs font-medium text-slate-400">
                                        Job title or keyword
                                    </p>

                                    <input
                                        type="text"
                                        value={
                                            searchKeyword
                                        }
                                        onChange={(event) =>
                                            setSearchKeyword(
                                                event.target
                                                    .value
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
                                        className="mt-1 w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />

                                </div>

                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">

                                <MapPin
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="text-xs font-medium text-slate-400">
                                        Location
                                    </p>

                                    <input
                                        type="text"
                                        value={
                                            searchLocation
                                        }
                                        onChange={(event) =>
                                            setSearchLocation(
                                                event.target
                                                    .value
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
                                        className="mt-1 w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={handleSearch}
                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                <Search size={18} />
                                Search Jobs
                            </button>

                        </div>

                    </div>

                    {/* POPULAR */}

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">

                        <span className="mr-1 text-slate-500">
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
                                    handlePopularSearch(
                                        item
                                    )
                                }
                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                </div>
            </section>

            {/* =================================================
                CATEGORIES
            ================================================= */}

            <section
                id="categories"
                className="mx-auto max-w-[1440px] px-5 py-20 sm:px-7 lg:px-10"
            >

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            Explore opportunities
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Browse jobs by category
                        </h2>

                        <p className="mt-2 max-w-xl text-sm text-slate-500">
                            Find opportunities across industries and discover
                            where your skills can make an impact.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            handleJobsNavigation
                        }
                        className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        View all jobs
                        <ArrowRight size={16} />
                    </button>

                </div>

                <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => {

                        const Icon = category.icon;

                        return (
                            <button
                                key={category.name}
                                type="button"
                                onClick={() =>
                                    handleCategoryClick(
                                        category.name
                                    )
                                }
                                className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Icon size={21} />
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                                    />

                                </div>

                                <h3 className="mt-5 font-semibold text-slate-800">
                                    {category.name}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {category.jobs}
                                </p>

                            </button>
                        );
                    })}

                </div>
            </section>

            {/* =================================================
                FEATURED JOBS
            ================================================= */}

            <section
                id="jobs"
                className="border-y border-slate-200 bg-white"
            >

                <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-7 lg:px-10">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Latest opportunities
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                Featured jobs
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Explore roles from companies looking for
                                talented people like you.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={
                                handleJobsNavigation
                            }
                            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Browse all jobs
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    <div className="mt-9 grid gap-5 lg:grid-cols-3">

                        {featuredJobs.map((job) => (

                            <div
                                key={job.id}
                                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                            <Building2 size={22} />
                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Company
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700">
                                                {job.company}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            requireLogin(
                                                "save"
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
                                    >
                                        Save
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleFeaturedJobClick(
                                            job.id
                                        )
                                    }
                                    className="mt-6 text-left"
                                >
                                    <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600">
                                        {job.title}
                                    </h3>
                                </button>

                                <div className="mt-4 space-y-2 text-sm text-slate-500">

                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.location}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness
                                            size={16}
                                        />
                                        {job.type}
                                    </div>

                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">

                                    {job.skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                                </div>

                                <div className="mt-6 border-t border-slate-200 pt-5">

                                    <div className="flex items-end justify-between">

                                        <div>

                                            <p className="text-xs text-slate-400">
                                                Salary
                                            </p>

                                            <p className="mt-1 font-semibold text-slate-800">
                                                {job.salary}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Posted{" "}
                                                {job.posted}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                requireLogin("apply", job.id)
                                            }
                                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            View & Apply
                                            <ArrowRight
                                                size={15}
                                            />
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* =================================================
                FEATURES
            ================================================= */}

            <section
                id="features"
                className="mx-auto max-w-[1440px] px-5 py-20 sm:px-7 lg:px-10"
            >

                <div className="mx-auto max-w-2xl text-center">

                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Why JobBridge?
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        Your career journey, simplified
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        From discovering your next opportunity to tracking your
                        applications, JobBridge keeps everything in one place.
                    </p>

                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">

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
                                className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Icon size={23} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {feature.description}
                                </p>

                            </button>
                        );
                    })}

                </div>
            </section>

            {/* =================================================
                CTA
            ================================================= */}

            {!isLoggedIn && (
                <section className="px-5 pb-20 sm:px-7 lg:px-10">

                    <div className="mx-auto max-w-[1440px] overflow-hidden rounded-3xl bg-indigo-600 px-8 py-14 text-center shadow-xl shadow-indigo-200">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                            <BriefcaseBusiness size={27} />
                        </div>

                        <h2 className="mt-5 text-3xl font-bold text-white">
                            Your next opportunity is waiting.
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100">
                            Create your free JobBridge account and start
                            exploring jobs that match your skills and ambitions.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/register"
                                )
                            }
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                            Create Free Account
                            <ArrowRight size={17} />
                        </button>

                    </div>
                </section>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="border-t border-slate-200 bg-white">

                <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">

                    <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <BriefcaseBusiness size={17} />
                        </div>

                        <span className="font-bold text-slate-900">
                            Job
                            <span className="text-indigo-600">
                                Bridge
                            </span>
                        </span>

                    </div>

                    <p className="text-sm text-slate-500">
                        © 2026 JobBridge. All rights reserved.
                    </p>

                    <div className="flex gap-5 text-sm text-slate-500">

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
                            className="hover:text-indigo-600"
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
                            className="hover:text-indigo-600"
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
                            className="hover:text-indigo-600"
                        >
                            Privacy
                        </button>

                    </div>
                </div>
            </footer>

            {/* =================================================
                LOGIN / REGISTER MODAL
            ================================================= */}

            {showAuthModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

                    <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

                        <button
                            type="button"
                            onClick={() =>
                                setShowAuthModal(
                                    false
                                )
                            }
                            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness
                                size={22}
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Sign in to continue
                        </h2>
 
                        <p className="mt-2 text-sm leading-6 text-slate-500">

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

                        <div className="mt-6 space-y-3">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <LogIn size={18} />
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <UserPlus size={18} />
                                Create an Account
                            </button>

                        </div>

                        <p className="mt-5 text-center text-xs text-slate-400">
                            It's free to join JobBridge.
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
