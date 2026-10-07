import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileText,
    Mail,
    MapPin,
    Phone,
    Send,
    Upload,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyForJob } from "../../services/applicationService";
import { getJob } from "../../services/jobService";
import {
    getCandidateProfile,
    uploadCandidateResume,
} from "../../services/profileService";

const getStoredUser = () => {
    try {
        const storedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : {};
    } catch {
        return {};
    }
};

const ApplyJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const user = getStoredUser();
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [candidateName, setCandidateName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [existingResume, setExistingResume] = useState("");

    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");

    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        let active = true;

        Promise.all([
            getJob(jobId),
            getCandidateProfile(),
        ])
            .then(([job, profileResponse]) => {
                if (!active) return;
                const candidate = profileResponse.data.candidate;
                setSelectedJob({
                    ...job,
                    company: job.company?.name || "Company",
                    employmentType: (job.jobType || "")
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
                    workMode: (job.workMode || "")
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
                    experience: job.experienceMax
                        ? `${job.experienceMin || 0}-${job.experienceMax} years`
                        : `${job.experienceMin || 0}+ years`,
                });
                setCandidateName(candidate.user?.name || user?.name || "");
                setEmail(candidate.user?.email || user?.email || "");
                setPhone(candidate.user?.phone || user?.phone || "");
                setExistingResume(candidate.resume || "");
            })
            .catch((loadError) => {
                if (active) {
                    setError(
                        loadError.response?.data?.message ||
                        "Unable to load this job or your profile."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [jobId, user?.email, user?.name, user?.phone]);

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const allowedExtensions = [".pdf", ".doc", ".docx"];

        const fileName = file.name.toLowerCase();

        const hasValidType = allowedTypes.includes(file.type);
        const hasValidExtension = allowedExtensions.some((extension) =>
            fileName.endsWith(extension)
        );

        if (!hasValidType && !hasValidExtension) {
            setResume(null);
            setError("Please upload a PDF, DOC, or DOCX file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResume(null);
            setError("Resume size must be less than 5 MB.");
            return;
        }

        setResume(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!candidateName.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!resume && !existingResume) {
            setError("Please upload your resume before applying.");
            return;
        }

        try {
            setSubmitting(true);
            let resumePath = existingResume;
            if (resume) {
                const response = await uploadCandidateResume(resume);
                resumePath =
                    response.data.data?.candidate?.resume ||
                    response.data.candidate?.resume;
            }

            await applyForJob(jobId, {
                resume: resumePath,
                coverLetter,
            });
            setSubmitted(true);
        } catch (submitError) {
            setError(
                submitError.response?.data?.message ||
                "Unable to submit your application."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
                Loading job...
            </div>
        );
    }

    if (!selectedJob) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Job Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The job you are trying to apply for does not exist.
                    </p>

                    <button
                        onClick={() => navigate("/candidate/jobs")}
                        className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2
                                size={34}
                                className="text-green-600"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mt-5">
                            Application Submitted!
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Your application has been submitted successfully.
                        </p>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-6 text-left">
                            <p className="text-sm text-gray-500">
                                Applied for
                            </p>

                            <h2 className="text-lg font-semibold text-gray-900 mt-1">
                                {selectedJob.title}
                            </h2>

                            <div className="flex items-center gap-2 mt-2 text-gray-600">
                                <Building2 size={16} />
                                <span>{selectedJob.company}</span>
                            </div>

                            <div className="flex items-center gap-2 mt-2 text-gray-600">
                                <MapPin size={16} />
                                <span>{selectedJob.location}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-7">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/candidate/jobs/${selectedJob.id}`
                                    )
                                }
                                className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Back to Job
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/candidate/applications")
                                }
                                className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                View Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() =>
                        navigate(`/candidate/jobs/${selectedJob.id}`)
                    }
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    Back to Job Details
                </button>

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Apply for this Job
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Complete your application for this position.
                    </p>
                </div>

                {/* Selected Job */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <BriefcaseBusiness
                                        size={22}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {selectedJob.title}
                                    </h2>

                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <Building2 size={16} />
                                        <span>
                                            {selectedJob.company}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-5 text-sm">
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                                    {selectedJob.employmentType}
                                </span>

                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                                    {selectedJob.workMode}
                                </span>

                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                                    <MapPin size={14} />
                                    {selectedJob.location}
                                </span>

                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                                    {selectedJob.experience}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">

                        <div className="mb-7">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Your Information
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Make sure your contact information is correct.
                            </p>
                        </div>

                        {/* Name */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={candidateName}
                                    onChange={(e) =>
                                        setCandidateName(e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Email + Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="Enter your phone number"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Resume */}
                        <div className="mt-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume <span className="text-red-500">*</span>
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="resume"
                                    className="cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                        <Upload
                                            size={22}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <p className="text-sm font-medium text-gray-800 mt-3">
                                        Click to upload your resume
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, DOC or DOCX · Maximum 5 MB
                                    </p>
                                </label>

                                {resume && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                                        <FileText size={17} />
                                        <span className="font-medium">
                                            {resume.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="mt-7">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Letter
                                <span className="text-gray-400 font-normal">
                                    {" "}
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                value={coverLetter}
                                onChange={(e) =>
                                    setCoverLetter(e.target.value)
                                }
                                rows={6}
                                placeholder="Tell the recruiter why you are a good fit for this role..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Keep your cover letter concise and relevant to
                                this position.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/candidate/jobs/${selectedJob.id}`
                                    )
                                }
                                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 sm:flex-none px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                {submitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Bottom Note */}
                <p className="text-xs text-gray-400 text-center mt-5">
                    By submitting this application, you confirm that the
                    information provided is accurate.
                </p>
            </div>
        </div>
    );
};

export default ApplyJob;
