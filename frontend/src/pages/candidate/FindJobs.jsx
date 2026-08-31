import {
    Bookmark,
    BriefcaseBusiness,
    ChevronDown,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const FindJobs = () => {
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("All");
    const [experience, setExperience] = useState("All");

    const jobs = [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            experience: "3-5 Years",
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
            experience: "2-4 Years",
            salary: "₹7L - ₹12L",
            posted: "3 days ago",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            id: 3,
            title: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            type: "Full Time",
            experience: "1-3 Years",
            salary: "₹6L - ₹10L",
            posted: "4 days ago",
            skills: ["React", "Tailwind CSS", "JavaScript"],
        },
        {
            id: 4,
            title: "Full Stack Developer",
            company: "Innovate Labs",
            location: "Gurgaon, India",
            type: "Full Time",
            experience: "3-5 Years",
            salary: "₹9L - ₹15L",
            posted: "5 days ago",
            skills: ["MERN", "MongoDB", "Node.js"],
        },
        {
            id: 5,
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Part Time",
            experience: "1-3 Years",
            salary: "₹5L - ₹9L",
            posted: "1 week ago",
            skills: ["Figma", "UI Design", "UX"],
        },
        {
            id: 6,
            title: "Software Engineer",
            company: "NextGen Technologies",
            location: "Noida, India",
            type: "Full Time",
            experience: "2-4 Years",
            salary: "₹8L - ₹13L",
            posted: "1 week ago",
            skills: ["Java", "Spring Boot", "MySQL"],
        },
    ];

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            job.company
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            job.skills.some((skill) =>
                skill.toLowerCase().includes(search.toLowerCase())
            );

        const matchesLocation =
            !location ||
            job.location
                .toLowerCase()
                .includes(location.toLowerCase());

        const matchesType =
            jobType === "All" || job.type === jobType;

        const matchesExperience =
            experience === "All" ||
            job.experience === experience;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesType &&
            matchesExperience
        );
    });

    return (
        <div>
            {/* Page Heading */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Opportunities
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Find Jobs
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Discover jobs that match your skills and career goals.
                </p>
            </div>

            {/* Search Area */}
            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
                    {/* Search */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                        <Search
                            size={19}
                            className="shrink-0 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Job title, company or skill"
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                        <MapPin
                            size={19}
                            className="shrink-0 text-slate-400"
                        />

                        <input
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            placeholder="Location"
                            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Job Type */}
                    <div className="relative">
                        <select
                            value={jobType}
                            onChange={(e) =>
                                setJobType(e.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-600 outline-none focus:border-indigo-400"
                        >
                            <option value="All">All Job Types</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Internship">
                                Internship
                            </option>
                        </select>

                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
                        />
                    </div>

                    {/* Experience */}
                    <div className="relative">
                        <select
                            value={experience}
                            onChange={(e) =>
                                setExperience(e.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-600 outline-none focus:border-indigo-400"
                        >
                            <option value="All">
                                All Experience
                            </option>
                            <option value="1-3 Years">
                                1-3 Years
                            </option>
                            <option value="2-4 Years">
                                2-4 Years
                            </option>
                            <option value="3-5 Years">
                                3-5 Years
                            </option>
                        </select>

                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <SlidersHorizontal size={17} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Results Header */}
            <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        Available Jobs
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Showing {filteredJobs.length} opportunities
                    </p>
                </div>

                <select className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
                    <option>Most Recent</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                </select>
            </div>

            {/* Job List */}
            <div className="mt-5 grid gap-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6"
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                {/* Job Info */}
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900">
                                            {job.title}
                                        </h4>

                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            {job.company}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={14} />
                                                {job.location}
                                            </span>

                                            <span>
                                                💼 {job.type}
                                            </span>

                                            <span>
                                                💰 {job.salary}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Save */}
                                <button
                                    type="button"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Bookmark size={18} />
                                </button>
                            </div>

                            {/* Bottom */}
                            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
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

                                <div className="flex items-center justify-between gap-5 sm:justify-end">
                                    <span className="text-xs text-slate-400">
                                        {job.posted}
                                    </span>

                                    <button
                                        type="button"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        View Job
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <Search size={22} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No jobs found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindJobs;