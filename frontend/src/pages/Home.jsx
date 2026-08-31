import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    MapPin,
    Search,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
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
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            salary: "₹8L - ₹14L",
            skills: ["React", "JavaScript", "Node.js"],
        },
        {
            title: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            salary: "₹7L - ₹12L",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Full Time",
            salary: "₹5L - ₹9L",
            skills: ["Figma", "UI Design", "UX"],
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
            {/* Navbar */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#jobs"
                            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                        >
                            Find Jobs
                        </a>

                        <a
                            href="#companies"
                            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                        >
                            Companies
                        </a>

                        <a
                            href="#categories"
                            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                        >
                            Categories
                        </a>
                    </nav>

                    {/* Auth buttons */}
                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:block"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Your career starts here
                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Find a job where your{" "}
                            <span className="text-indigo-600">
                                potential
                            </span>{" "}
                            can grow.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Discover opportunities that match your skills,
                            connect with great companies, and take the next
                            step in your career with JobBridge.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            {/* Job search */}
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                                <Search
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-400">
                                        What are you looking for?
                                    </p>

                                    <input
                                        type="text"
                                        placeholder="Job title, skills..."
                                        className="mt-1 w-full border-none bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                                <MapPin
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-400">
                                        Location
                                    </p>

                                    <input
                                        type="text"
                                        placeholder="City, state or remote"
                                        className="mt-1 w-full border-none bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Search button */}
                            <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                                <Search size={18} />
                                Search Jobs
                            </button>
                        </div>
                    </div>

                    {/* Popular searches */}
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
                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section
                id="categories"
                className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
            >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            Explore opportunities
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Popular job categories
                        </h2>

                        <p className="mt-2 max-w-xl text-sm text-slate-500">
                            Explore jobs across different industries and find
                            an opportunity that fits your career.
                        </p>
                    </div>

                    <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                        View all categories
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <div
                                key={category.name}
                                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50"
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
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Featured Jobs */}
            <section
                id="jobs"
                className="border-y border-slate-200 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Latest opportunities
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                Featured jobs
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Discover some of the latest opportunities from
                                growing companies.
                            </p>
                        </div>

                        <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            Browse all jobs
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="mt-8 grid gap-5 lg:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <div
                                key={job.title}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                        <Building2 size={22} />
                                    </div>

                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                                        Save
                                    </button>
                                </div>

                                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                    {job.title}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-slate-600">
                                    {job.company}
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.location}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness size={16} />
                                        {job.type}
                                    </div>
                                </div>

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

                                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Salary
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-800">
                                            {job.salary}
                                        </p>
                                    </div>

                                    <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                        View Job
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why JobBridge */}
            <section
                id="companies"
                className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
            >
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Why JobBridge?
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        Everything you need for your job search
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        JobBridge makes it easier to discover jobs, apply to
                        opportunities, and manage your entire career journey.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"
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
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-16 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-600 px-8 py-14 text-center shadow-xl shadow-indigo-200">
                    <h2 className="text-3xl font-bold text-white">
                        Ready to take the next step?
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100">
                        Create your JobBridge account and start discovering
                        opportunities that can move your career forward.
                    </p>

                    <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50">
                        Get Started
                        <ArrowRight size={17} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <BriefcaseBusiness size={17} />
                        </div>

                        <span className="font-bold text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>

                    <p className="text-sm text-slate-500">
                        © 2026 JobBridge. All rights reserved.
                    </p>

                    <div className="flex gap-5 text-sm text-slate-500">
                        <button className="hover:text-indigo-600">
                            About
                        </button>

                        <button className="hover:text-indigo-600">
                            Contact
                        </button>

                        <button className="hover:text-indigo-600">
                            Privacy
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;