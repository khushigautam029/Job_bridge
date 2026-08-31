import {
    BriefcaseBusiness,
    ChevronDown,
    ExternalLink,
    Eye,
    FileText,
    MapPin,
    Search,
    User,
    Users,
} from "lucide-react";

import { useState } from "react";

const Candidates = () => {
    const [search, setSearch] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");

    const candidates = [
        {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            title: "Senior React Developer",
            location: "Delhi, India",
            experience: "5 Years",
            skills: ["React", "JavaScript", "Node.js", "TypeScript"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 2,
            name: "Priya Singh",
            email: "priya.singh@example.com",
            title: "Backend Developer",
            location: "Bangalore, India",
            experience: "4 Years",
            skills: ["Node.js", "Express", "MySQL", "REST API"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 3,
            name: "Aman Verma",
            email: "aman.verma@example.com",
            title: "Full Stack Developer",
            location: "Delhi, India",
            experience: "3 Years",
            skills: ["React", "Node.js", "MongoDB", "Express"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 4,
            name: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            title: "UI/UX Designer",
            location: "Remote",
            experience: "2 Years",
            skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
            resume: true,
            linkedin: true,
            github: false,
        },
        {
            id: 5,
            name: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            title: "Frontend Developer",
            location: "Gurgaon, India",
            experience: "4 Years",
            skills: ["React", "TypeScript", "Redux", "Tailwind CSS"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 6,
            name: "Neha Gupta",
            email: "neha.gupta@example.com",
            title: "Backend Developer",
            location: "Noida, India",
            experience: "5 Years",
            skills: ["Node.js", "PostgreSQL", "REST API", "Docker"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 7,
            name: "Rohit Malhotra",
            email: "rohit.malhotra@example.com",
            title: "Frontend Developer",
            location: "Delhi, India",
            experience: "2 Years",
            skills: ["React", "HTML", "CSS", "JavaScript"],
            resume: true,
            linkedin: true,
            github: true,
        },
        {
            id: 8,
            name: "Ananya Sharma",
            email: "ananya.sharma@example.com",
            title: "HR Executive",
            location: "Gurgaon, India",
            experience: "3 Years",
            skills: ["Recruitment", "Communication", "HR", "Talent Acquisition"],
            resume: true,
            linkedin: true,
            github: false,
        },
    ];

    const filteredCandidates = candidates.filter((candidate) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            candidate.name.toLowerCase().includes(searchValue) ||
            candidate.email.toLowerCase().includes(searchValue) ||
            candidate.title.toLowerCase().includes(searchValue) ||
            candidate.skills.some((skill) =>
                skill.toLowerCase().includes(searchValue)
            );

        const matchesExperience =
            experienceFilter === "All" ||
            candidate.experience === experienceFilter;

        const matchesLocation =
            locationFilter === "All" ||
            candidate.location === locationFilter;

        return matchesSearch && matchesExperience && matchesLocation;
    });

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("");
    };

    return (
        <div>
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Candidates
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Discover and review candidates for your open positions.
                    </p>
                </div>

                {/* Candidate Count */}
                <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Users size={18} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">
                            Total Candidates
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                            {candidates.length}
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
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
                            placeholder="Search candidates, skills or job title..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Experience Filter */}
                    <div className="relative">
                        <select
                            value={experienceFilter}
                            onChange={(e) =>
                                setExperienceFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Experience</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="5 Years">5 Years</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    {/* Location Filter */}
                    <div className="relative">
                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                setLocationFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Locations</option>
                            <option value="Delhi, India">
                                Delhi, India
                            </option>
                            <option value="Bangalore, India">
                                Bangalore, India
                            </option>
                            <option value="Gurgaon, India">
                                Gurgaon, India
                            </option>
                            <option value="Noida, India">
                                Noida, India
                            </option>
                            <option value="Remote">Remote</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* Results Header */}
            <section className="mt-7">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Candidate Pool
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredCandidates.length}{" "}
                            {filteredCandidates.length === 1
                                ? "candidate"
                                : "candidates"}{" "}
                            found
                        </p>
                    </div>
                </div>

                {/* Candidate Cards */}
                {filteredCandidates.length > 0 ? (
                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        {filteredCandidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Candidate Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                            {getInitials(candidate.name)}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {candidate.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-indigo-600">
                                                {candidate.title}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {candidate.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* View Profile */}
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        title="View Profile"
                                    >
                                        <Eye size={17} />
                                    </button>
                                </div>

                                {/* Candidate Details */}
                                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                            <MapPin size={15} />
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Location
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                {candidate.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                            <BriefcaseBusiness size={15} />
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Experience
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                {candidate.experience}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-5">
                                    <p className="mb-2 text-[11px] text-slate-400">
                                        Skills
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                                    {candidate.linkedin && (
                                        <button
                                            type="button"
                                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <ExternalLink size={14} />
                                            LinkedIn
                                        </button>
                                    )}

                                    {candidate.github && (
                                        <button
                                            type="button"
                                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <ExternalLink size={14} />
                                            GitHub
                                        </button>
                                    )}

                                    {candidate.resume && (
                                        <button
                                            type="button"
                                            className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <FileText size={14} />
                                            Resume
                                        </button>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        type="button"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <Eye size={15} />
                                        View Profile
                                    </button>

                                    <button
                                        type="button"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        <User size={15} />
                                        Contact Candidate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <Users size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No candidates found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            We couldn't find any candidates matching your
                            search or selected filters.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setExperienceFilter("All");
                                setLocationFilter("All");
                            }}
                            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Candidates;
