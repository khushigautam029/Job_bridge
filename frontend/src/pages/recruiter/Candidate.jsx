import {
    BriefcaseBusiness,
    ChevronDown,
    ExternalLink,
    Eye,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Search,
    User,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";

const Candidates = () => {
    const [search, setSearch] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const candidates = [
        {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91 98765 43210",
            title: "Senior React Developer",
            location: "Delhi, India",
            experience: "5 Years",
            company: "TechNova Solutions",
            education: "B.Tech in Computer Science",
            university: "Delhi University",
            skills: [
                "React",
                "JavaScript",
                "Node.js",
                "TypeScript",
                "Redux",
                "Tailwind CSS",
            ],
            summary:
                "Experienced frontend developer specializing in React-based applications, scalable UI systems and modern JavaScript development.",
            linkedin:
                "https://www.linkedin.com/in/rahul-sharma",
            github:
                "https://github.com/rahulsharma",
            resume:
                "https://example.com/resumes/rahul-sharma.pdf",
        },
        {
            id: 2,
            name: "Priya Singh",
            email: "priya.singh@example.com",
            phone: "+91 98765 12345",
            title: "Backend Developer",
            location: "Bangalore, India",
            experience: "4 Years",
            company: "CloudStack Technologies",
            education: "B.Tech in Information Technology",
            university: "Bangalore University",
            skills: [
                "Node.js",
                "Express",
                "MySQL",
                "REST API",
                "Sequelize",
                "Docker",
            ],
            summary:
                "Backend developer focused on building secure REST APIs, database architecture and scalable server-side applications.",
            linkedin:
                "https://www.linkedin.com/in/priya-singh",
            github:
                "https://github.com/priyasingh",
            resume:
                "https://example.com/resumes/priya-singh.pdf",
        },

        {
            id: 3,
            name: "Aman Verma",
            email: "aman.verma@example.com",
            phone: "+91 98111 22334",
            title: "Full Stack Developer",
            location: "Delhi, India",
            experience: "3 Years",
            company: "CodeCraft Labs",
            education: "BCA",
            university: "Indraprastha University",
            skills: [
                "React",
                "Node.js",
                "MongoDB",
                "Express",
                "JavaScript",
                "Git",
            ],
            summary:
                "Full stack developer experienced in developing complete web applications using React, Node.js and modern backend technologies.",
            linkedin:
                "https://www.linkedin.com/in/aman-verma",
            github:
                "https://github.com/amanverma",
            resume:
                "https://example.com/resumes/aman-verma.pdf",
        },

        {
            id: 4,
            name: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            phone: "+91 98989 77665",
            title: "UI/UX Designer",
            location: "Remote",
            experience: "2 Years",
            company: "DesignHub Studio",
            education: "B.Des in Communication Design",
            university: "National Institute of Design",
            skills: [
                "Figma",
                "UI Design",
                "UX Research",
                "Prototyping",
                "Wireframing",
            ],
            summary:
                "Creative UI/UX designer focused on creating intuitive digital experiences, design systems and user-centered interfaces.",
            linkedin:
                "https://www.linkedin.com/in/sneha-kapoor",
            github: null,
            resume:
                "https://example.com/resumes/sneha-kapoor.pdf",
        },
        {
            id: 5,
            name: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            phone: "+91 97654 33221",
            title: "Frontend Developer",
            location: "Gurgaon, India",
            experience: "4 Years",
            company: "WebWorks India",
            education: "B.Tech in Computer Science",
            university: "MDU Rohtak",
            skills: [
                "React",
                "TypeScript",
                "Redux",
                "Tailwind CSS",
                "JavaScript",
            ],
            summary:
                "Frontend developer experienced in building responsive and high-performance web applications with React and TypeScript.",
            linkedin:
                "https://www.linkedin.com/in/arjun-mehta",
            github:
                "https://github.com/arjunmehta",
            resume:
                "https://example.com/resumes/arjun-mehta.pdf",
        },
        {
            id: 6,
            name: "Neha Gupta",
            email: "neha.gupta@example.com",
            phone: "+91 99887 66554",
            title: "Backend Developer",
            location: "Noida, India",
            experience: "5 Years",
            company: "DataCore Systems",
            education: "MCA",
            university: "Amity University",
            skills: [
                "Node.js",
                "PostgreSQL",
                "REST API",
                "Docker",
                "AWS",
            ],
            summary:
                "Backend engineer specializing in API development, relational databases, cloud deployment and distributed systems.",
            linkedin:
                "https://www.linkedin.com/in/neha-gupta",
            github:
                "https://github.com/nehagupta",
            resume:
                "https://example.com/resumes/neha-gupta.pdf",
        },

        {
            id: 7,
            name: "Rohit Malhotra",
            email: "rohit.malhotra@example.com",
            phone: "+91 98770 11223",
            title: "Frontend Developer",
            location: "Delhi, India",
            experience: "2 Years",
            company: "PixelSoft",
            education: "BCA",
            university: "Delhi University",
            skills: [
                "React",
                "HTML",
                "CSS",
                "JavaScript",
                "Tailwind CSS",
            ],
            summary:
                "Frontend developer passionate about building clean, responsive interfaces and interactive React applications.",
            linkedin:
                "https://www.linkedin.com/in/rohit-malhotra",
            github:
                "https://github.com/rohitmalhotra",
            resume:
                "https://example.com/resumes/rohit-malhotra.pdf",
        },

        {
            id: 8,
            name: "Ananya Sharma",
            email: "ananya.sharma@example.com",
            phone: "+91 98990 44556",
            title: "HR Executive",
            location: "Gurgaon, India",
            experience: "3 Years",
            company: "PeopleFirst HR",
            education: "MBA in Human Resources",
            university: "Gurgaon University",
            skills: [
                "Recruitment",
                "Communication",
                "HR",
                "Talent Acquisition",
            ],
            summary:
                "HR professional experienced in recruitment, candidate screening, employee engagement and talent acquisition.",
            linkedin:
                "https://www.linkedin.com/in/ananya-sharma",
            github: null,
            resume:
                "https://example.com/resumes/ananya-sharma.pdf",
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

        return (
            matchesSearch &&
            matchesExperience &&
            matchesLocation
        );
    });

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("");
    };

    const openProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setProfileModalOpen(true);
    };

    const openContact = (candidate) => {
        setSelectedCandidate(candidate);
        setContactModalOpen(true);
    };

    const closeModals = () => {
        setProfileModalOpen(false);
        setContactModalOpen(false);
        setSelectedCandidate(null);
    };

    const openExternalLink = (url) => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div>
            {/* ================= PAGE HEADER ================= */}

            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Candidates
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Discover and review candidates for your open
                        positions.
                    </p>
                </div>

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

            {/* ================= FILTERS ================= */}

            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search candidates, skills or job title..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={experienceFilter}
                            onChange={(e) =>
                                setExperienceFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">
                                All Experience
                            </option>
                            <option value="2 Years">
                                2 Years
                            </option>
                            <option value="3 Years">
                                3 Years
                            </option>
                            <option value="4 Years">
                                4 Years
                            </option>
                            <option value="5 Years">
                                5 Years
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                setLocationFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">
                                All Locations
                            </option>
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
                            <option value="Remote">
                                Remote
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* ================= RESULTS ================= */}

            <section className="mt-7">
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

                {filteredCandidates.length > 0 ? (
                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        {filteredCandidates.map(
                            (candidate) => (
                                <div
                                    key={candidate.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                                >
                                    {/* Candidate Header */}

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                {getInitials(
                                                    candidate.name
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                    {candidate.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-indigo-600">
                                                    {
                                                        candidate.title
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {
                                                        candidate.email
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openProfile(
                                                    candidate
                                                )
                                            }
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                            title="View Profile"
                                        >
                                            <Eye size={17} />
                                        </button>
                                    </div>

                                    {/* Details */}

                                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                <MapPin
                                                    size={15}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Location
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {
                                                        candidate.location
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                <BriefcaseBusiness
                                                    size={15}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[11px] text-slate-400">
                                                    Experience
                                                </p>

                                                <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                    {
                                                        candidate.experience
                                                    }
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
                                            {candidate.skills.map(
                                                (skill) => (
                                                    <span
                                                        key={
                                                            skill
                                                        }
                                                        className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Links */}

                                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                                        {candidate.linkedin && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openExternalLink(
                                                        candidate.linkedin
                                                    )
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                />
                                                LinkedIn
                                            </button>
                                        )}

                                        {candidate.github && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openExternalLink(
                                                        candidate.github
                                                    )
                                                }
                                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                />
                                                GitHub
                                            </button>
                                        )}

                                        {candidate.resume && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openExternalLink(
                                                        candidate.resume
                                                    )
                                                }
                                                className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                <FileText
                                                    size={14}
                                                />
                                                Resume
                                            </button>
                                        )}
                                    </div>

                                    {/* Actions */}

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openProfile(
                                                    candidate
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                                        >
                                            <Eye size={15} />
                                            View Profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openContact(
                                                    candidate
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            <User size={15} />
                                            Contact Candidate
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <Users size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No candidates found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            We couldn't find any candidates
                            matching your search or selected
                            filters.
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

            {/* =====================================================
                VIEW PROFILE MODAL
            ====================================================== */}

            {profileModalOpen && selectedCandidate && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={closeModals}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* Modal Header */}

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                    Candidate Profile
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Candidate Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModals}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Profile Header */}

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">
                                    {getInitials(
                                        selectedCandidate.name
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {
                                            selectedCandidate.name
                                        }
                                    </h3>

                                    <p className="mt-1 font-medium text-indigo-600">
                                        {
                                            selectedCandidate.title
                                        }
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin
                                                size={15}
                                            />
                                            {
                                                selectedCandidate.location
                                            }
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <BriefcaseBusiness
                                                size={15}
                                            />
                                            {
                                                selectedCandidate.experience
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}

                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                            <Mail
                                                size={17}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] text-slate-400">
                                                Email
                                            </p>

                                            <p className="truncate text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.email
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                                            <Phone
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Phone
                                            </p>

                                            <p className="text-sm font-medium text-slate-700">
                                                {
                                                    selectedCandidate.phone
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About */}

                            <div className="mt-7">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Professional Summary
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {
                                        selectedCandidate.summary
                                    }
                                </p>
                            </div>

                            {/* Experience */}

                            <div className="mt-7">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Experience
                                </h4>

                                <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                            <BriefcaseBusiness
                                                size={18}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {
                                                    selectedCandidate.title
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-indigo-600">
                                                {
                                                    selectedCandidate.company
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    selectedCandidate.experience
                                                }{" "}
                                                experience
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Education */}

                            <div className="mt-7">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Education
                                </h4>

                                <div className="mt-3 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                        <GraduationCap
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {
                                                selectedCandidate.education
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {
                                                selectedCandidate.university
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}

                            <div className="mt-7">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Skills
                                </h4>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedCandidate.skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Profile Links */}

                            <div className="mt-7 border-t border-slate-100 pt-5">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Profile & Documents
                                </h4>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedCandidate.linkedin && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openExternalLink(
                                                    selectedCandidate.linkedin
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <ExternalLink
                                                size={15}
                                            />
                                            LinkedIn
                                        </button>
                                    )}

                                    {selectedCandidate.github && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openExternalLink(
                                                    selectedCandidate.github
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <ExternalLink
                                                size={15}
                                            />
                                            GitHub
                                        </button>
                                    )}

                                    {selectedCandidate.resume && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openExternalLink(
                                                    selectedCandidate.resume
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            <FileText
                                                size={15}
                                            />
                                            Open Resume
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contact Button */}

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileModalOpen(
                                            false
                                        );
                                        setContactModalOpen(
                                            true
                                        );
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Mail size={17} />
                                    Contact Candidate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                CONTACT CANDIDATE MODAL
            ====================================================== */}

            {contactModalOpen && selectedCandidate && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={closeModals}
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                    Candidate Contact
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Contact Candidate
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModals}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Candidate */}

                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                    {getInitials(
                                        selectedCandidate.name
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {
                                            selectedCandidate.name
                                        }
                                    </h3>

                                    <p className="mt-1 text-xs text-indigo-600">
                                        {
                                            selectedCandidate.title
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Contact Details */}

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Mail
                                            size={17}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-400">
                                            Email Address
                                        </p>

                                        <p className="text-sm font-medium text-slate-700">
                                            {
                                                selectedCandidate.email
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Phone
                                            size={17}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-400">
                                            Phone Number
                                        </p>

                                        <p className="text-sm font-medium text-slate-700">
                                            {
                                                selectedCandidate.phone
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <a
                                    href={`mailto:${selectedCandidate.email}`}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Mail size={17} />
                                    Send Email
                                </a>

                                <a
                                    href={`tel:${selectedCandidate.phone}`}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <Phone size={17} />
                                    Call Candidate
                                </a>
                            </div>

                            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                                Use the contact information above
                                to reach out to the candidate
                                regarding your open position.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;