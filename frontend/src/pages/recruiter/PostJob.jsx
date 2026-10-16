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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createJob,
    getJobCategories,
    getMyJobs,
} from "../../services/jobService";
import { getSkills } from "../../services/skillService";

const PostJob = () => {
    const navigate = useNavigate();
    const today = new Date();
    const minimumDeadline = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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
        responsibilities: "",
        requirements: "",
    });
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [skillCatalog, setSkillCatalog] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [skillsError, setSkillsError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [possibleDuplicate, setPossibleDuplicate] = useState(null);

    useEffect(() => {
        Promise.all([getJobCategories(), getSkills()])
            .then(([jobCategories, availableSkills]) => {
                setCategories(jobCategories);
                setSkillCatalog(availableSkills);
            })
            .catch((loadError) => {
                setError(
                    loadError.response?.data?.message ||
                    "Unable to load job categories and skills."
                );
            });
    }, []);
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
        setSkillsError("");

        setSkillInput("");
    };
    const handleRemoveSkill = (skillToRemove) => {
        setSkills((prev) =>
            prev.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleSubmit = async (e, allowDuplicate = false) => {
        e?.preventDefault();
        if (allowDuplicate) setPossibleDuplicate(null);
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
            setSkillsError("Please add at least one required skill.");
            return;
        }

        try {
            setLoading(true);

            if (!allowDuplicate) {
                const normalize = (value) => (value || "")
                    .trim()
                    .toLocaleLowerCase()
                    .replace(/\s+/g, " ");
                const existingJobs = await getMyJobs();
                const duplicate = existingJobs.find((job) =>
                    normalize(job.title) === normalize(formData.title) &&
                    normalize(job.location) === normalize(formData.location) &&
                    normalize(job.requirements) === normalize(formData.requirements)
                );

                if (duplicate) {
                    setPossibleDuplicate(duplicate);
                    return;
                }
            }

            const matchedSkills = skills.map((name) =>
                skillCatalog.find(
                    (skill) =>
                        skill.name.toLowerCase() === name.toLowerCase()
                )
            );
            if (matchedSkills.some((skill) => !skill)) {
                throw new Error(
                    "One or more skills are not in the available skills catalog."
                );
            }

            const salaryAmounts = [...formData.salary.matchAll(/(\d+(?:\.\d+)?)\s*([LK]?)/gi)];
            const salaryMultiplier = /lpa|lakh|L/i.test(formData.salary)
                ? 100000
                : /k/i.test(formData.salary)
                    ? 1000
                    : 1;
            const amounts = salaryAmounts.map((match) =>
                Number(match[1]) * salaryMultiplier
            );
            const experienceValues = formData.experience.match(/\d+/g)?.map(Number) || [];
            const jobType = formData.type.toUpperCase().replaceAll(" ", "_");
            const workMode = formData.workMode
                .toUpperCase()
                .replaceAll("-", "")
                .replaceAll(" ", "_");

            await createJob({
                categoryId: Number(formData.category),
                skillIds: matchedSkills.map((skill) => skill.id),
                title: formData.title.trim(),
                description: formData.description.trim(),
                responsibilities: formData.responsibilities.trim(),
                requirements: formData.requirements.trim(),
                jobType,
                workMode,
                location: formData.location.trim(),
                minSalary: amounts[0] || undefined,
                maxSalary: amounts[1] || amounts[0] || undefined,
                experienceMin: experienceValues[0] || 0,
                experienceMax: formData.experience.includes("+")
                    ? null
                    : experienceValues[1] || experienceValues[0],
                applicationDeadline: formData.deadline,
                status: "OPEN",
            });

            setPossibleDuplicate(null);
            setSuccess("Job posted successfully!");
            setTimeout(() => {
                navigate("/recruiter/jobs");
            }, 700);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while posting the job."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Hiring Management
                        </p>

                        <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                            Post a Job
                        </h1>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Create a new job posting and find the right
                            candidate for your company.
                        </p>
                    </div>
                </div>
            </section>
            {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 grid gap-3 lg:grid-cols-12 lg:items-stretch">
                <section className="rounded-xl border-0 bg-white shadow-sm lg:col-span-12">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <BriefcaseBusiness size={17} />
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

                    <div className="grid gap-x-3 gap-y-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Job Title */}
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior React Developer"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Job Category
                            </label>

                            <div className="relative">
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Job Type
                            </label>

                            <div className="relative">
                                <select
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Work Mode
                            </label>

                            <div className="relative">
                                <select
                                    name="workMode"
                                    required
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                            <label className="mb-1 block text-xs font-medium text-slate-700">
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
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Delhi, India"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Experience
                            </label>

                            <div className="relative">
                                <select
                                    name="experience"
                                    required
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                required
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. ₹8 - ₹12 LPA"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
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
                                    required
                                    min={minimumDeadline}
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl border-0 bg-white shadow-sm lg:col-span-8">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <FileText size={17} />
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

                    <div className="grid gap-3 p-4 md:grid-cols-3">
                        {/* Description */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                required
                                pattern="(?!.*\\s{2,})[\\s\\S]*"
                                title="Use only one space between words."
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the job role, responsibilities, team, and what the candidate will be working on..."
                                className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Key Responsibilities
                            </label>

                            <textarea
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleChange}
                                rows={3}
                                placeholder="List the main responsibilities for this role..."
                                className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                                Requirements
                            </label>

                            <textarea
                                name="requirements"
                                required
                                pattern="(?!.*\\s{2,})[\\s\\S]*"
                                title="Use only one space between words."
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Mention education, experience, responsibilities, qualifications, and other requirements..."
                                className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border-0 bg-white shadow-sm lg:col-span-4">
                    <div className="border-b border-slate-200 px-4 py-3">
                        <h2 className="font-semibold text-slate-900">
                            Required Skills <span className="text-red-500">*</span>
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Add the technical or professional skills required
                            for this position.
                        </p>
                    </div>

                    <div className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={skillInput}
                                aria-invalid={Boolean(skillsError)}
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
                                className={`min-w-0 flex-1 rounded-lg border ${skillsError ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"} px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100`}
                            />

                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Plus size={17} />
                                Add Skill
                            </button>
                        </div>

                        {skillsError && (
                            <p className="mt-2 text-sm text-red-600" role="alert">{skillsError}</p>
                        )}

                        {skills.length > 0 && (
                            <div className="mt-3 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600"
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

                <section className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end lg:col-span-12">
                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        <X size={17} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={17} />

                        {loading ? "Posting..." : "Post Job"}
                    </button>
                </section>
            </form>

            {possibleDuplicate && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-slate-900/40 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="possible-duplicate-title">
                    <div className="w-full max-w-lg rounded-2xl border-0 bg-white p-6 shadow-2xl">
                        <h2 id="possible-duplicate-title" className="text-lg font-bold text-slate-900">Possible duplicate job</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            You already have a job with the same title, company, location, and requirements: <span className="font-semibold text-slate-800">{possibleDuplicate.title}</span> in <span className="font-semibold text-slate-800">{possibleDuplicate.location || "unspecified location"}</span>. Do you want to post another one?
                        </p>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setPossibleDuplicate(null)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                Go back and edit
                            </button>
                            <button type="button" onClick={(event) => handleSubmit(event, true)} disabled={loading} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                                {loading ? "Posting..." : "Post another job"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJob;
