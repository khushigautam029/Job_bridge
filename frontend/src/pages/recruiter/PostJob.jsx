import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    FileText,
    MapPin,
    Plus,
    Save,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        type: "",
        workMode: "",
        location: "",
        experience: "",
        salary: "",
        deadline: "",
        description: "",
        requirements: "",
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove error when user starts changing fields
        if (error) {
            setError("");
        }
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        const skillExists = skills.some(
            (existingSkill) =>
                existingSkill.toLowerCase() === skill.toLowerCase()
        );

        if (!skillExists) {
            setSkills((prev) => [...prev, skill]);
        }

        setSkillInput("");
    };
    const handleRemoveSkill = (skillToRemove) => {
        setSkills((prev) =>
            prev.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!formData.title.trim()) {
            setError("Job title is required.");
            return;
        }

        if (!formData.category) {
            setError("Please select a job category.");
            return;
        }

        if (!formData.type) {
            setError("Please select a job type.");
            return;
        }

        if (!formData.workMode) {
            setError("Please select a work mode.");
            return;
        }

        if (!formData.location.trim()) {
            setError("Location is required.");
            return;
        }

        if (!formData.experience) {
            setError("Please select the required experience.");
            return;
        }

        if (!formData.salary.trim()) {
            setError("Salary is required.");
            return;
        }

        if (!formData.deadline) {
            setError("Application deadline is required.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Job description is required.");
            return;
        }

        if (!formData.requirements.trim()) {
            setError("Job requirements are required.");
            return;
        }

        if (skills.length === 0) {
            setError("Please add at least one required skill.");
            return;
        }

        try {
            setLoading(true);

            /*
             * For now this creates the job locally.
             *
             * Once your backend API is ready, this is where we will
             * replace the local logic with the POST /jobs API call.
             */

            const newJob = {
                id: Date.now(),
                title: formData.title,
                category: formData.category,
                location: formData.location,
                type: formData.type,
                workMode: formData.workMode,
                experience: formData.experience,
                salary: formData.salary,
                deadline: formData.deadline,
                description: formData.description,
                requirements: formData.requirements,
                skills,
                applications: 0,
                postedDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                status: "Active",
            };

            console.log("Job to be posted:", newJob);

            setSuccess("Job posted successfully!");

            /*
             * Small delay so the success message can be seen.
             */
            setTimeout(() => {
                navigate("/recruiter/jobs", {
                    state: {
                        newJob,
                    },
                });
            }, 700);
        } catch (err) {
            console.error("Post job error:", err);
            setError("Something went wrong while posting the job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* =========================
                PAGE HEADER
            ========================= */}
            <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Hiring Management
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                            Post a Job
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Create a new job posting and find the right
                            candidate for your company.
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================
                ERROR MESSAGE
            ========================= */}
            {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {/* =========================
                SUCCESS MESSAGE
            ========================= */}
            {success && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    {success}
                </div>
            )}

            {/* =========================
                FORM
            ========================= */}
            <form onSubmit={handleSubmit} className="mt-7">
                {/* =========================
                    BASIC INFORMATION
                ========================= */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <BriefcaseBusiness size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Basic Information
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Provide the basic details about the job.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        {/* Job Title */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior React Developer"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Job Category
                            </label>

                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select category
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

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Job Type
                            </label>

                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select job type
                                    </option>

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

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Work Mode */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Work Mode
                            </label>

                            <div className="relative">
                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select work mode
                                    </option>

                                    <option value="On-site">
                                        On-site
                                    </option>

                                    <option value="Remote">
                                        Remote
                                    </option>

                                    <option value="Hybrid">
                                        Hybrid
                                    </option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Location
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Delhi, India"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Experience
                            </label>

                            <div className="relative">
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select experience
                                    </option>

                                    <option value="Fresher">
                                        Fresher
                                    </option>

                                    <option value="0-1 Years">
                                        0-1 Years
                                    </option>

                                    <option value="1-2 Years">
                                        1-2 Years
                                    </option>

                                    <option value="2-4 Years">
                                        2-4 Years
                                    </option>

                                    <option value="4-6 Years">
                                        4-6 Years
                                    </option>

                                    <option value="6+ Years">
                                        6+ Years
                                    </option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. ₹8 - ₹12 LPA"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Application Deadline
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================
                    JOB DESCRIPTION
                ========================= */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <FileText size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Job Description
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Describe the role and what the candidate
                                    will be responsible for.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-6">
                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Describe the job role, responsibilities, team, and what the candidate will be working on..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Requirements
                            </label>

                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Mention education, experience, responsibilities, qualifications, and other requirements..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                </section>

                {/* =========================
                    SKILLS
                ========================= */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="font-semibold text-slate-900">
                            Required Skills
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Add the technical or professional skills required
                            for this position.
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) =>
                                    setSkillInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSkill();
                                    }
                                }}
                                placeholder="e.g. React, Node.js, MySQL"
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />

                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Plus size={17} />
                                Add Skill
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600"
                                    >
                                        {skill}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSkill(skill)
                                            }
                                            className="text-indigo-400 transition hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* =========================
                    ACTIONS
                ========================= */}
                <section className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        <X size={17} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={17} />

                        {loading ? "Posting..." : "Post Job"}
                    </button>
                </section>
            </form>
        </div>
    );
};

export default PostJob;