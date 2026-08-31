import {
    BriefcaseBusiness,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Heart,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";

const Jobs = () => {
    const jobs = [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            experience: "3 - 5 Years",
            salary: "₹8L - ₹14L",
            posted: "2 days ago",
            skills: ["React", "JavaScript", "Node.js"],
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            experience: "2 - 4 Years",
            salary: "₹7L - ₹12L",
            posted: "3 days ago",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            id: 3,
            title: "Frontend Developer",
            company: "DigitalWorks",
            location: "Mumbai, India",
            type: "Full Time",
            experience: "1 - 3 Years",
            salary: "₹5L - ₹9L",
            posted: "4 days ago",
            skills: ["React", "Tailwind CSS", "JavaScript"],
        },
        {
            id: 4,
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Full Time",
            experience: "2 - 4 Years",
            salary: "₹5L - ₹9L",
            posted: "5 days ago",
            skills: ["Figma", "UI Design", "UX"],
        },
        {
            id: 5,
            title: "Full Stack Developer",
            company: "InnovateTech",
            location: "Hyderabad, India",
            type: "Full Time",
            experience: "3 - 6 Years",
            salary: "₹9L - ₹16L",
            posted: "1 week ago",
            skills: ["React", "Node.js", "MongoDB"],
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Navbar */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <BriefcaseBusiness size={21} />
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#"
                            className="text-sm font-semibold text-indigo-600"
                        >
                            Find Jobs
                        </a>

                        <a
                            href="#"
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
                        >
                            Companies
                        </a>

                        <a
                            href="#"
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
                        >
                            Categories
                        </a>
                    </nav>

                    {/* Auth */}
                    <div className="flex items-center gap-3">
                        <button className="hidden px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 sm:block">
                            Login
                        </button>

                        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Page Header */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            Find your next opportunity
                        </h1>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                            Search thousands of jobs and discover opportunities
                            that match your skills and career goals.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50">
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                                <Search
                                    size={19}
                                    className="shrink-0 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Job title, skills or keywords"
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                                <MapPin
                                    size={19}
                                    className="shrink-0 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>

                            <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                                <Search size={18} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    {/* Filters */}
                    <aside>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal
                                        size={18}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="font-semibold text-slate-900">
                                        Filters
                                    </h2>
                                </div>

                                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                    Clear
                                </button>
                            </div>

                            <div className="mt-6 space-y-5">
                                {/* Category */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>

                                    <div className="relative">
                                        <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500">
                                            <option>
                                                All Categories
                                            </option>
                                            <option>
                                                Software Development
                                            </option>
                                            <option>Design</option>
                                            <option>Marketing</option>
                                            <option>Finance</option>
                                            <option>Sales</option>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Job Type
                                    </label>

                                    <div className="relative">
                                        <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500">
                                            <option>All Job Types</option>
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Experience
                                    </label>

                                    <div className="relative">
                                        <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500">
                                            <option>
                                                All Experience
                                            </option>
                                            <option>Fresher</option>
                                            <option>1 - 3 Years</option>
                                            <option>3 - 5 Years</option>
                                            <option>5+ Years</option>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <div className="relative">
                                        <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500">
                                            <option>
                                                All Locations
                                            </option>
                                            <option>Delhi</option>
                                            <option>Bangalore</option>
                                            <option>Mumbai</option>
                                            <option>Hyderabad</option>
                                            <option>Remote</option>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Jobs */}
                    <section>
                        {/* Results header */}
                        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Available Jobs
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-700">
                                        24
                                    </span>{" "}
                                    job opportunities
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">
                                    Sort by:
                                </span>

                                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 outline-none focus:border-indigo-500">
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                    <option>Salary: High to Low</option>
                                    <option>Salary: Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Cards */}
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <article
                                    key={job.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6"
                                >
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    <BriefcaseBusiness
                                                        size={22}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {job.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                                        {job.company}
                                                    </p>
                                                </div>
                                            </div>

                                            <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                                                <Heart size={18} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={16} />
                                                {job.location}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <BriefcaseBusiness size={16} />
                                                {job.type}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <Clock3 size={16} />
                                                {job.experience}
                                            </span>
                                        </div>

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

                                        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-5">
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Salary
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-800">
                                                        {job.salary}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Posted
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                                        {job.posted}
                                                    </p>
                                                </div>
                                            </div>

                                            <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                                <ChevronLeft size={17} />
                            </button>

                            <button className="h-9 w-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                                1
                            </button>

                            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                2
                            </button>

                            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                3
                            </button>

                            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
                                4
                            </button>

                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-10 border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <p>
                        © 2026 Job<span className="font-semibold text-indigo-600">Bridge</span>.
                        All rights reserved.
                    </p>

                    <div className="flex gap-5">
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

export default Jobs;