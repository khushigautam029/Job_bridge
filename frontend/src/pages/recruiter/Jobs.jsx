import {
    BriefcaseBusiness,
    CalendarDays,
    Edit,
    Eye,
    MapPin,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

const Jobs = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

   
    const selectedCategory = searchParams.get("category");

  
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // If category exists in URL, use it.
    // Otherwise show all categories.
    const [categoryFilter, setCategoryFilter] = useState(
        selectedCategory || "All"
    );
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplications, setShowApplications] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: "Senior React Developer",
            category: "Development",
            location: "Delhi, India",
            type: "Full Time",
            workMode: "Hybrid",
            applications: 32,
            postedDate: "Aug 27, 2026",
            status: "Active",
            salary: "₹8L - ₹14L",
            experience: "3 - 5 Years",
            deadline: "Sep 30, 2026",
            description:
                "Looking for an experienced React developer to build scalable and modern web applications.",
            responsibilities: [
                "Build and maintain modern React applications.",
                "Develop reusable and scalable UI components.",
                "Collaborate with designers and backend developers.",
                "Improve application performance and user experience.",
                "Write clean, maintainable and well-tested code.",
            ],
            requirements: [
                "3+ years of experience with React.",
                "Strong knowledge of JavaScript and TypeScript.",
                "Experience working with REST APIs.",
                "Good understanding of responsive design.",
                "Experience with Git and modern development workflows.",
            ],
            skills: [
                "React",
                "JavaScript",
                "TypeScript",
                "Node.js",
                "REST API",
            ],
        },
        {
            id: 2,
            title: "Backend Developer",
            category: "Development",
            location: "Bangalore, India",
            type: "Full Time",
            workMode: "Onsite",
            applications: 24,
            postedDate: "Aug 25, 2026",
            status: "Active",
            salary: "₹7L - ₹12L",
            experience: "2 - 4 Years",
            deadline: "Sep 25, 2026",
            description:
                "We are looking for a backend developer experienced in Node.js, APIs and database development.",
            responsibilities: [
                "Build REST APIs using Node.js and Express.",
                "Design and optimize database queries.",
                "Implement authentication and authorization.",
                "Work closely with frontend developers.",
            ],
            requirements: [
                "2+ years of Node.js experience.",
                "Experience with Express.js.",
                "Strong knowledge of MySQL.",
                "Understanding of REST API architecture.",
            ],
            skills: [
                "Node.js",
                "Express",
                "MySQL",
                "Sequelize",
            ],
        },
        {
            id: 3,
            title: "UI/UX Designer",
            category: "Design",
            location: "Remote",
            type: "Full Time",
            workMode: "Remote",
            applications: 18,
            postedDate: "Aug 22, 2026",
            status: "Active",
            salary: "₹6L - ₹10L",
            experience: "1 - 3 Years",
            deadline: "Sep 20, 2026",
            description:
                "Join our design team and create intuitive and engaging experiences for our users.",
            responsibilities: [
                "Create user-friendly interface designs.",
                "Develop wireframes and prototypes.",
                "Collaborate with product and development teams.",
                "Conduct user research and usability testing.",
            ],
            requirements: [
                "1+ years of UI/UX experience.",
                "Strong knowledge of Figma.",
                "Understanding of user-centered design.",
                "Good communication skills.",
            ],
            skills: [
                "Figma",
                "UI Design",
                "UX Research",
                "Prototyping",
            ],
        },
        {
            id: 4,
            title: "Frontend Developer",
            category: "Development",
            location: "Delhi, India",
            type: "Part Time",
            workMode: "Hybrid",
            applications: 15,
            postedDate: "Aug 18, 2026",
            status: "Closed",
            salary: "₹5L - ₹9L",
            experience: "1 - 3 Years",
            deadline: "Sep 10, 2026",
            description:
                "Looking for a frontend developer who can build responsive and user-friendly interfaces.",
            responsibilities: [
                "Build responsive frontend interfaces.",
                "Convert designs into reusable components.",
                "Work with frontend APIs.",
            ],
            requirements: [
                "Experience with React.",
                "Strong HTML and CSS knowledge.",
                "Understanding of responsive design.",
            ],
            skills: [
                "React",
                "HTML",
                "CSS",
                "JavaScript",
            ],
        },
        {
            id: 5,
            title: "HR Executive",
            category: "Human Resources",
            location: "Gurgaon, India",
            type: "Full Time",
            workMode: "Onsite",
            applications: 11,
            postedDate: "Aug 15, 2026",
            status: "Active",
            salary: "₹4L - ₹7L",
            experience: "2 - 4 Years",
            deadline: "Sep 18, 2026",
            description:
                "Responsible for recruitment, employee relations and supporting HR operations.",
            responsibilities: [
                "Manage recruitment activities.",
                "Coordinate interviews.",
                "Maintain employee records.",
                "Support HR operations.",
            ],
            requirements: [
                "Experience in recruitment.",
                "Strong communication skills.",
                "Good understanding of HR processes.",
            ],
            skills: [
                "Recruitment",
                "Communication",
                "HR",
            ],
        },
        {
            id: 6,
            title: "Marketing Executive",
            category: "Marketing",
            location: "Mumbai, India",
            type: "Full Time",
            workMode: "Hybrid",
            applications: 9,
            postedDate: "Aug 10, 2026",
            status: "Closed",
            salary: "₹5L - ₹8L",
            experience: "1 - 3 Years",
            deadline: "Sep 5, 2026",
            description:
                "Help us grow our brand through digital marketing and creative campaigns.",
            responsibilities: [
                "Plan and execute marketing campaigns.",
                "Manage social media activities.",
                "Track campaign performance.",
                "Work with the creative team.",
            ],
            requirements: [
                "Experience with digital marketing.",
                "Knowledge of SEO.",
                "Strong communication skills.",
            ],
            skills: [
                "Marketing",
                "SEO",
                "Social Media",
            ],
        },
    ]);
    const applications = {
        1: [
            {
                id: 101,
                name: "Rahul Sharma",
                email: "rahul@example.com",
                experience: "4 Years",
                status: "Shortlisted",
            },
            {
                id: 102,
                name: "Aman Verma",
                email: "aman@example.com",
                experience: "3 Years",
                status: "Interview",
            },
            {
                id: 103,
                name: "Vikas Kumar",
                email: "vikas@example.com",
                experience: "5 Years",
                status: "Under Review",
            },
        ],

        2: [
            {
                id: 201,
                name: "Priya Singh",
                email: "priya@example.com",
                experience: "3 Years",
                status: "Under Review",
            },
            {
                id: 202,
                name: "Rohit Mehta",
                email: "rohit@example.com",
                experience: "4 Years",
                status: "Shortlisted",
            },
        ],

        3: [
            {
                id: 301,
                name: "Sneha Kapoor",
                email: "sneha@example.com",
                experience: "2 Years",
                status: "Applied",
            },
            {
                id: 302,
                name: "Anjali Sharma",
                email: "anjali@example.com",
                experience: "3 Years",
                status: "Shortlisted",
            },
        ],

        4: [
            {
                id: 401,
                name: "Karan Malhotra",
                email: "karan@example.com",
                experience: "2 Years",
                status: "Applied",
            },
        ],

        5: [
            {
                id: 501,
                name: "Neha Gupta",
                email: "neha@example.com",
                experience: "3 Years",
                status: "Under Review",
            },
        ],

        6: [
            {
                id: 601,
                name: "Arjun Kapoor",
                email: "arjun@example.com",
                experience: "2 Years",
                status: "Applied",
            },
        ],
    };
    const filteredJobs = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return jobs.filter((job) => {
            const matchesSearch =
                job.title.toLowerCase().includes(searchValue) ||
                job.category.toLowerCase().includes(searchValue) ||
                job.location.toLowerCase().includes(searchValue) ||
                job.type.toLowerCase().includes(searchValue) ||
                job.skills.some((skill) =>
                    skill.toLowerCase().includes(searchValue)
                );

            const matchesStatus =
                statusFilter === "All" ||
                job.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                job.category === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });
    }, [
        jobs,
        search,
        statusFilter,
        categoryFilter,
    ]);

    const getStatusClasses = (status) => {
        if (status === "Active") {
            return "bg-green-50 text-green-600";
        }

        return "bg-slate-100 text-slate-500";
    };

    const getApplicationStatusClasses = (status) => {
        if (status === "Shortlisted") {
            return "bg-green-50 text-green-600";
        }

        if (status === "Interview") {
            return "bg-indigo-50 text-indigo-600";
        }

        if (status === "Under Review") {
            return "bg-amber-50 text-amber-600";
        }

        return "bg-slate-100 text-slate-500";
    };
    const handleViewJob = (job) => {
        navigate(`/recruiter/jobs/${job.id}`, {
            state: { job },
        });
    };
    const handleViewApplications = (job) => {
        setSelectedJob(job);
        setShowApplications(true);
    };
    const handleEdit = (job) => {
        setSelectedJob({ ...job });
        setShowEditModal(true);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setSelectedJob((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdit = () => {
        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === selectedJob.id
                    ? selectedJob
                    : job
            )
        );

        setShowEditModal(false);
        setSelectedJob(null);
    };
    const handleDelete = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setJobs((prevJobs) =>
            prevJobs.filter(
                (job) => job.id !== selectedJob.id
            )
        );

        setShowDeleteModal(false);
        setSelectedJob(null);
    };
    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");

        // Remove category from URL also
        navigate("/recruiter/jobs");
    };

    return (
        <div>
            {/* =========================
                PAGE HEADER
            ========================= */}
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
                    onClick={() =>
                        navigate("/recruiter/post-job")
                    }
                    className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Post a Job
                </button>
            </section>

            {/* =========================
                ACTIVE CATEGORY
            ========================= */}
            {selectedCategory && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                    <div>
                        <p className="text-xs font-medium text-indigo-500">
                            Showing jobs in category
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-indigo-700">
                            {selectedCategory}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* =========================
                FILTERS
            ========================= */}
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
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search jobs, skills, location..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Closed">
                            Closed
                        </option>
                    </select>

                    {/* Category */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            const value = e.target.value;

                            setCategoryFilter(value);

                            if (value === "All") {
                                navigate("/recruiter/jobs");
                            } else {
                                navigate(
                                    `/recruiter/jobs?category=${encodeURIComponent(
                                        value
                                    )}`
                                );
                            }
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="All">
                            All Categories
                        </option>

                        <option value="Development">
                            Development
                        </option>

                        <option value="Design">
                            Design
                        </option>

                        <option value="Human Resources">
                            Human Resources
                        </option>

                        <option value="Marketing">
                            Marketing
                        </option>

                        <option value="Sales">
                            Sales
                        </option>

                        <option value="Finance">
                            Finance
                        </option>
                    </select>
                </div>
            </section>

            {/* =========================
                RESULTS HEADER
            ========================= */}
            <div className="mt-7 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        {categoryFilter !== "All"
                            ? `${categoryFilter} Jobs`
                            : "Your Job Postings"}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        {filteredJobs.length}{" "}
                        {filteredJobs.length === 1
                            ? "job"
                            : "jobs"}{" "}
                        found
                    </p>
                </div>
            </div>

            {/* =========================
                JOB CARDS
            ========================= */}
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
                                        <BriefcaseBusiness
                                            size={21}
                                        />
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
                            <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleViewJob(job)
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Eye size={15} />
                                    View Job
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleViewApplications(job)
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Users size={15} />
                                    Applications
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEdit(job)
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <Edit size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(job)
                                    }
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
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                        No jobs found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                        We couldn't find any jobs matching your
                        search or selected filters.
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

            {/* =====================================================
                VIEW APPLICATIONS MODAL
            ====================================================== */}
            {showApplications && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Applications
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedJob.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedJob.applications} candidates
                                    applied for this position.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowApplications(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto p-6">
                            {applications[selectedJob.id]?.length > 0 ? (
                                <div className="space-y-4">
                                    {applications[
                                        selectedJob.id
                                    ].map((application) => (
                                        <div
                                            key={application.id}
                                            className="rounded-2xl border border-slate-200 p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                        {application.name
                                                            .split(" ")
                                                            .map(
                                                                (name) =>
                                                                    name[0]
                                                            )
                                                            .join("")}
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">
                                                            {
                                                                application.name
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {
                                                                application.email
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                application.experience
                                                            }{" "}
                                                            experience
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getApplicationStatusClasses(
                                                        application.status
                                                    )}`}
                                                >
                                                    {
                                                        application.status
                                                    }
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    View Profile
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                                >
                                                    Update Status
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Users
                                        size={35}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No applications yet
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        No candidates have applied for
                                        this job yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                EDIT JOB MODAL
            ====================================================== */}
            {showEditModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium text-indigo-600">
                                    Hiring Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Edit Job
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={selectedJob.title}
                                    onChange={handleEditChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={selectedJob.category}
                                        onChange={handleEditChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="Development">
                                            Development
                                        </option>

                                        <option value="Design">
                                            Design
                                        </option>

                                        <option value="Human Resources">
                                            Human Resources
                                        </option>

                                        <option value="Marketing">
                                            Marketing
                                        </option>

                                        <option value="Sales">
                                            Sales
                                        </option>

                                        <option value="Finance">
                                            Finance
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={selectedJob.status}
                                        onChange={handleEditChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Closed">
                                            Closed
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={selectedJob.location}
                                        onChange={handleEditChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Job Type
                                    </label>

                                    <select
                                        name="type"
                                        value={selectedJob.type}
                                        onChange={handleEditChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="Full Time">
                                            Full Time
                                        </option>

                                        <option value="Part Time">
                                            Part Time
                                        </option>

                                        <option value="Contract">
                                            Contract
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Work Mode
                                </label>

                                <select
                                    name="workMode"
                                    value={
                                        selectedJob.workMode ||
                                        "Hybrid"
                                    }
                                    onChange={handleEditChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="Remote">
                                        Remote
                                    </option>

                                    <option value="Hybrid">
                                        Hybrid
                                    </option>

                                    <option value="Onsite">
                                        Onsite
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={selectedJob.description}
                                    onChange={handleEditChange}
                                    rows={5}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedJob(null);
                                    }}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ====================================================== */}
            {showDeleteModal && selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-slate-900">
                            Delete this job?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-700">
                                {selectedJob.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedJob(null);
                                }}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
