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

const RequiredMark = () => (
    <span className="ml-1 font-semibold text-red-500" aria-hidden="true">
        *
    </span>
);

const FieldLabel = ({ htmlFor, children, required = false }) => (
    <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
    >
        {children}
        {required && <RequiredMark />}
    </label>
);

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const selectClass = `${inputClass} appearance-none pr-10`;

const textareaClass =
    "w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={21} />
        </div>
        <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                {title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
            </p>
        </div>
    </div>
);

const PostJob = () => {
    const navigate = useNavigate();
    const today = new Date();
    const minimumDeadline = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) setError("");
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();
        if (!skill) return;

        const alreadyAdded = skills.some(
            (existingSkill) =>
                existingSkill.toLowerCase() === skill.toLowerCase()
        );

        if (!alreadyAdded) {
            setSkills((previous) => [...previous, skill]);
        }

        setSkillsError("");
        setSkillInput("");
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills((previous) =>
            previous.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleSubmit = async (event, allowDuplicate = false) => {
        event?.preventDefault();

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
                const normalize = (value) =>
                    (value || "")
                        .trim()
                        .toLocaleLowerCase()
                        .replace(/\s+/g, " ");

                const existingJobs = await getMyJobs();
                const duplicate = existingJobs.find(
                    (job) =>
                        normalize(job.title) === normalize(formData.title) &&
                        normalize(job.location) ===
                        normalize(formData.location) &&
                        normalize(job.requirements) ===
                        normalize(formData.requirements)
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
                    "One or more skills are not in the available skills catalog. Please use skills available in the system."
                );
            }

            const salaryAmounts = [
                ...formData.salary.matchAll(/(\d+(?:\.\d+)?)\s*([LK]?)/gi),
            ];
            const salaryMultiplier = /lpa|lakh|L/i.test(formData.salary)
                ? 100000
                : /k/i.test(formData.salary)
                    ? 1000
                    : 1;

            const amounts = salaryAmounts.map(
                (match) => Number(match[1]) * salaryMultiplier
            );

            const experienceValues =
                formData.experience.match(/\d+/g)?.map(Number) || [];
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
            }, 900);
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                submitError.message ||
                "Something went wrong while posting the job."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50/70 px-3 py-3 sm:px-5 sm:py-2 lg:px-1">
            <div className="w-full min-w-0 max-w-none">
                <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/recruiter/jobs")}
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label="Back to jobs"
                        >
                            <ArrowLeft size={19} />
                        </button>
                        <div>
                            <p className="text-sm font-semibold text-indigo-600">
                                Hiring Management
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Post a Job
                            </h1>
                            <p className="mt-2 whitespace-nowrap text-sm leading-6 text-slate-500 sm:text-base">
                                Share the role details, responsibilities, and skills so candidates can understand the opportunity clearly.
                            </p>
                        </div>
                    </div>
                </header>

                {error && (
                    <div
                        className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                        role="alert"
                    >
                        <span className="font-bold">!</span>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div
                        className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                        role="status"
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* BASIC INFORMATION */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={BriefcaseBusiness}
                            title="Basic Information"
                            description="Start with the main details candidates need to know about this opportunity."
                        />

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                            <div className="sm:col-span-2">
                                <FieldLabel htmlFor="title" required>
                                    Job Title
                                </FieldLabel>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior React Developer"
                                    className={inputClass}
                                />
                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Use a clear title that candidates will
                                    recognize.
                                </p>
                            </div>

                            <div>
                                <FieldLabel htmlFor="category" required>
                                    Job Category
                                </FieldLabel>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option value="">Select category</option>
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
                                        size={17}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="type" required>
                                    Job Type
                                </FieldLabel>
                                <div className="relative">
                                    <select
                                        id="type"
                                        name="type"
                                        required
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option value="">Select job type</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    <ChevronDown
                                        size={17}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="workMode" required>
                                    Work Mode
                                </FieldLabel>
                                <div className="relative">
                                    <select
                                        id="workMode"
                                        name="workMode"
                                        required
                                        value={formData.workMode}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option value="">Select work mode</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                    <ChevronDown
                                        size={17}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="location" required>
                                    Location
                                </FieldLabel>
                                <div className="relative">
                                    <MapPin
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Delhi, India"
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="experience" required>
                                    Required Experience
                                </FieldLabel>
                                <div className="relative">
                                    <select
                                        id="experience"
                                        name="experience"
                                        required
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        <option value="">Select experience</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="0-1 Years">0–1 Years</option>
                                        <option value="1-2 Years">1–2 Years</option>
                                        <option value="2-4 Years">2–4 Years</option>
                                        <option value="4-6 Years">4–6 Years</option>
                                        <option value="6+ Years">6+ Years</option>
                                    </select>
                                    <ChevronDown
                                        size={17}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel htmlFor="salary" required>
                                    Salary / Compensation
                                </FieldLabel>
                                <input
                                    id="salary"
                                    type="text"
                                    name="salary"
                                    required
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. ₹8 - ₹12 LPA"
                                    className={inputClass}
                                />
                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    You can enter a range, such as ₹8–₹12 LPA.
                                </p>
                            </div>

                            <div>
                                <FieldLabel htmlFor="deadline" required>
                                    Application Deadline
                                </FieldLabel>
                                <div className="relative">
                                    <CalendarDays
                                        size={17}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="deadline"
                                        type="date"
                                        name="deadline"
                                        required
                                        min={minimumDeadline}
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* JOB DESCRIPTION */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FileText}
                            title="Job Description"
                            description="Write a detailed, easy-to-read overview of the role. Give candidates enough context to understand the job before applying."
                        />

                        <div className="space-y-6 p-5 sm:p-7">
                            <div>
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <FieldLabel htmlFor="description" required>
                                        Job Description
                                    </FieldLabel>
                                    <span className="text-xs text-slate-400">
                                        {formData.description.length} characters
                                    </span>
                                </div>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    minLength={20}
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={9}
                                    placeholder={
                                        "Introduce the role and team, explain the purpose of the position, and describe what the successful candidate will work on.\n\nExample: We are looking for a motivated Full Stack Developer to build and maintain web applications. You will collaborate with designers and other developers to deliver reliable, user-friendly features."
                                    }
                                    className={`${textareaClass} min-h-60`}
                                />
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Tip: Include the role's purpose, team
                                    context, and what a typical day or project
                                    might involve. Use paragraphs to keep it
                                    readable.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div>
                                    <FieldLabel htmlFor="responsibilities">
                                        Key Responsibilities
                                    </FieldLabel>
                                    <textarea
                                        id="responsibilities"
                                        name="responsibilities"
                                        value={formData.responsibilities}
                                        onChange={handleChange}
                                        rows={7}
                                        placeholder={
                                            "List the main duties, one per line.\n\nExample:\n• Develop and maintain web features\n• Write clean, testable code\n• Collaborate with the product team"
                                        }
                                        className={`${textareaClass} min-h-48`}
                                    />
                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Optional, but recommended. Separate
                                        responsibilities onto different lines
                                        for clarity.
                                    </p>
                                </div>

                                <div>
                                    <FieldLabel htmlFor="requirements" required>
                                        Requirements & Qualifications
                                    </FieldLabel>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        required
                                        minLength={5}
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows={7}
                                        placeholder={
                                            "List the essential qualifications, one per line.\n\nExample:\n• Knowledge of JavaScript and React\n• Familiarity with REST APIs\n• Good problem-solving and communication skills"
                                        }
                                        className={`${textareaClass} min-h-48`}
                                    />
                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Include required education, experience,
                                        technical knowledge, and other
                                        essential qualifications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* REQUIRED SKILLS */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={BriefcaseBusiness}
                            title="Required Skills"
                            description="Add the technical or professional skills a candidate should have for this role."
                        />

                        <div className="p-5 sm:p-7">
                            <FieldLabel htmlFor="skillInput" required>
                                Add Skills
                            </FieldLabel>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    id="skillInput"
                                    type="text"
                                    value={skillInput}
                                    aria-invalid={Boolean(skillsError)}
                                    onChange={(event) =>
                                        setSkillInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                    placeholder="e.g. React, Node.js, MySQL"
                                    className={`${inputClass} min-w-0 flex-1 ${skillsError
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : ""
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                >
                                    <Plus size={18} />
                                    Add Skill
                                </button>
                            </div>

                            {skillsError && (
                                <p className="mt-2 text-sm text-red-600" role="alert">
                                    {skillsError}
                                </p>
                            )}

                            {skills.length > 0 ? (
                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Selected skills
                                        </p>
                                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                                            {skills.length} selected
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveSkill(skill)
                                                    }
                                                    aria-label={`Remove ${skill}`}
                                                    className="rounded-md p-0.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                                    <p className="text-sm font-medium text-slate-600">
                                        No skills added yet
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Add at least one skill to help candidates
                                        understand what this role requires.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* FORM ACTIONS */}
                    <div className="sticky bottom-0 z-10 -mx-3 mt-5 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
                        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500">
                                Check the required fields before publishing
                                your job.
                            </p>
                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => navigate("/recruiter/jobs")}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    <X size={17} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={17} />
                                    {loading ? "Posting Job..." : "Post Job"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {possibleDuplicate && (
                    <div
                        className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="possible-duplicate-title"
                    >
                        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <BriefcaseBusiness size={22} />
                            </div>
                            <h2
                                id="possible-duplicate-title"
                                className="mt-4 text-xl font-bold text-slate-900"
                            >
                                Possible duplicate job
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                You already have a job with the same title,
                                location, and requirements:{" "}
                                <span className="font-semibold text-slate-800">
                                    {possibleDuplicate.title}
                                </span>{" "}
                                in{" "}
                                <span className="font-semibold text-slate-800">
                                    {possibleDuplicate.location ||
                                        "unspecified location"}
                                </span>
                                . Do you want to post another one?
                            </p>
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setPossibleDuplicate(null)}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Go back and edit
                                </button>
                                <button
                                    type="button"
                                    onClick={(event) =>
                                        handleSubmit(event, true)
                                    }
                                    disabled={loading}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {loading ? "Posting..." : "Post another job"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostJob;
