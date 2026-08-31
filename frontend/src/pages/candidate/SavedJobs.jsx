import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    MapPin,
    Trash2,
} from "lucide-react";

const SavedJobs = () => {
    const savedJobs = [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechNova Solutions",
            location: "Delhi, India",
            type: "Full Time",
            salary: "₹8L - ₹14L",
            savedDate: "August 26, 2026",
            skills: ["React", "JavaScript", "Node.js"],
        },
        {
            id: 2,
            title: "Backend Developer",
            company: "CloudCore Technologies",
            location: "Bangalore, India",
            type: "Full Time",
            salary: "₹7L - ₹12L",
            savedDate: "August 24, 2026",
            skills: ["Node.js", "Express", "MySQL"],
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Labs",
            location: "Remote",
            type: "Full Time",
            salary: "₹5L - ₹9L",
            savedDate: "August 22, 2026",
            skills: ["Figma", "UI Design", "UX"],
        },
        {
            id: 4,
            title: "MERN Stack Developer",
            company: "Digital Solutions",
            location: "Delhi, India",
            type: "Full Time",
            salary: "₹7L - ₹12L",
            savedDate: "August 20, 2026",
            skills: ["MongoDB", "Express", "React", "Node.js"],
        },
        {
            id: 5,
            title: "Frontend Developer",
            company: "Pixel Technologies",
            location: "Remote",
            type: "Full Time",
            salary: "₹6L - ₹10L",
            savedDate: "August 18, 2026",
            skills: ["React", "Tailwind CSS", "JavaScript"],
        },
        {
            id: 6,
            title: "Node.js Developer",
            company: "Cloud Systems",
            location: "Bangalore, India",
            type: "Full Time",
            salary: "₹8L - ₹14L",
            savedDate: "August 16, 2026",
            skills: ["Node.js", "Express", "MySQL"],
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <section>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Your Shortlist
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Saved Jobs
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Keep track of jobs you are interested in and apply when
                    you're ready.
                </p>
            </section>

            {/* Summary */}
            <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Saved Jobs
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                8
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Jobs in your shortlist
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Bookmark size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Full Time
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                6
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Full-time opportunities
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Remote
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                2
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Remote opportunities
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <MapPin size={21} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Saved Jobs */}
            <section className="mt-7">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Your Saved Jobs
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                            {savedJobs.length} jobs currently saved
                        </p>
                    </div>

                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-400 sm:w-44">
                        <option>Recently Saved</option>
                        <option>Salary: High to Low</option>
                        <option>Salary: Low to High</option>
                        <option>Company</option>
                    </select>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {savedJobs.map((job) => (
                        <div
                            key={job.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                        >
                            {/* Top */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Building2 size={22} />
                                </div>

                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-indigo-600 transition hover:bg-red-50 hover:text-red-500"
                                    title="Remove from saved jobs"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Job Information */}
                            <div className="mt-5">
                                <h4 className="text-lg font-semibold text-slate-900">
                                    {job.title}
                                </h4>

                                <p className="mt-1 text-sm font-medium text-slate-600">
                                    {job.company}
                                </p>
                            </div>

                            {/* Details */}
                            <div className="mt-4 space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-slate-400"
                                    />

                                    <span>{job.location}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness
                                        size={16}
                                        className="text-slate-400"
                                    />

                                    <span>{job.type}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">₹</span>

                                    <span>{job.salary}</span>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-400">
                                    Saved on {job.savedDate}
                                </p>

                                <button
                                    type="button"
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    View Job
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Haven't found the right job yet?
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                            Explore more opportunities based on your skills
                            and interests.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Find More Jobs
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SavedJobs;