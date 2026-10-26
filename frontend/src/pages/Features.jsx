
import {
    ArrowRight,
    Bell,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    FileText,
    LayoutDashboard,
    MapPin,
    Search,
    UserRound,
    Users,
    UserSearch,
    Video,
} from "lucide-react";
import { Link } from "react-router-dom";

const candidateFeatures = [
    {
        icon: Search,
        title: "Find Jobs",
        description:
            "Search job opportunities and explore openings based on your interests, skills, and preferred location.",
        link: "/candidate/jobs",
        linkText: "Explore Jobs",
    },
    {
        icon: Bookmark,
        title: "Saved Jobs",
        description:
            "Save interesting job openings so you can easily revisit them when you are ready to apply.",
        link: "/candidate/saved-jobs",
        linkText: "View Saved Jobs",
    },
    {
        icon: FileText,
        title: "Applications",
        description:
            "Keep track of your job applications and check their progress from your candidate account.",
        link: "/candidate/applications",
        linkText: "My Applications",
    },
    {
        icon: CalendarDays,
        title: "Interviews",
        description:
            "Keep your interview schedule organized and stay informed about upcoming interview opportunities.",
        link: "/candidate/interviews",
        linkText: "View Interviews",
    },
    {
        icon: Bell,
        title: "Notifications",
        description:
            "Stay informed about important updates and activities related to your job search.",
        link: "/candidate/notifications",
        linkText: "View Notifications",
    },
    {
        icon: UserRound,
        title: "My Profile",
        description:
            "Maintain your professional information and resume to help recruiters understand your experience.",
        link: "/candidate/profile",
        linkText: "Manage Profile",
    },
];

const recruiterFeatures = [
    {
        icon: BriefcaseBusiness,
        title: "Manage Job Listings",
        description:
            "Create job openings and manage the positions you have posted from your recruiter account.",
        link: "/recruiter/jobs",
        linkText: "Manage Jobs",
    },
    {
        icon: Users,
        title: "Manage Applications",
        description:
            "Review applications submitted for your jobs and manage your candidate selection process.",
        link: "/recruiter/applications",
        linkText: "View Applications",
    },
    {
        icon: CalendarDays,
        title: "Interview Management",
        description:
            "Organize candidate interviews and manage the interview process for your job openings.",
        link: "/recruiter/interviews",
        linkText: "Manage Interviews",
    },
    {
        icon: Building2,
        title: "Recruiter Profile",
        description:
            "Maintain your recruiter information and relevant company details on the platform.",
        link: "/recruiter/profile",
        linkText: "View Profile",
    },
];

const highlights = [
    {
        icon: UserSearch,
        title: "Candidate and Recruiter Accounts",
        description:
            "Separate experiences help candidates focus on finding jobs while recruiters manage their own hiring activities.",
    },
    {
        icon: MapPin,
        title: "Location-Based Job Discovery",
        description:
            "Explore opportunities using location information to find jobs that better match your preferences.",
    },
    {
        icon: Video,
        title: "Interview Coordination",
        description:
            "Keep interview details and schedules organized, including online interview arrangements where supported.",
    },
    {
        icon: LayoutDashboard,
        title: "Organized Workspaces",
        description:
            "Dedicated dashboards help users access the features and information relevant to their roles.",
    },
];

const FeatureCard = ({ feature }) => {
    const Icon = feature.icon;

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={23} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
                {feature.title}
            </h3>

            <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                {feature.description}
            </p>

            <Link
                to={feature.link}
                className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
                {feature.linkText}
                <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                />
            </Link>
        </article>
    );
};

const Features = () => {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                        <BriefcaseBusiness size={17} />
                        Explore JobBridge
                    </span>

                    <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        Everything you need for your
                        <span className="block text-indigo-600">
                            career journey.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                        Discover the tools that help candidates explore
                        opportunities and help recruiters manage job listings,
                        applications, and interviews in one place.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/candidate/jobs"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                        >
                            Find Jobs
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/recruiter/jobs"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            For Recruiters
                        </Link>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            "Job Discovery",
                            "Application Tracking",
                            "Recruitment Management",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm"
                            >
                                <CheckCircle2
                                    size={18}
                                    className="shrink-0 text-emerald-600"
                                />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CANDIDATE FEATURES */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                            For Job Seekers
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Build your career with confidence
                        </h2>
                    </div>

                    <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                        Explore jobs, manage applications, and keep your
                        professional journey organized.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {candidateFeatures.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                        />
                    ))}
                </div>
            </section>

            {/* RECRUITER FEATURES */}
            <section className="border-y border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                    <div className="mb-9">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                            For Recruiters
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Make hiring more organized
                        </h2>

                        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                            Manage your own job openings and related
                            recruitment activities through your recruiter
                            workspace.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {recruiterFeatures.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                feature={feature}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* PLATFORM HIGHLIGHTS */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                        Platform Highlights
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Designed around your hiring journey
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                        JobBridge brings important job-search and recruitment
                        activities together in an organized experience.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {highlights.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md sm:p-7"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Icon size={23} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
                <div className="mx-auto max-w-7xl rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-xl shadow-indigo-200 sm:px-12 sm:py-16">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Ready to get started?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-indigo-100">
                        Take the next step in your career or start managing
                        your hiring activities with JobBridge.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/candidate/jobs"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                            Explore Jobs
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center rounded-xl border border-indigo-300 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Features;
