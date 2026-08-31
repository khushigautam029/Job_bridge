import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle,
    ChevronDown,
    Clock3,
    Eye,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    User,
    Users,
    X,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const RecruiterApplications = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobFilter, setJobFilter] = useState("All");

    // Selected candidate/application
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Modal type
    const [modalType, setModalType] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Applications
    |--------------------------------------------------------------------------
    | UI data for now.
    | Later this data will come from the backend API.
    */
    const [applications, setApplications] = useState([
        {
            id: 1,
            candidate: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91 9876543210",
            jobTitle: "Senior React Developer",
            location: "Delhi, India",
            experience: "5 years",
            education: "B.Tech in Computer Science",
            appliedDate: "Aug 27, 2026",
            status: "Shortlisted",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["React", "JavaScript", "Node.js"],
            summary:
                "Experienced frontend developer with strong knowledge of React and modern JavaScript. Has worked on scalable web applications and REST APIs.",
        },
        {
            id: 2,
            candidate: "Priya Singh",
            email: "priya.singh@example.com",
            phone: "+91 9876543211",
            jobTitle: "Backend Developer",
            location: "Bangalore, India",
            experience: "4 years",
            education: "B.Tech in Information Technology",
            appliedDate: "Aug 26, 2026",
            status: "Under Review",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["Node.js", "Express", "MySQL"],
            summary:
                "Backend developer experienced in Node.js, Express, REST APIs and relational databases.",
        },
        {
            id: 3,
            candidate: "Aman Verma",
            email: "aman.verma@example.com",
            phone: "+91 9876543212",
            jobTitle: "Full Stack Developer",
            location: "Delhi, India",
            experience: "6 years",
            education: "MCA",
            appliedDate: "Aug 25, 2026",
            status: "Interview",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["React", "Node.js", "MongoDB"],
            summary:
                "Full stack developer with experience building complete web applications using React, Node.js and MongoDB.",
        },
        {
            id: 4,
            candidate: "Sneha Kapoor",
            email: "sneha.kapoor@example.com",
            phone: "+91 9876543213",
            jobTitle: "UI/UX Designer",
            location: "Remote",
            experience: "3 years",
            education: "B.Des in Design",
            appliedDate: "Aug 24, 2026",
            status: "Applied",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["Figma", "UI Design", "UX Research"],
            summary:
                "UI/UX designer focused on creating clean, accessible and user-friendly digital experiences.",
        },
        {
            id: 5,
            candidate: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            phone: "+91 9876543214",
            jobTitle: "Senior React Developer",
            location: "Gurgaon, India",
            experience: "7 years",
            education: "B.Tech in Computer Science",
            appliedDate: "Aug 23, 2026",
            status: "Rejected",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["React", "TypeScript", "Redux"],
            summary:
                "Senior frontend developer with experience in React, TypeScript and large-scale application development.",
        },
        {
            id: 6,
            candidate: "Neha Gupta",
            email: "neha.gupta@example.com",
            phone: "+91 9876543215",
            jobTitle: "Backend Developer",
            location: "Noida, India",
            experience: "5 years",
            education: "B.Tech in Computer Science",
            appliedDate: "Aug 22, 2026",
            status: "Shortlisted",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["Node.js", "PostgreSQL", "REST API"],
            summary:
                "Backend engineer with strong experience in Node.js, PostgreSQL and REST API development.",
        },
        {
            id: 7,
            candidate: "Rohit Malhotra",
            email: "rohit.malhotra@example.com",
            phone: "+91 9876543216",
            jobTitle: "Frontend Developer",
            location: "Delhi, India",
            experience: "3 years",
            education: "BCA",
            appliedDate: "Aug 21, 2026",
            status: "Under Review",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["React", "HTML", "CSS"],
            summary:
                "Frontend developer experienced in building responsive interfaces using React, HTML and CSS.",
        },
        {
            id: 8,
            candidate: "Ananya Sharma",
            email: "ananya.sharma@example.com",
            phone: "+91 9876543217",
            jobTitle: "HR Executive",
            location: "Gurgaon, India",
            experience: "2 years",
            education: "MBA in HR",
            appliedDate: "Aug 20, 2026",
            status: "Applied",
            resume:
                "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills: ["Recruitment", "Communication", "HR"],
            summary:
                "HR professional experienced in recruitment, candidate screening and employee coordination.",
        },
    ]);

    /*
    |--------------------------------------------------------------------------
    | Filter Applications
    |--------------------------------------------------------------------------
    */
    const filteredApplications = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return applications.filter((application) => {
            const matchesSearch =
                !searchValue ||
                application.candidate
                    .toLowerCase()
                    .includes(searchValue) ||
                application.email
                    .toLowerCase()
                    .includes(searchValue) ||
                application.jobTitle
                    .toLowerCase()
                    .includes(searchValue) ||
                application.location
                    .toLowerCase()
                    .includes(searchValue) ||
                application.experience
                    .toLowerCase()
                    .includes(searchValue) ||
                application.skills.some((skill) =>
                    skill.toLowerCase().includes(searchValue)
                );

            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;

            const matchesJob =
                jobFilter === "All" ||
                application.jobTitle === jobFilter;

            return matchesSearch && matchesStatus && matchesJob;
        });
    }, [applications, search, statusFilter, jobFilter]);

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */
    const getStatusClasses = (status) => {
        switch (status) {
            case "Shortlisted":
                return "bg-green-50 text-green-600";

            case "Interview":
                return "bg-indigo-50 text-indigo-600";

            case "Under Review":
                return "bg-amber-50 text-amber-600";

            case "Rejected":
                return "bg-red-50 text-red-500";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Initials
    |--------------------------------------------------------------------------
    */
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("");
    };

    /*
    |--------------------------------------------------------------------------
    | Summary Counts
    |--------------------------------------------------------------------------
    */
    const totalApplications = applications.length;

    const newApplications = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const shortlistedApplications = applications.filter(
        (application) => application.status === "Shortlisted"
    ).length;

    const interviewApplications = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */
    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setJobFilter("All");
    };

    /*
    |--------------------------------------------------------------------------
    | Open Candidate Modal
    |--------------------------------------------------------------------------
    */
    const openCandidateModal = (application) => {
        setSelectedCandidate(application);
        setModalType("candidate");
    };

    /*
    |--------------------------------------------------------------------------
    | Open Manage Modal
    |--------------------------------------------------------------------------
    */
    const openManageModal = (application) => {
        setSelectedCandidate(application);
        setModalType("manage");
    };

    /*
    |--------------------------------------------------------------------------
    | Close Modal
    |--------------------------------------------------------------------------
    */
    const closeModal = () => {
        setSelectedCandidate(null);
        setModalType(null);
    };

    /*
    |--------------------------------------------------------------------------
    | Update Application Status
    |--------------------------------------------------------------------------
    */
    const updateApplicationStatus = (applicationId, newStatus) => {
        setApplications((prevApplications) =>
            prevApplications.map((application) =>
                application.id === applicationId
                    ? {
                          ...application,
                          status: newStatus,
                      }
                    : application
            )
        );

        setSelectedCandidate((prev) =>
            prev
                ? {
                      ...prev,
                      status: newStatus,
                  }
                : null
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Resume
    |--------------------------------------------------------------------------
    */
    const handleViewResume = (application) => {
        if (!application.resume) {
            alert("Resume is not available.");
            return;
        }

        window.open(application.resume, "_blank", "noopener,noreferrer");
    };

    return (
        <div>
            {/* ========================================================= */}
            {/* PAGE HEADER */}
            {/* ========================================================= */}

            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Hiring Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Applications
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Review and manage candidates who applied to your jobs.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText size={19} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">
                            Total Applications
                        </p>

                        <p className="text-lg font-bold text-slate-800">
                            {totalApplications}
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SUMMARY CARDS */}
            {/* ========================================================= */}

            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Applications
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {totalApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <FileText size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Applications received
                    </p>
                </div>

                {/* New */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                New Applications
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {newApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Waiting for review
                    </p>
                </div>

                {/* Shortlisted */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Shortlisted
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {shortlistedApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <Users size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Candidates shortlisted
                    </p>
                </div>

                {/* Interviews */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Interviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {interviewApplications}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CalendarDays size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Candidates in interview stage
                    </p>
                </div>
            </section>

            {/* ========================================================= */}
            {/* FILTERS */}
            {/* ========================================================= */}

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
                            placeholder="Search candidate, email, job, location or skill..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Job Filter */}
                    <div className="relative">
                        <select
                            value={jobFilter}
                            onChange={(e) => setJobFilter(e.target.value)}
                            className="w-full min-w-52 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Jobs</option>

                            {[...new Set(
                                applications.map(
                                    (application) =>
                                        application.jobTitle
                                )
                            )].map((job) => (
                                <option key={job} value={job}>
                                    {job}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    {/* Status */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Under Review">
                                Under Review
                            </option>
                            <option value="Shortlisted">
                                Shortlisted
                            </option>
                            <option value="Interview">
                                Interview
                            </option>
                            <option value="Rejected">
                                Rejected
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* RESULTS */}
            {/* ========================================================= */}

            <section className="mt-7">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Candidate Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {filteredApplications.length}{" "}
                            {filteredApplications.length === 1
                                ? "application"
                                : "applications"}{" "}
                            found
                        </p>
                    </div>

                    {(search ||
                        statusFilter !== "All" ||
                        jobFilter !== "All") && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-fit text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* ===================================================== */}
                {/* APPLICATION LIST */}
                {/* ===================================================== */}

                {filteredApplications.length > 0 ? (
                    <div className="mt-5 space-y-4">
                        {filteredApplications.map((application) => (
                            <div
                                key={application.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                            >
                                {/* Main Information */}
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                    {/* Candidate */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                            {getInitials(
                                                application.candidate
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    {application.candidate}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                        application.status
                                                    )}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {application.email}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                                <span>
                                                    📍{" "}
                                                    {application.location}
                                                </span>

                                                <span>
                                                    💼{" "}
                                                    {application.experience}{" "}
                                                    experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applied Job */}
                                    <div className="flex items-start gap-3 xl:min-w-72">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <BriefcaseBusiness size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Applied for
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {application.jobTitle}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Applied{" "}
                                                {application.appliedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-[auto_1fr]">
                                    {/* Applied Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                            <CalendarDays size={17} />
                                        </div>

                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                Applied Date
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-slate-600">
                                                {application.appliedDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <p className="mb-2 text-[11px] text-slate-400">
                                            Skills
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {application.skills.map(
                                                (skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ================================================= */}
                                {/* ACTIONS */}
                                {/* ================================================= */}

                                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Resume */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewResume(application)
                                        }
                                        className="flex w-fit items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                                    >
                                        <FileText size={15} />
                                        View Resume
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openCandidateModal(
                                                    application
                                                )
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <Eye size={15} />
                                            View Candidate
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openManageModal(
                                                    application
                                                )
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            <User size={15} />
                                            Manage Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                            <FileText size={25} />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            No applications found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                            We couldn't find any candidate applications
                            matching your search or selected filters.
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

            {/* ========================================================= */}
            {/* MODALS */}
            {/* ========================================================= */}

            {selectedCandidate && modalType && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Hiring Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {modalType === "candidate"
                                        ? "Candidate Details"
                                        : "Manage Application"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ================================================= */}
                        {/* CANDIDATE DETAILS */}
                        {/* ================================================= */}

                        {modalType === "candidate" && (
                            <div className="p-6">
                                {/* Candidate Header */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-600">
                                        {getInitials(
                                            selectedCandidate.candidate
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {
                                                    selectedCandidate.candidate
                                                }
                                            </h3>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                    selectedCandidate.status
                                                )}`}
                                            >
                                                {selectedCandidate.status}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {selectedCandidate.jobTitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Mail size={15} />
                                            Email
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-slate-700">
                                            {selectedCandidate.email}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Phone size={15} />
                                            Phone
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-slate-700">
                                            {selectedCandidate.phone}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <MapPin size={15} />
                                            Location
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-slate-700">
                                            {selectedCandidate.location}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <BriefcaseBusiness size={15} />
                                            Experience
                                        </div>

                                        <p className="mt-2 text-sm font-medium text-slate-700">
                                            {selectedCandidate.experience}
                                        </p>
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Education
                                    </h3>

                                    <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                        {selectedCandidate.education}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Professional Summary
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {selectedCandidate.summary}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Skills
                                    </h3>

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
                                </div>

                                {/* Resume */}
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewResume(
                                                selectedCandidate
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <FileText size={17} />
                                        View Resume
                                    </button>
                                </div>

                                {/* Decision */}
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Candidate Decision
                                    </h3>

                                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    selectedCandidate.id,
                                                    "Shortlisted"
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                                        >
                                            <CheckCircle size={17} />
                                            Shortlist
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    selectedCandidate.id,
                                                    "Rejected"
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                                        >
                                            <XCircle size={17} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================================================= */}
                        {/* MANAGE APPLICATION */}
                        {/* ================================================= */}

                        {modalType === "manage" && (
                            <div className="p-6">
                                {/* Candidate */}
                                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                        {getInitials(
                                            selectedCandidate.candidate
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {selectedCandidate.candidate}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {selectedCandidate.jobTitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Current Status */}
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Current Status
                                    </p>

                                    <span
                                        className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                            selectedCandidate.status
                                        )}`}
                                    >
                                        {selectedCandidate.status}
                                    </span>
                                </div>

                                {/* Change Status */}
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Change Application Status
                                    </p>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        {[
                                            "Applied",
                                            "Under Review",
                                            "Shortlisted",
                                            "Interview",
                                            "Rejected",
                                        ].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() =>
                                                    updateApplicationStatus(
                                                        selectedCandidate.id,
                                                        status
                                                    )
                                                }
                                                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                                                    selectedCandidate.status ===
                                                    status
                                                        ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Quick Actions
                                    </p>

                                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewResume(
                                                    selectedCandidate
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <FileText size={17} />
                                            View Resume
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setModalType("candidate")
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            <Eye size={17} />
                                            View Candidate
                                        </button>
                                    </div>
                                </div>

                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mt-6 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplications;

