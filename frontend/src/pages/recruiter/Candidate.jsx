
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
import { useEffect, useMemo, useState } from "react";
import { getRecruiterApplications } from "../../services/applicationService";
import Pagination, { usePagination } from "../../components/Pagination.jsx";

const getInitials = (name = "Candidate") =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

const firstAvailable = (...values) =>
    values.find(
        (value) =>
            value !== undefined &&
            value !== null &&
            value !== ""
    );

const formatExperience = (value) => {
    if (value === undefined || value === null || value === "") {
        return "Not specified";
    }

    if (typeof value === "number" || !Number.isNaN(Number(value))) {
        return `${value} Years`;
    }

    return String(value);
};

const formatDetails = (value) => {
    if (!value) return "Not provided";

    if (Array.isArray(value)) {
        return (
            value
                .map((item) => {
                    if (typeof item === "string") return item;

                    if (typeof item === "object" && item !== null) {
                        return [
                            item.degree,
                            item.fieldOfStudy,
                            item.institution || item.university || item.college || item.companyName,
                            item.startYear || item.startDate,
                            item.endYear || item.endDate,
                            item.jobTitle,
                        ]
                            .filter(Boolean)
                            .join(" • ");
                    }

                    return "";
                })
                .filter(Boolean)
                .join(" | ") || "Not provided"
        );
    }

    if (typeof value === "object") {
        return [
            value.degree,
            value.fieldOfStudy,
            value.institution || value.university || value.college || value.companyName,
            value.startYear || value.startDate,
            value.endYear || value.endDate,
            value.jobTitle,
        ]
            .filter(Boolean)
            .join(" • ") || "Not provided";
    }

    return String(value);
};

