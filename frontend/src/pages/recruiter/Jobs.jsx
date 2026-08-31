import {
    BriefcaseBusiness,
    CalendarDays,
    Edit,
    MapPin,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";

const Jobs = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const jobs = [
        {
            id: 1,
            title: "Senior React Developer",
            category: "Development",
            location: "Delhi, India",
            type: "Full Time",
            applications: 32,
            postedDate: "Aug 27, 2026",
            status: "Active",
            description:
                "Looking for an experienced React developer to build scalable and modern web applications.",
            skills: ["React", "JavaScript", "Tailwind CSS"],
        },
        {
            id: 2,
            title: "Backend Developer",
            category: "Development",
            location: "Bangalore, India",
            type: "Full Time",
            applications: 24,
            postedDate: "Aug 25, 2026",
            status: "Active",
            description:
                "We are looking for a backend developer experienced in Node.js, APIs and database development.",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            id: 3,
            title: "UI/UX Designer",
            category: "Design",
            location: "Remote",
            type: "Full Time",
            applications: 18,
            postedDate: "Aug 22, 2026",
            status: "Active",
            description:
                "Join our design team and create intuitive and engaging experiences for our users.",
            skills: ["Figma", "UI Design", "UX Research"],
        },
        {
            id: 4,
            title: "Frontend Developer",
            category: "Development",
            location: "Delhi, India",
            type: "Part Time",
            applications: 15,
            postedDate: "Aug 18, 2026",
            status: "Closed",
            description:
                "Looking for a frontend developer who can build responsive and user-friendly interfaces.",
            skills: ["React", "HTML", "CSS"],
        },
        {
            id: 5,
            title: "HR Executive",
            category: "Human Resources",
            location: "Gurgaon, India",
            type: "Full Time",
            applications: 11,
            postedDate: "Aug 15, 2026",
            status: "Active",
            description:
                "Responsible for recruitment, employee relations and supporting HR operations.",
            skills: ["Recruitment", "Communication", "HR"],
        },
        {
            id: 6,
            title: "Marketing Executive",
            category: "Marketing",
            location: "Mumbai, India",
            type: "Full Time",
            applications: 9,
            postedDate: "Aug 10, 2026",
            status: "Closed",
            description:
                "Help us grow our brand through digital marketing and creative campaigns.",
            skills: ["Marketing", "SEO", "Social Media"],
        },
    ];

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.category.toLowerCase().includes(search.toLowerCase()) ||
            job.location.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || job.status === statusFilter;

        const matchesCategory =
            categoryFilter === "All" ||
            job.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusClasses = (status) => {
        if (status === "Active") {
            return "bg-green-50 text-green-600";
        }

        return "bg-slate-100 text-slate-500";
    };

    return (
        <div>
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Jobs
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage your job postings and track applications.
                    </p>
                </div>

                <button
                    type="button"
                    className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Post a Job
                </button>
            </section>

            {/* Filters */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                    </select>

                    {/* Category */}
                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">All Categories</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Human Resources">
                            Human Resources
                        </option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </div>
            </section>

            {/* Results Header */}
            <div className="mt-7 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Your Job Postings
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {filteredJobs.length}{" "}
                        {filteredJobs.length === 1 ? "job" : "jobs"} found
                    </p>
                </div>
            </div>

            {/* Job Cards */}
            {filteredJobs.length > 0 ? (
                <section className="mt-5 grid gap-5 lg:grid-cols-2">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {job.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {job.category}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                        job.status
                                    )}`}
                                >
                                    {job.status}
                                </span>
                            </div>

                            {/* Job Information */}
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <MapPin
                                        size={16}
                                        className="text-slate-400"
                                    />
                                    {job.location}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <BriefcaseBusiness
                                        size={16}
                                        className="text-slate-400"
                                    />
                                    {job.type}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Users
                                        size={16}
                                        className="text-slate-400"
                                    />
                                    {job.applications} applications
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <CalendarDays
                                        size={16}
                                        className="text-slate-400"
                                    />
                                    Posted {job.postedDate}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-5 text-sm leading-6 text-slate-500">
                                {job.description}
                            </p>

                            {/* Skills */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                                <button
                                    type="button"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Users size={15} />
                                    View Applications
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <Edit size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                /* Empty State */
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No jobs found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                        We couldn't find any jobs matching your search or
                        selected filters.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setCategoryFilter("All");
                        }}
                        className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Jobs;