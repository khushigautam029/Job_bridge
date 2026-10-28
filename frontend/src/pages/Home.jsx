import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Code2,
    FileText,
    GraduationCap,
    LogIn,
    LogOut,
    MapPin,
    MessagesSquare,
    Moon,
    Search,
    Settings,
    Star,
    Sun,
    User,
    UserCircle,
    UserPlus,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "../pages/Notification";
import { getCompanies } from "../services/companyService";
import {
    formatJobCard,
    getJobCategories,
    getJobs,
    getMyJobCategories,
    getMyJobs,
} from "../services/jobService";
import {
    getSavedJobs,
    saveJob,
    unsaveJob,
} from "../services/savedJobService";

const getCompanyLogoUrl = (logo) => {
    if (!logo) return "";
    if (/^https?:\/\//i.test(logo)) return logo;
    const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
        .replace(/\/api\/?$/, "");
    return `${apiUrl}/${String(logo).replace(/^[\\/]+/, "").replaceAll("\\", "/")}`;
};

const Home = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

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
    const [locationSuggestionsOpen, setLocationSuggestionsOpen] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [topCompanies, setTopCompanies] = useState([]);
    const [showAllCompanies, setShowAllCompanies] = useState(false);
    const [categories, setCategories] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [homeError, setHomeError] = useState("");

    useEffect(() => {
        let active = true;
        const isRecruiter = isLoggedIn && userRole === "RECRUITER";
        Promise.all([
            isRecruiter
                ? getMyJobs().then((jobs) => ({ jobs }))
                : getJobs({ limit: 50 }),
            isRecruiter
                ? getMyJobCategories()
                : getJobCategories(),
        ])
            .then(([jobResult, categoryResult]) => {
                if (!active) return;

                const recruiterJobs = (jobResult.jobs || []).filter(
                    (job) => !isRecruiter || job.status === "OPEN"
                );
                const jobs = recruiterJobs.map(
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

        getCompanies()
            .then((companies) => {
                if (!active) return;
                setTopCompanies(
                    companies
                        .filter((company) => Number(company.openJobsCount) > 0)
                        .sort((a, b) => Number(b.openJobsCount) - Number(a.openJobsCount))
                );
            })
            .catch(() => {
                if (active) setTopCompanies([]);
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

    const visibleCompanies = showAllCompanies
        ? topCompanies
        : topCompanies.slice(0, 4);

    useEffect(() => {
        const elements = document.querySelectorAll(".jobbridge-home .jb-reveal");
        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("jb-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("jb-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [categories, featuredJobs, topCompanies]);

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
        return "/candidate/jobs";
    };

    const getApplicationsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/applications";
        }
        return "/candidate/applications";
    };

    const getInterviewsRoute = () => {
        if (userRole === "RECRUITER") {
            return "/recruiter/interviews";
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

        const jobsRoute = isLoggedIn ? getJobsRoute() : "/jobs";
        navigate(
            queryString
                ? `${jobsRoute}?${queryString}`
                : jobsRoute
        );
    };

    const handleCompanyJobs = (companyName) => {
        const storedUser =
            JSON.parse(localStorage.getItem("user") || "null") ||
            JSON.parse(sessionStorage.getItem("user") || "null");

        // Recruiters should not navigate to another company's jobs
        if (storedUser?.role === "RECRUITER") {
            return;
        }

        // Candidates can view jobs filtered by the selected company
        if (storedUser?.role === "CANDIDATE") {
            navigate(
                `/candidate/jobs?company=${encodeURIComponent(companyName)}`
            );
            return;
        }

        // Preserve your existing authentication flow for guests
        showAuthModal("login");
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

    return (
        <div className="jobbridge-home min-h-screen bg-slate-50 text-slate-800">
            <style>{`
                @keyframes jb-fade-up {
                    from { opacity: 0; transform: translate3d(0, 24px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes jb-fade-down {
                    from { opacity: 0; transform: translate3d(0, -12px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes jb-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes jb-float {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(0, -12px, 0); }
                }
                @keyframes jb-pulse-soft {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, .12); }
                    50% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
                }
                @keyframes jb-shimmer {
                    0% { background-position: 180% 0; }
                    100% { background-position: -180% 0; }
                }
                .jobbridge-home .jb-enter {
                    opacity: 0;
                    animation: jb-fade-up .7s cubic-bezier(.2,.75,.25,1) forwards;
                }
                .jobbridge-home .jb-enter-down {
                    opacity: 0;
                    animation: jb-fade-down .5s ease-out forwards;
                }
                .jobbridge-home .jb-delay-1 { animation-delay: .10s; }
                .jobbridge-home .jb-delay-2 { animation-delay: .20s; }
                .jobbridge-home .jb-delay-3 { animation-delay: .30s; }
                .jobbridge-home .jb-delay-4 { animation-delay: .40s; }
                .jobbridge-home .jb-delay-5 { animation-delay: .50s; }
                .jobbridge-home .jb-delay-6 { animation-delay: .60s; }
                .jobbridge-home .jb-float { animation: jb-float 7s ease-in-out infinite; }
                .jobbridge-home .jb-reveal {
                    opacity: 0;
                    transform: translateY(22px);
                    transition: opacity .65s ease, transform .65s cubic-bezier(.2,.75,.25,1);
                }
                .jobbridge-home .jb-reveal.jb-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .jobbridge-home .jb-reveal:nth-child(4n + 1) { transition-delay: .04s; }
                .jobbridge-home .jb-reveal:nth-child(4n + 2) { transition-delay: .10s; }
                .jobbridge-home .jb-reveal:nth-child(4n + 3) { transition-delay: .16s; }
                .jobbridge-home .jb-reveal:nth-child(4n + 4) { transition-delay: .22s; }
                .jobbridge-home .jb-card {
                    transition: transform .28s cubic-bezier(.2,.75,.25,1), box-shadow .28s ease, border-color .28s ease;
                }
                .jobbridge-home .jb-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 35px -22px rgba(30, 41, 59, .35);
                }
                .jobbridge-home .jb-button {
                    transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease;
                }
                .jobbridge-home .jb-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px -10px rgba(79, 70, 229, .55);
                }
                .jobbridge-home .jb-button:active { transform: translateY(0) scale(.98); }
                .jobbridge-home .jb-dropdown {
                    transform-origin: top right;
                    animation: jb-fade-down .18s ease-out both;
                }
                .jobbridge-home .jb-modal-backdrop { animation: jb-fade-in .2s ease-out both; }
                .jobbridge-home .jb-modal {
                    animation: jb-fade-up .28s cubic-bezier(.2,.75,.25,1) both;
                }
                .jobbridge-home .jb-search-panel {
                    transition: box-shadow .3s ease, border-color .3s ease, transform .3s ease;
                }
                .jobbridge-home .jb-search-panel:focus-within {
                    border-color: rgb(165 180 252);
                    box-shadow: 0 14px 35px -24px rgba(79, 70, 229, .4);
                    transform: translateY(-2px);
                }
                .jobbridge-home .jb-icon-tile {
                    transition: transform .25s ease, background-color .25s ease;
                }
                .jobbridge-home .jb-card:hover .jb-icon-tile { transform: rotate(-4deg) scale(1.06); }
                @keyframes jb-gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes jb-orbit {
                    from { transform: rotate(0deg) translateX(18px) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
                }
                @keyframes jb-bob {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-7px) rotate(3deg); }
                }
                @keyframes jb-ring {
                    0% { transform: scale(.8); opacity: .65; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes jb-shine {
                    0% { transform: translateX(-160%) skewX(-18deg); }
                    55%, 100% { transform: translateX(220%) skewX(-18deg); }
                }
                @keyframes jb-dot-drift {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(10px, -18px, 0); }
                }
                @keyframes jb-underline-grow {
                    from { transform: scaleX(0); transform-origin: left; }
                    to { transform: scaleX(1); transform-origin: left; }
                }
                .jobbridge-home .jb-logo-mark {
                    position: relative;
                    isolation: isolate;
                    transition: transform .35s cubic-bezier(.2,.75,.25,1), box-shadow .35s ease;
                }
                .jobbridge-home .jb-logo-mark::after {
                    content: "";
                    position: absolute;
                    inset: -4px;
                    border: 1px solid rgba(99, 102, 241, .35);
                    border-radius: 12px;
                    z-index: -1;
                    animation: jb-ring 2.8s ease-out infinite;
                }
                .jobbridge-home .jb-brand:hover .jb-logo-mark {
                    transform: rotate(-7deg) scale(1.08);
                    box-shadow: 0 8px 20px -8px rgba(79, 70, 229, .7);
                }
                .jobbridge-home .jb-gradient-text {
                    color: transparent;
                    background: linear-gradient(100deg, #4f46e5 10%, #818cf8 35%, #2563eb 55%, #4f46e5 80%);
                    background-size: 220% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    animation: jb-gradient-shift 6s ease-in-out infinite;
                }
                .jobbridge-home .jb-hero-title { text-wrap: balance; }
                .jobbridge-home .jb-hero-title::after {
                    content: "";
                    display: block;
                    width: 92px;
                    height: 4px;
                    margin: 18px auto 0;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #4f46e5, #93c5fd);
                    transform: scaleX(0);
                    animation: jb-underline-grow .65s .85s ease-out forwards;
                }
                .jobbridge-home .jb-hero-orb {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #a5b4fc, #60a5fa);
                    opacity: .55;
                    pointer-events: none;
                    animation: jb-dot-drift 6s ease-in-out infinite;
                }
                .jobbridge-home .jb-hero-orb-two { animation-delay: -2.2s; animation-duration: 7.5s; }
                .jobbridge-home .jb-hero-orb-three { animation-delay: -4s; animation-duration: 8.5s; }
                .jobbridge-home .jb-card { position: relative; isolation: isolate; overflow: hidden; }
                .jobbridge-home .jb-card::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 42%;
                    background: linear-gradient(100deg, transparent, rgba(255,255,255,.52), transparent);
                    transform: translateX(-160%) skewX(-18deg);
                    pointer-events: none;
                    z-index: 0;
                }
                .jobbridge-home .jb-card:hover::after { animation: jb-shine .8s ease; }
                .jobbridge-home .jb-card > * { position: relative; z-index: 1; }
                .jobbridge-home .jb-feature-icon { transition: transform .3s ease; }
                .jobbridge-home .jb-card:hover .jb-feature-icon { animation: jb-bob .65s ease-in-out; }
                .jobbridge-home .jb-save-button { transition: transform .22s ease, background-color .22s ease, color .22s ease; }
                .jobbridge-home .jb-save-button:hover { transform: scale(1.06); }
                .jobbridge-home .jb-save-button:active { transform: scale(.93); }
                .jobbridge-home .jb-section-kicker { display: inline-flex; align-items: center; gap: 8px; }
                .jobbridge-home .jb-section-kicker::before {
                    content: ""; width: 22px; height: 2px; border-radius: 99px; background: currentColor;
                }
                .jobbridge-home .jb-notice { animation: jb-fade-down .32s ease-out both; }
                .jobbridge-home .jb-cta-panel { position: relative; isolation: isolate; }
                .jobbridge-home .jb-cta-panel::before,
                .jobbridge-home .jb-cta-panel::after {
                    content: ""; position: absolute; border: 1px solid rgba(255,255,255,.18);
                    border-radius: 999px; pointer-events: none; z-index: -1;
                }
                .jobbridge-home .jb-cta-panel::before { width: 240px; height: 240px; right: -70px; top: -145px; }
                .jobbridge-home .jb-cta-panel::after { width: 180px; height: 180px; left: -75px; bottom: -115px; }
                .jobbridge-home .jb-cta-icon { animation: jb-bob 4s ease-in-out infinite; }
                .jobbridge-home .jb-profile-trigger:hover .jb-avatar { transform: rotate(-8deg) scale(1.06); }
                .jobbridge-home .jb-avatar { transition: transform .25s ease; }
                .jobbridge-home .jb-nav-link { position: relative; }
                .jobbridge-home .jb-nav-link::after {
                    content: ""; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px;
                    border-radius: 999px; background: #6366f1; transform: scaleX(0); transition: transform .22s ease;
                }
                .jobbridge-home .jb-nav-link:hover::after { transform: scaleX(1); }
                @media (prefers-reduced-motion: reduce) {
                    .jobbridge-home *, .jobbridge-home *::before, .jobbridge-home *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                    .jobbridge-home .jb-enter, .jobbridge-home .jb-enter-down { opacity: 1; }
                    .jobbridge-home .jb-reveal { opacity: 1; transform: none; }
                }
            `}</style>

            {/* SUCCESS MESSAGE */}
            {successMessage && (
                <div className="jb-notice fixed left-1/2 top-4 z-[100] -translate-x-1/2 px-4">
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
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur jb-enter-down">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">

                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            navigate("/", { replace: true });
                        }}
                        className="jb-brand flex shrink-0 items-center gap-2 cursor-pointer"
                    >
                        <div className="jb-logo-mark flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Job
                            <span className="text-indigo-600">Bridge</span>
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
                                            className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Search size={16} />
                                            Find Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleApplicationsNavigation
                                            }
                                            className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
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
                                            className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Bookmark size={16} />
                                            Saved Jobs
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                handleInterviewsNavigation
                                            }
                                            className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
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
                                        className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <BriefcaseBusiness size={16} />
                                        Jobs
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleApplicationsNavigation
                                        }
                                        className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
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
                                        className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <Users size={16} />
                                        Candidates
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleInterviewsNavigation
                                        }
                                        className="jb-nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
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
                                onOpen={() => setProfileMenuOpen(false)}
                                closeSignal={profileMenuOpen}
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
                                className={`jb-profile-trigger flex items-center gap-2 rounded-lg px-2 py-1.5 transition ${profileMenuOpen
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="jb-avatar flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
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
                                    className={`hidden text-slate-400 transition-transform sm:block ${profileMenuOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {/* PROFILE DROPDOWN */}
                            {profileMenuOpen && (
                                <div className="jb-dropdown absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

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
                                                    View and Update profile
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
                        {/* DARK MODE TOGGLE */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isDarkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            title={
                                isDarkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${isDarkMode
                                ? "border-slate-700 bg-slate-800 text-amber-300 hover:bg-slate-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                        >
                            {isDarkMode ? (
                                <Sun size={19} />
                            ) : (
                                <Moon size={19} />
                            )}
                        </button>

                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="jb-hero relative overflow-hidden border-b border-slate-100 bg-white">
                <div className="pointer-events-none absolute inset-0 opacity-[0.22]" style={{ backgroundImage: "radial-gradient(#a5b4fc 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }} />
                <span className="jb-hero-orb left-[12%] top-[24%]" />
                <span className="jb-hero-orb jb-hero-orb-two right-[15%] top-[30%] h-3 w-3" />
                <span className="jb-hero-orb jb-hero-orb-three bottom-[18%] right-[28%] h-2 w-2" />
                <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-50 blur-3xl jb-float" />

                <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-50 blur-3xl jb-float" />

                <div className="relative mx-auto max-w-[1400px] px-5 pb-14 pt-12 sm:px-7 lg:px-8 lg:pb-16 lg:pt-16">

                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 jb-enter jb-delay-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            Thousands of opportunities waiting for you
                        </div>

                        <h1 className="jb-hero-title jb-enter jb-delay-2 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[56px]">
                            Find work that moves your{" "}
                            <span className="jb-gradient-text inline-block">
                                career forward.
                            </span>
                        </h1>

                        <p className="jb-enter jb-delay-3 mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Discover jobs from trusted companies, apply with confidence, and build the career you deserve with JobBridge.
                        </p>
                    </div>

                    {/* SEARCH */}
                    <div className={`jb-enter jb-delay-4 jb-search-panel relative z-20 mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-2.5 shadow-lg shadow-slate-200/60 ${locationSuggestionsOpen ? "pb-[16rem]" : ""}`}>
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

                                    <LocationAutocomplete
                                        value={searchLocation}
                                        onSuggestionsOpenChange={setLocationSuggestionsOpen}
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
                                        className="mt-0.5 w-full"
                                        inputClassName="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* SEARCH BUTTON */}
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="jb-button flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Search size={18} />
                                Search Jobs
                            </button>
                        </div>
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
                        <p className="jb-section-kicker text-xs font-bold uppercase tracking-wider text-indigo-600">
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
                        className="jb-button flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
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
                                className="jb-card jb-reveal group flex min-h-[150px] flex-col rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-indigo-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="jb-icon-tile flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
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
                            <p className="jb-section-kicker text-xs font-bold uppercase tracking-wider text-indigo-600">
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
                            className="jb-button flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            Browse all jobs
                            <ArrowRight size={15} />
                        </button>
                    </div>

                    <div className="mt-7 grid gap-4 lg:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="jb-card jb-reveal group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 hover:bg-white"
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
                                        className={`jb-save-button flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${savedJobIds.includes(
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

            {/* COMPANIES */}
            {(JSON.parse(localStorage.getItem("user") || "null") ||
                JSON.parse(sessionStorage.getItem("user") || "null"))?.role === "CANDIDATE" &&
                topCompanies.length > 0 && (
                    <section id="home-companies" data-scroll-anchor className="bg-slate-50">
                        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-8">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <p className="jb-section-kicker text-xs font-bold uppercase tracking-wider text-indigo-600">
                                        Discover employers
                                    </p>
                                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                        Explore jobs by top companies
                                    </h2>
                                    <p className="mt-1.5 text-sm text-slate-500">
                                        Find employers with open roles on JobBridge.
                                    </p>
                                </div>
                                {(JSON.parse(localStorage.getItem("user") || "null") ||
                                    JSON.parse(sessionStorage.getItem("user") || "null"))?.role === "CANDIDATE" &&
                                    topCompanies.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllCompanies((current) => !current)}
                                            className="jb-button flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                                        >
                                            {showAllCompanies ? "Show fewer" : "View all"}
                                            <ArrowRight size={15} />
                                        </button>
                                    )}
                            </div>

                            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {visibleCompanies.map((company) => (
                                    <article
                                        key={company.id}
                                        className="jb-card jb-reveal flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                                            {company.logo ? (
                                                <img
                                                    src={getCompanyLogoUrl(company.logo)}
                                                    alt={`${company.name} logo`}
                                                    className="h-full w-full object-contain"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <Building2 size={25} className="text-indigo-600" />
                                            )}
                                        </div>
                                        <h3 className="mt-3 w-full truncate text-base font-semibold text-slate-900" title={company.name}>
                                            {company.name}
                                        </h3>
                                        <div className="mt-3 w-full rounded-xl bg-emerald-50 px-3 py-2.5">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {Number(company.openJobsCount)} open {Number(company.openJobsCount) === 1 ? "job" : "jobs"}
                                            </p>
                                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                                No reviews yet
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCompanyJobs(company.name)}
                                            className="mt-4 rounded-full border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                                        >
                                            View jobs
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            {/* CTA */}
            {!isLoggedIn && (
                <section className="px-5 pb-14 sm:px-7 lg:px-8">
                    <div className="jb-cta-panel mx-auto max-w-[1400px] overflow-hidden rounded-2xl bg-indigo-600 px-6 py-10 text-center shadow-lg shadow-indigo-200">
                        <div className="jb-cta-icon mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
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


            {/* CAREER RESOURCES & HOW IT WORKS */}

            <section
                id="career-resources"
                className="border-t border-slate-100 bg-white"
            >
                <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-7 lg:px-8">

                    {/* HEADING */}
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="jb-section-kicker text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Your career starts here
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Your next career move starts here
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                            Discover opportunities, apply for jobs, and take
                            the next step towards your career goals with JobBridge.
                        </p>
                    </div>

                    {/* HOW IT WORKS */}
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: Search,
                                title: "Find the Right Job",
                                description:
                                    "Explore job openings by title, skills, category, and location.",
                                number: "01",
                            },
                            {
                                icon: FileText,
                                title: "Apply with Confidence",
                                description:
                                    "Review job requirements and submit your application with your resume.",
                                number: "02",
                            },
                            {
                                icon: CalendarDays,
                                title: "Track Your Progress",
                                description:
                                    "Keep track of your applications, interview schedules, and updates.",
                                number: "03",
                            },
                        ].map((step) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.number}
                                    className="jb-card jb-reveal rounded-xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <Icon size={21} />
                                        </div>

                                        <span className="text-2xl font-bold text-indigo-100">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-base font-bold text-slate-900">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* CAREER RESOURCES HEADING */}
                    <div className="mt-14 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                            <p className="jb-section-kicker text-xs font-bold uppercase tracking-wider text-indigo-600">
                                Learn and grow
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Career resources
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Practical guidance, helpful examples, and checklists
                                to help you prepare for your next opportunity.
                            </p>
                        </div>
                    </div>

                    {/* RESOURCE CARDS */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: FileText,
                                title: "Resume Writing Tips",
                                description:
                                    "Learn how to present your skills, education, internships, and projects in a professional resume.",
                                action: "Explore resume tips",
                                path: "/career-resources/resume-writing-tips",
                                number: "01",
                            },
                            {
                                icon: MessagesSquare,
                                title: "Interview Preparation",
                                description:
                                    "Prepare for common HR questions and learn to communicate your experience confidently.",
                                action: "Prepare for interviews",
                                path: "/career-resources/interview-preparation",
                                number: "02",
                            },
                            {
                                icon: GraduationCap,
                                title: "Fresher's Career Guide",
                                description:
                                    "Discover how to find your first job, build useful skills, and gain practical experience.",
                                action: "Read the career guide",
                                path: "/career-resources/freshers-career-guide",
                                number: "03",
                            },
                            {
                                icon: Code2,
                                title: "Technical Interview Tips",
                                description:
                                    "Prepare for programming questions, DSA, OOP, SQL, and project-based discussions.",
                                action: "Start preparing",
                                path: "/career-resources/technical-interview-tips",
                                number: "04",
                            },
                        ].map((resource) => {
                            const Icon = resource.icon;

                            return (
                                <Link
                                    key={resource.title}
                                    to={resource.path}
                                    className="jb-card jb-reveal group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="jb-icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                                            <Icon size={21} />
                                        </div>

                                        <span className="text-sm font-bold text-slate-300 transition group-hover:text-indigo-300">
                                            {resource.number}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-base font-bold text-slate-900 transition group-hover:text-indigo-600">
                                        {resource.title}
                                    </h3>

                                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                                        {resource.description}
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                                        {resource.action}
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"

                                        />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </section>

            <footer className="mt-auto border-t border-slate-200 bg-white">
                <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-7 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                        {/* BRAND SECTION */}
                        <div className="sm:col-span-2 lg:col-span-2">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                                    <BriefcaseBusiness size={21} />
                                </div>

                                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                                    Job<span className="text-indigo-600">Bridge</span>
                                </span>
                            </Link>

                            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                                Connecting talented people with meaningful career
                                opportunities. Find jobs, discover companies, and take
                                the next step in your professional journey with JobBridge.
                            </p>
                        </div>

                        {/* QUICK LINKS */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Quick Links
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm text-slate-500">
                                <li>
                                    <Link
                                        to="/about"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        About Us
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/features"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Our Features
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Home
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* SUPPORT */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Support
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm text-slate-500">
                                <li>
                                    <Link
                                        to="/contact"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Contact Us
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/privacy"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/terms"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* BOTTOM BAR */}
                    <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} JobBridge. All rights reserved.
                        </p>

                        <p className="text-xs text-slate-500">
                            Built to connect talent with opportunity.
                        </p>
                    </div>
                </div>
            </footer>

            {/* AUTH MODAL */}
            {showAuthModal && (
                <div className="jb-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
                    <div className="jb-modal relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

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
