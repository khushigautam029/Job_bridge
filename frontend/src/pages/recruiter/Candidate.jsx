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
import { useEffect, useState } from "react";
import { getRecruiterApplications } from "../../services/projectService";

const Candidates = () => {
    const [search, setSearch] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        getRecruiterApplications()
            .then((applications) => {
                const uniqueCandidates = new Map();
                applications.forEach((application) => {
                    const profile = application.candidate;
                    if (!profile || uniqueCandidates.has(profile.id)) return;

                    uniqueCandidates.set(profile.id, {
                        id: profile.id,
                        name: profile.user?.name || "Candidate",
                        email: profile.user?.email || "",
                        phone: profile.user?.phone || "",
                        title: "Applicant",
                        location: profile.location || "Not specified",
                        experience: `${Number(profile.experienceYears || 0)} Years`,
                        company: "Not provided",
                        education: "Not provided",
                        university: "",
                        skills: (profile.skills || []).map((skill) => skill.name),
                        summary: profile.bio || "No professional summary provided.",
                        linkedin: profile.linkedinUrl,
                        github: profile.githubUrl,
                        resume: application.resume || profile.resume,
                    });
                });
                if (active) setCandidates([...uniqueCandidates.values()]);
            })
            .catch((loadError) => {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load candidates."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);
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
    const experienceOptions = [...new Set(
        candidates.map((candidate) => candidate.experience)
    )].sort((first, second) =>
        Number.parseFloat(first) - Number.parseFloat(second)
    );
    const locationOptions = [...new Set(
        candidates.map((candidate) => candidate.location)
    )].sort();

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
            const target = /^https?:\/\//i.test(url)
                ? url
                : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api")
                    .replace(/\/api\/?$/, "")}/${url.replace(/^[\\/]+/, "").replaceAll("\\", "/")}`;
            window.open(target, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div>
            {/* PAGE HEADER */}

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

            {/* FILTERS */}

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
                            {experienceOptions.map((experience) => (
                                <option key={experience} value={experience}>
                                    {experience}
                                </option>
                            ))}
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
                            {locationOptions.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* RESULTS */}

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

                {loading ? (
                    <p className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                        Loading candidates...
                    </p>
                ) : error ? (
                    <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
                        {error}
                    </p>
                ) : filteredCandidates.length > 0 ? (
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

                {/* VIEW PROFILE MODAL */}
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

                {/* CONTACT CANDIDATE MODAL */}
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