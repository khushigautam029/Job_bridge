import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    MapPin,
    X,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Applications = () => {
    const navigate = useNavigate();

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All Applications");

    const applications = [
        {
            id: 1,
            position: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            appliedDate: "August 26, 2026",
            status: "Interview",
            statusText: "Interview scheduled",
            statusIcon: CalendarDays,

            salary: "₹10L - ₹15L",
            experience: "3 - 5 Years",
            workMode: "Hybrid",
            jobDescription:
                "We are looking for a Senior React Developer to build scalable and high-performance web applications using React, JavaScript, and modern frontend technologies.",
            skills: [
                "React",
                "JavaScript",
                "TypeScript",
                "Redux",
                "Tailwind CSS",
            ],
            resumeUrl: "/resumes/rahul-sharma-resume.pdf",
            resumeName: "Rahul-Sharma-Resume.pdf",
            coverLetter:
                "I am interested in the Senior React Developer position and believe my experience with React and modern JavaScript technologies makes me a strong fit for this role.",
            interviewDate: "September 18, 2026",
            interviewTime: "11:00 AM",
            interviewType: "Video Interview",
            recruiter: "Priya Mehta",
            recruiterEmail: "priya.mehta@technova.com",
            nextStep: "Attend the scheduled interview with the hiring team.",
        },

        {
            id: 2,
            position: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            appliedDate: "August 24, 2026",
            status: "Under Review",
            statusText: "Application under review",
            statusIcon: Clock3,

            salary: "₹8L - ₹12L",
            experience: "2 - 4 Years",
            workMode: "On-site",
            jobDescription:
                "CloudCore Technologies is looking for a Backend Developer to design reliable APIs and backend services using Node.js, Express, and SQL databases.",
            skills: [
                "Node.js",
                "Express.js",
                "MySQL",
                "REST API",
                "Sequelize",
            ],
            resumeUrl: "/resumes/rahul-sharma-resume.pdf",
            resumeName: "Rahul-Sharma-Resume.pdf",
            coverLetter:
                "I am excited to apply for the Backend Developer position. My experience building REST APIs with Node.js, Express, and SQL databases aligns well with your requirements.",
            recruiter: "Amit Kapoor",
            recruiterEmail: "amit.kapoor@cloudcore.com",
            nextStep:
                "The recruiter is reviewing your application. You will be notified when there is an update.",
        },

        {
            id: 3,
            position: "Full Stack Developer",
            company: "Innovate Labs",
            location: "Gurgaon, India",
            type: "Full Time",
            appliedDate: "August 21, 2026",
            status: "Applied",
            statusText: "Application submitted",
            statusIcon: CheckCircle2,

            salary: "₹9L - ₹14L",
            experience: "2 - 5 Years",
            workMode: "Hybrid",
            jobDescription:
                "Innovate Labs is hiring a Full Stack Developer to work across frontend and backend applications using React, Node.js, and modern databases.",
            skills: [
                "React",
                "Node.js",
                "Express.js",
                "MongoDB",
                "JavaScript",
            ],
            resumeUrl: "/resumes/rahul-sharma-resume.pdf",
            resumeName: "Rahul-Sharma-Resume.pdf",
            coverLetter:
                "I would love the opportunity to contribute as a Full Stack Developer. I have hands-on experience developing complete web applications across both frontend and backend technologies.",
            recruiter: "Neha Sharma",
            recruiterEmail: "neha@innovatlabs.com",
            nextStep:
                "Your application has been successfully submitted and is waiting for recruiter review.",
        },

        {
            id: 4,
            position: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            type: "Full Time",
            appliedDate: "August 18, 2026",
            status: "Rejected",
            statusText: "Application not selected",
            statusIcon: XCircle,

            salary: "₹7L - ₹11L",
            experience: "2 - 4 Years",
            workMode: "Remote",
            jobDescription:
                "Pixel Technologies was looking for a Frontend Developer to create responsive and user-friendly web applications.",
            skills: [
                "React",
                "HTML",
                "CSS",
                "JavaScript",
                "Tailwind CSS",
            ],
            resumeUrl: "/resumes/rahul-sharma-resume.pdf",
            resumeName: "Rahul-Sharma-Resume.pdf",
            coverLetter:
                "I am interested in joining Pixel Technologies as a Frontend Developer and believe my frontend development experience would allow me to contribute effectively to the team.",
            recruiter: "Rohit Malhotra",
            recruiterEmail: "rohit@pixeltechnologies.com",
            nextStep:
                "The company has decided not to move forward with this application at this time.",
        },

        {
            id: 5,
            position: "Node.js Developer",
            company: "Cloud Systems",
            location: "Bangalore, India",
            type: "Full Time",
            appliedDate: "August 15, 2026",
            status: "Applied",
            statusText: "Application submitted",
            statusIcon: CheckCircle2,

            salary: "₹8L - ₹13L",
            experience: "2 - 4 Years",
            workMode: "Hybrid",
            jobDescription:
                "Cloud Systems is looking for a Node.js Developer to build scalable backend services, APIs, and integrations.",
            skills: [
                "Node.js",
                "Express.js",
                "REST API",
                "MySQL",
                "JavaScript",
            ],
            resumeUrl: "/resumes/rahul-sharma-resume.pdf",
            resumeName: "Rahul-Sharma-Resume.pdf",
            coverLetter:
                "I am applying for the Node.js Developer position because my backend development experience matches the requirements of this role.",
            recruiter: "Karan Singh",
            recruiterEmail: "karan@cloudsystems.com",
            nextStep:
                "Your application has been submitted successfully and is awaiting recruiter review.",
        },
    ];

    const statusStyles = {
        Applied: {
            badge: "bg-indigo-50 text-indigo-600",
            icon: "bg-indigo-50 text-indigo-600",
            timeline: "bg-indigo-600",
        },

        "Under Review": {
            badge: "bg-amber-50 text-amber-600",
            icon: "bg-amber-50 text-amber-600",
            timeline: "bg-amber-500",
        },

        Interview: {
            badge: "bg-green-50 text-green-600",
            icon: "bg-green-50 text-green-600",
            timeline: "bg-green-600",
        },

        Rejected: {
            badge: "bg-red-50 text-red-600",
            icon: "bg-red-50 text-red-600",
            timeline: "bg-red-500",
        },
    };

    const filteredApplications = useMemo(() => {
        if (filterStatus === "All Applications") {
            return applications;
        }

        return applications.filter(
            (application) => application.status === filterStatus
        );
    }, [filterStatus]);

    const totalApplications = applications.length;

    const underReviewCount = applications.filter(
        (application) => application.status === "Under Review"
    ).length;

    const interviewCount = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    const rejectedCount = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    const openDetails = (application) => {
        setSelectedApplication(application);
    };

    const closeDetails = () => {
        setSelectedApplication(null);
    };

    const getTimeline = (application) => {
        const timeline = [
            {
                title: "Application Submitted",
                description: `You applied on ${application.appliedDate}.`,
                completed: true,
            },
        ];

        if (
            application.status === "Under Review" ||
            application.status === "Interview"
        ) {
            timeline.push({
                title: "Application Under Review",
                description:
                    "The recruiter has reviewed your application.",
                completed: true,
            });
        }

        if (application.status === "Interview") {
            timeline.push({
                title: "Interview Scheduled",
                description: `${application.interviewDate} at ${application.interviewTime}`,
                completed: true,
            });
        }

        if (application.status === "Rejected") {
            timeline.push({
                title: "Application Closed",
                description:
                    "The recruiter has decided not to move forward with this application.",
                completed: true,
            });
        }

        if (
            application.status === "Applied" ||
            application.status === "Under Review"
        ) {
            timeline.push({
                title: "Next Update",
                description:
                    "You will receive an update when the recruiter takes the next action.",
                completed: false,
            });
        }

        return timeline;
    };

    return (
        <div>
            {/* ==================== PAGE HEADER ==================== */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Career Activity
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Applications
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Keep track of all the jobs you have applied for.
                </p>
            </section>

            {/* ==================== APPLICATION SUMMARY ==================== */}
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
                            <FileText size={21} />
                        </div>
                    </div>
                </div>

                {/* Review */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Under Review
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {underReviewCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={21} />
                        </div>
                    </div>
                </div>

                {/* Interviews */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Interviews
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {interviewCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CalendarDays size={21} />
                        </div>
                    </div>
                </div>

                {/* Rejected */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Rejected
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {rejectedCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <XCircle size={21} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== APPLICATIONS ==================== */}
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            All Applications
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            View and track your application progress.
                        </p>
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-48"
                    >
                        <option>All Applications</option>
                        <option>Applied</option>
                        <option>Under Review</option>
                        <option>Interview</option>
                        <option>Rejected</option>
                    </select>
                </div>

                {/* Application List */}
                {filteredApplications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredApplications.map((application) => {
                            const StatusIcon = application.statusIcon;

                            return (
                                <div
                                    key={application.id}
                                    className="p-6 transition hover:bg-slate-50/70"
                                >
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                        {/* Job Information */}
                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <Building2 size={22} />
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-900">
                                                    {application.position}
                                                </h4>

                                                <p className="mt-1 text-sm font-medium text-slate-600">
                                                    {application.company}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                                                    <span>
                                                        📍{" "}
                                                        {application.location}
                                                    </span>

                                                    <span>
                                                        💼 {application.type}
                                                    </span>

                                                    <span>
                                                        Applied{" "}
                                                        {
                                                            application.appliedDate
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                    statusStyles[
                                                        application.status
                                                    ].icon
                                                }`}
                                            >
                                                <StatusIcon size={17} />
                                            </div>

                                            <div>
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        statusStyles[
                                                            application.status
                                                        ].badge
                                                    }`}
                                                >
                                                    {application.status}
                                                </span>

                                                <p className="mt-2 text-xs text-slate-400">
                                                    {application.statusText}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetails(application)
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 xl:w-auto"
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <FileText size={25} />
                        </div>

                        <h4 className="mt-4 font-semibold text-slate-900">
                            No applications found
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no applications with the selected
                            status.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setFilterStatus("All Applications")
                            }
                            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            View All Applications
                        </button>
                    </div>
                )}
            </section>

            {/* ==================== FIND MORE JOBS ==================== */}
            <section className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Looking for more opportunities?
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            Explore new jobs and find opportunities that match
                            your skills.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/candidate/jobs")}
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Find Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* ==================== APPLICATION DETAILS MODAL ==================== */}
            {selectedApplication && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeDetails();
                        }
                    }}
                >
                    <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
                            <div className="flex min-w-0 gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BriefcaseBusiness size={23} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                                        {selectedApplication.position}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        {selectedApplication.company}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={13} />
                                            {selectedApplication.location}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <BriefcaseBusiness size={13} />
                                            {selectedApplication.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetails}
                                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto px-6 py-6 sm:px-7">
                            {/* Status */}
                            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Application Status
                                    </p>

                                    <div className="mt-2 flex items-center gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                statusStyles[
                                                    selectedApplication.status
                                                ].badge
                                            }`}
                                        >
                                            {selectedApplication.status}
                                        </span>

                                        <span className="text-sm text-slate-500">
                                            {
                                                selectedApplication.statusText
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-xs text-slate-400">
                                        Applied On
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selectedApplication.appliedDate}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                                {/* Main */}
                                <div className="space-y-6 lg:col-span-2">
                                    {/* Job Details */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Job Details
                                        </h4>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Salary
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {
                                                        selectedApplication.salary
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Experience
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {
                                                        selectedApplication.experience
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Work Mode
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {
                                                        selectedApplication.workMode
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 p-4">
                                                <p className="text-xs text-slate-400">
                                                    Job Type
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {
                                                        selectedApplication.type
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Description */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            About This Position
                                        </h4>

                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            {
                                                selectedApplication.jobDescription
                                            }
                                        </p>
                                    </section>

                                    {/* Skills */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Required Skills
                                        </h4>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedApplication.skills.map(
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
                                    </section>

                                    {/* Cover Letter */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Your Cover Letter
                                        </h4>

                                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm leading-6 text-slate-600">
                                                {
                                                    selectedApplication.coverLetter
                                                }
                                            </p>
                                        </div>
                                    </section>

                                    {/* Interview */}
                                    {selectedApplication.status ===
                                        "Interview" && (
                                        <section className="rounded-2xl border border-green-100 bg-green-50 p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                                    <CalendarDays size={19} />
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-slate-900">
                                                        Interview Scheduled
                                                    </h4>

                                                    <p className="mt-1 text-sm text-slate-600">
                                                        Your interview has been
                                                        scheduled with the
                                                        hiring team.
                                                    </p>

                                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Date
                                                            </p>
                                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                {
                                                                    selectedApplication.interviewDate
                                                                }
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Time
                                                            </p>
                                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                {
                                                                    selectedApplication.interviewTime
                                                                }
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Type
                                                            </p>
                                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                                {
                                                                    selectedApplication.interviewType
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* Timeline */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Application Timeline
                                        </h4>

                                        <div className="mt-4">
                                            {getTimeline(
                                                selectedApplication
                                            ).map((item, index, items) => (
                                                <div
                                                    key={item.title}
                                                    className="relative flex gap-4"
                                                >
                                                    <div className="relative flex flex-col items-center">
                                                        <div
                                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                                item.completed
                                                                    ? "bg-indigo-600 text-white"
                                                                    : "bg-slate-200 text-slate-400"
                                                            }`}
                                                        >
                                                            <CheckCircle2
                                                                size={16}
                                                            />
                                                        </div>

                                                        {index <
                                                            items.length -
                                                                1 && (
                                                            <div className="h-full w-px bg-slate-200" />
                                                        )}
                                                    </div>

                                                    <div className="pb-6">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {item.title}
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Sidebar */}
                                <aside className="space-y-4">
                                    {/* Resume */}
                                    <div className="rounded-2xl border border-slate-200 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                                <FileText size={19} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Resume
                                                </p>

                                                <p className="truncate text-xs text-slate-400">
                                                    {
                                                        selectedApplication.resumeName
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={
                                                selectedApplication.resumeUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            View Resume
                                            <ExternalLink size={15} />
                                        </a>
                                    </div>

                                    {/* Recruiter */}
                                    <div className="rounded-2xl border border-slate-200 p-5">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Recruiter
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {
                                                selectedApplication.recruiter
                                            }
                                        </p>

                                        <a
                                            href={`mailto:${selectedApplication.recruiterEmail}`}
                                            className="mt-1 block break-all text-xs text-indigo-600 hover:underline"
                                        >
                                            {
                                                selectedApplication.recruiterEmail
                                            }
                                        </a>
                                    </div>

                                    {/* Next Step */}
                                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                            Next Step
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-slate-700">
                                            {selectedApplication.nextStep}
                                        </p>
                                    </div>
                                </aside>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <button
                                type="button"
                                onClick={closeDetails}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                Close
                            </button>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <a
                                    href={`mailto:${selectedApplication.recruiterEmail}`}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                                >
                                    Contact Recruiter
                                </a>

                                <button
                                    type="button"
                                    onClick={() => {
                                        closeDetails();
                                        navigate("/candidate/jobs");
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Find More Jobs
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;