const Candidates = () => {
    const [search, setSearch] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadCandidates = async () => {
            try {
                setLoading(true);
                setError("");

                const applications = await getRecruiterApplications();
                const candidateApplications = new Map();

                applications.forEach((application) => {
                    const profile = application.candidate;

                    if (!profile) return;

                    const user = profile.user || {};
                    const candidateId = profile.id ?? application.candidateId ?? user.id;

                    if (candidateId == null) return;

                    const job = application.job || {};
                    const applicationKey = application.id ?? `${candidateId}-${job.id ?? "job"}`;

                    const jobTitle = job.title || "";
                    const category = job.category?.name || job.Category?.name || job.categoryName || "Uncategorized";
                    const appliedJobs = [];
                    const appliedCategories = [];
                    const appliedJobEntries = [];

                    if (jobTitle && !appliedJobs.includes(jobTitle)) {
                        appliedJobs.push(jobTitle);
                        appliedJobEntries.push({ jobTitle, category });
                    }
                    if (category && !appliedCategories.includes(category)) {
                        appliedCategories.push(category);
                    }

                    const rawSkills = profile.skills || [];

                    const skills = rawSkills
                        .map((skill) =>
                            typeof skill === "string"
                                ? skill
                                : skill?.name
                        )
                        .filter(Boolean);

                    const education = profile.educations?.length
                        ? profile.educations
                        : firstAvailable(
                            profile.education,
                            profile.educationDetails,
                            profile.educationHistory,
                            profile.degree,
                            profile.educationLevel
                        );

                    const experienceDetails = profile.experiences?.length
                        ? profile.experiences
                        : firstAvailable(
                            profile.experienceDetails,
                            profile.workExperience,
                            profile.experienceHistory,
                            profile.employmentHistory
                        );

                    candidateApplications.set(applicationKey, {
                        id: applicationKey,
                        candidateProfileId: candidateId,
                        applicationId: application.id,

                        name: user.name || "Candidate",
                        email: user.email || "",
                        phone: user.phone || "",

                        title:
                            firstAvailable(
                                profile.designation,
                                profile.currentPosition,
                                profile.jobTitle,
                                profile.headline,
                                profile.preferredJobTitle,
                                profile.experiences?.[0]?.jobTitle
                            ) || "Candidate",

                        location:
                            profile.location || "Not specified",

                        experience: formatExperience(
                            profile.experienceYears
                        ),

                        currentCompany:
                            firstAvailable(
                                profile.currentCompany,
                                profile.companyName,
                                profile.company,
                                profile.experiences?.[0]?.companyName
                            ) || "Not provided",

                        education: formatDetails(education),

                        university:
                            firstAvailable(
                                profile.university,
                                profile.institution,
                                profile.college,
                                profile.educations?.[0]?.institution
                            ) || "",

                        experienceDetails: formatDetails(
                            experienceDetails
                        ),

                        skills,

                        summary:
                            firstAvailable(
                                profile.bio,
                                profile.summary,
                                profile.professionalSummary,
                                profile.about
                            ) || "No professional summary provided.",

                        linkedin:
                            profile.linkedinUrl ||
                            profile.linkedin ||
                            "",

                        github:
                            profile.githubUrl ||
                            profile.github ||
                            "",

                        portfolio:
                            profile.portfolioUrl ||
                            profile.portfolio ||
                            "",

                        resume:
                            application.resume ||
                            profile.resumeUrl ||
                            profile.resume ||
                            "",

                        applicationCount: 1,
                        appliedJobs,
                        appliedCategories: category ? [category] : [],
                        appliedJobEntries,
                    });
                });

                if (active) {
                    setCandidates([...candidateApplications.values()]);
                }
            } catch (loadError) {
                if (active) {
                    setCandidates([]);
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load candidates. Please try again."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCandidates();

        return () => {
            active = false;
        };
    }, []);

    // Search and filters
    const filteredCandidates = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return candidates.filter((candidate) => {
            const searchableValues = [
                candidate.name,
                candidate.email,
                candidate.title,
                candidate.location,
                candidate.currentCompany,
                candidate.summary,
                ...candidate.skills,
                ...candidate.appliedJobs,
            ];

            const matchesSearch =
                !searchValue ||
                searchableValues.some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchValue)
                );

            const matchesExperience =
                experienceFilter === "All" ||
                candidate.experience === experienceFilter;

            const matchesLocation =
                locationFilter === "All" ||
                candidate.location === locationFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                candidate.appliedCategories.includes(categoryFilter);

            return (
                matchesSearch &&
                matchesExperience &&
                matchesLocation &&
                matchesCategory
            );
        });
    }, [
        candidates,
        search,
        experienceFilter,
        locationFilter,
        categoryFilter,
    ]);
    const paginationResetKey = JSON.stringify([search, experienceFilter, locationFilter, categoryFilter]);
    const { pageItems: pageCandidates, currentPage, setCurrentPage, pageCount } =
        usePagination(filteredCandidates, paginationResetKey);

    const categoryOptions = useMemo(
        () => [...new Set(candidates.flatMap((candidate) => candidate.appliedCategories))].sort(),
        [candidates]
    );

    const experienceOptions = useMemo(
        () =>
            [
                ...new Set(
                    candidates.map((candidate) => candidate.experience)
                ),
            ].sort(
                (a, b) =>
                    parseFloat(a) - parseFloat(b)
            ),
        [candidates]
    );

    const locationOptions = useMemo(
        () =>
            [
                ...new Set(
                    candidates.map((candidate) => candidate.location)
                ),
            ].sort(),
        [candidates]
    );

    const openProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setModalType("profile");
    };

    const openContact = (candidate) => {
        setSelectedCandidate(candidate);
        setModalType("contact");
    };

    const closeModal = () => {
        setSelectedCandidate(null);
        setModalType(null);
    };

    const clearFilters = () => {
        setSearch("");
        setExperienceFilter("All");
        setLocationFilter("All");
        setCategoryFilter("All");
    };

    const openExternalLink = (url) => {
        if (!url) return;

        const target = /^https?:\/\//i.test(url)
            ? url
            : `${(
                import.meta.env.VITE_API_URL ||
                "http://localhost:5000/api"
            ).replace(/\/api\/?$/, "")}/${url
                .replace(/^[\\/]+/, "")
                .replaceAll("\\", "/")}`;

        window.open(target, "_blank", "noopener,noreferrer");
    };

    const renderProfileLinks = (candidate) => (
        <div className="flex flex-wrap gap-2">
            {candidate.linkedin && (
                <button
                    type="button"
                    onClick={() => openExternalLink(candidate.linkedin)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    <ExternalLink size={14} />
                    LinkedIn
                </button>
            )}

            {candidate.github && (
                <button
                    type="button"
                    onClick={() => openExternalLink(candidate.github)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    <ExternalLink size={14} />
                    GitHub
                </button>
            )}

            {candidate.portfolio && (
                <button
                    type="button"
                    onClick={() => openExternalLink(candidate.portfolio)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    <ExternalLink size={14} />
                    Portfolio
                </button>
            )}

            {candidate.resume && (
                <button
                    type="button"
                    onClick={() => openExternalLink(candidate.resume)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                    <FileText size={14} />
                    Resume
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-7">
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
                        Discover and review candidates who have applied
                        to your jobs.
                    </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Users size={19} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">
                            Candidate Applications
                        </p>

                        <p className="text-lg font-bold text-slate-800">
                            {candidates.length}
                        </p>
                    </div>
                </div>
            </section>

            {/* SEARCH AND FILTERS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_200px_200px_200px]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search name, email, skills or job..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Categories</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="relative">
                        <select
                            value={experienceFilter}
                            onChange={(event) =>
                                setExperienceFilter(event.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Experience</option>

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
                            onChange={(event) =>
                                setLocationFilter(event.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Locations</option>

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

            {/* CANDIDATE RESULTS */}
            <section>
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Candidate Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredCandidates.length}{" "}
                            {filteredCandidates.length === 1
                                ? "application"
                                : "applications"}{" "}
                            found
                        </p>
                    </div>

                    {(search ||
                        experienceFilter !== "All" ||
                        locationFilter !== "All" ||
                        categoryFilter !== "All") && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                        Loading candidates...
                    </div>
                ) : error ? (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                        <p className="text-sm text-red-700">{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-3 text-sm font-semibold text-red-700 underline"
                        >
                            Reload page
                        </button>
                    </div>
                ) : filteredCandidates.length > 0 ? (
                    /*
                     * 1 column on mobile
                     * 2 columns on medium/large screens
                     * 3 columns on extra-large screens
                     */
                    <>
                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {pageCandidates.map((candidate) => (
                            <article
                                key={candidate.id}
                                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Candidate identity */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                        {getInitials(candidate.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words font-semibold text-slate-900">
                                            {candidate.name}
                                        </h3>

                                        <p className="mt-1 break-words text-sm text-indigo-600">
                                            {candidate.title}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-slate-400">
                                            {candidate.email || "Email not provided"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openProfile(candidate)}
                                        title="View profile"
                                        aria-label={`View ${candidate.name}'s profile`}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <Eye size={17} />
                                    </button>
                                </div>

                                {/* Basic details */}
                                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4">
                                    <div className="flex min-w-0 items-start gap-2.5">
                                        <MapPin
                                            size={16}
                                            className="mt-0.5 shrink-0 text-slate-400"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[11px] text-slate-400">
                                                Location
                                            </p>

                                            <p className="break-words text-xs font-medium text-slate-700">
                                                {candidate.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 items-start gap-2.5">
                                        <BriefcaseBusiness
                                            size={16}
                                            className="mt-0.5 shrink-0 text-slate-400"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[11px] text-slate-400">
                                                Experience
                                            </p>

                                            <p className="text-xs font-medium text-slate-700">
                                                {candidate.experience}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 items-start gap-2.5">
                                        <FileText
                                            size={16}
                                            className="mt-0.5 shrink-0 text-slate-400"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-[11px] text-slate-400">
                                                Applications
                                            </p>

                                            <p className="text-xs font-medium text-slate-700">
                                                {candidate.applicationCount}{" "}
                                                {candidate.applicationCount === 1
                                                    ? "application"
                                                    : "applications"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-5">
                                    <p className="mb-2 text-[11px] font-medium text-slate-400">
                                        Skills
                                    </p>

                                    {candidate.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.skills.slice(0, 6).map(
                                                (skill) => (
                                                    <span
                                                        key={skill}
                                                        className="max-w-full break-words rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}

                                            {candidate.skills.length > 6 && (
                                                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                                    +{candidate.skills.length - 6} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400">
                                            No skills provided
                                        </p>
                                    )}
                                </div>

                                {/* Applied jobs */}
                                <div className="mt-5 min-w-0">
                                    <p className="mb-2 text-[11px] font-medium text-slate-400">
                                        Applied Jobs
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {candidate.appliedJobs.length > 0 ? (
                                            candidate.appliedJobs
                                                .slice(0, 2)
                                                .map((jobTitle, index) => (
                                                    <span
                                                        key={jobTitle}
                                                        className="max-w-full break-words rounded-lg bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600"
                                                    >
                                                        <span className="font-semibold">{jobTitle}</span>
                                                        {candidate.appliedJobEntries?.[index]?.category && candidate.appliedJobEntries[index].category !== "Uncategorized" && (
                                                            <span className="text-indigo-500"> · {candidate.appliedJobEntries[index].category}</span>
                                                        )}
                                                    </span>
                                                ))
                                        ) : (
                                            <span className="text-xs text-slate-400">
                                                No job title available
                                            </span>
                                        )}

                                        {candidate.appliedJobs.length > 2 && (
                                            <span className="text-xs text-slate-500">
                                                +{candidate.appliedJobs.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Profile links */}
                                <div className="mt-5 border-t border-slate-100 pt-4">
                                    {renderProfileLinks(candidate)}
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex gap-2 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => openProfile(candidate)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        <Eye size={15} />
                                        View Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openContact(candidate)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-2 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
                                    >
                                        <User size={15} />
                                        Contact
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                    <Pagination totalItems={filteredCandidates.length} currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
                    </>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <Users
                            size={30}
                            className="mx-auto text-slate-400"
                        />

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No candidates found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            No candidates match your search or selected
                            filters, or no applications have been returned
                            by the backend.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            {/* PROFILE AND CONTACT MODALS */}
            {selectedCandidate && modalType && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4"
                    onClick={closeModal}
                >
                    <div
                        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                                    {modalType === "profile"
                                        ? "Candidate Profile"
                                        : "Candidate Contact"}
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {modalType === "profile"
                                        ? "Candidate Details"
                                        : "Contact Candidate"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close modal"
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            {/* Identity */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
                                    {getInitials(selectedCandidate.name)}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="break-words text-xl font-bold text-slate-900">
                                        {selectedCandidate.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-indigo-600">
                                        {selectedCandidate.title}
                                    </p>

                                    <p className="mt-1 break-all text-sm text-slate-500">
                                        {selectedCandidate.email}
                                    </p>
                                </div>
                            </div>

                            {/* Contact information */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="flex items-center gap-2 text-xs text-slate-400">
                                        <Mail size={15} />
                                        Email
                                    </p>

                                    <p className="mt-2 break-all text-sm font-medium text-slate-700">
                                        {selectedCandidate.email || "Not provided"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="flex items-center gap-2 text-xs text-slate-400">
                                        <Phone size={15} />
                                        Phone
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                        {selectedCandidate.phone || "Not provided"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="flex items-center gap-2 text-xs text-slate-400">
                                        <MapPin size={15} />
                                        Location
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                        {selectedCandidate.location}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="flex items-center gap-2 text-xs text-slate-400">
                                        <BriefcaseBusiness size={15} />
                                        Experience
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                        {selectedCandidate.experience}
                                    </p>
                                </div>
                            </div>

                            {modalType === "profile" ? (
                                <>
                                    {/* Professional summary */}
                                    <section>
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Professional Summary
                                        </h4>

                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                                            {selectedCandidate.summary}
                                        </p>
                                    </section>

                                    {/* Employment */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <BriefcaseBusiness size={17} />
                                            Employment Details
                                        </h4>

                                        <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-4">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Current Company
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {selectedCandidate.currentCompany}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Designation / Job Title
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {selectedCandidate.title}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Work Experience History
                                                </p>

                                                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                                                    {selectedCandidate.experienceDetails}
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Education */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <GraduationCap size={18} />
                                            Education
                                        </h4>

                                        <div className="mt-3 rounded-xl bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-700">
                                                {selectedCandidate.education}
                                            </p>

                                            {selectedCandidate.university && (
                                                <p className="mt-2 text-sm text-slate-500">
                                                    {selectedCandidate.university}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Skills */}
                                    <section>
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Skills
                                        </h4>

                                        {selectedCandidate.skills.length ? (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {selectedCandidate.skills.map(
                                                    (skill) => (
                                                        <span
                                                            key={skill}
                                                            className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-slate-400">
                                                No skills provided.
                                            </p>
                                        )}
                                    </section>

                                    {/* Applications */}
                                    <section>
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            Applied Jobs
                                        </h4>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Total applications:{" "}
                                            {selectedCandidate.applicationCount}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedCandidate.appliedJobs.length ? (
                                                selectedCandidate.appliedJobs.map(
                                                    (jobTitle, index) => (
                                                        <span
                                                            key={jobTitle}
                                                            className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"
                                                        >
                                                            <span className="font-semibold">{jobTitle}</span>
                                                            {selectedCandidate.appliedJobEntries?.[index]?.category && selectedCandidate.appliedJobEntries[index].category !== "Uncategorized" && (
                                                                <span className="text-indigo-600"> · {selectedCandidate.appliedJobEntries[index].category}</span>
                                                            )}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <p className="text-sm text-slate-400">
                                                    No job titles available.
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Links and documents */}
                                    <section>
                                        <h4 className="mb-3 text-sm font-semibold text-slate-900">
                                            Profile & Documents
                                        </h4>

                                        {renderProfileLinks(selectedCandidate)}
                                    </section>

                                    <button
                                        type="button"
                                        onClick={() => setModalType("contact")}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        <Mail size={17} />
                                        Contact Candidate
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm leading-6 text-slate-500">
                                        Use the contact details below to
                                        reach out to this candidate about
                                        their application.
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <a
                                            href={
                                                selectedCandidate.email
                                                    ? `mailto:${selectedCandidate.email}`
                                                    : undefined
                                            }
                                            aria-disabled={!selectedCandidate.email}
                                            onClick={(event) => {
                                                if (!selectedCandidate.email) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                                                selectedCandidate.email
                                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            <Mail size={17} />
                                            Send Email
                                        </a>

                                        <a
                                            href={
                                                selectedCandidate.phone
                                                    ? `tel:${selectedCandidate.phone}`
                                                    : undefined
                                            }
                                            aria-disabled={!selectedCandidate.phone}
                                            onClick={(event) => {
                                                if (!selectedCandidate.phone) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                                                selectedCandidate.phone
                                                    ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    : "cursor-not-allowed border-slate-200 text-slate-400"
                                            }`}
                                        >
                                            <Phone size={17} />
                                            Call Candidate
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setModalType("profile")}
                                        className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Back to Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;
