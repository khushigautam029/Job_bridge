import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Clock3,
    FileText,
    Laptop,
    Mail,
    MapPin,
    Phone,
    Send,
    Upload,
    Users,
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
            localStorage.getItem("user") || sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    } catch {
        return {};
    }
};

const formatLabel = (value = "") =>
    value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

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

        Promise.all([getJob(jobId), getCandidateProfile()])
            .then(([job, profileResponse]) => {
                if (!active) return;

                const candidate = profileResponse.data.candidate;
                setSelectedJob({
                    ...job,
                    company: job.company?.name || "Company",
                    remainingOpenings:
                        job.remainingOpenings ?? job.totalOpenings ?? 1,
                    employmentType: formatLabel(job.jobType || ""),
                    workMode: formatLabel(job.workMode || ""),
                    experience: job.experienceMax
                        ? `${job.experienceMin || 0}–${job.experienceMax} years`
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
        if (!file) return;

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
            event.target.value = "";
            setError("Please upload a PDF, DOC, or DOCX file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResume(null);
            event.target.value = "";
            setError("Resume size must be less than 5 MB.");
            return;
        }

        setResume(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (selectedJob?.status !== "OPEN") {
            setError("This job is no longer accepting applications.");
            return;
        }

        if (!candidateName.trim()) {
            setError("Please enter your name.");
            return;
        }
        if (!email.trim()) {
            setError("Your account email is missing. Please update your profile first.");
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

            await applyForJob(jobId, { resume: resumePath, coverLetter });
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

    const backToJob = () => navigate(`/candidate/jobs/${selectedJob?.id || jobId}`);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    Loading application details...
                </div>
            </div>
        );
    }

    if (!selectedJob) {
        return (
            <div className="flex min-h-[60vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                        <BriefcaseBusiness size={25} />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-slate-900">Job not found</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        We couldn't load this job or your candidate profile.
                    </p>
                    {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
                    <button
                        type="button"
                        onClick={() => navigate("/candidate/jobs")}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <ArrowLeft size={16} /> Back to jobs
                    </button>
                </div>
            </div>
        );
    }

    const isJobOpen = selectedJob.status === "OPEN";

    if (submitted) {
        return (
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-[applyFadeIn_450ms_ease-out]">
                <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-indigo-50 px-5 py-8 text-center sm:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                        <CheckCircle2 size={34} />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Application submitted!</h1>
                    <p className="mt-2 text-sm text-slate-600">Your application has been sent successfully.</p>
                </div>
                <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-8">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">You applied for</p>
                        <h2 className="mt-1 text-lg font-bold text-slate-900">{selectedJob.title}</h2>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1.5"><Building2 size={15} />{selectedJob.company}</span>
                            {selectedJob.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{selectedJob.location}</span>}
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={backToJob} className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                            Back to job
                        </button>
                        <button type="button" onClick={() => navigate("/candidate/applications")} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                            View my applications
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-[applyFadeIn_450ms_ease-out]">
            <style>{`
                @keyframes applyFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .apply-motion, [class*="animate-[applyFadeIn"] { animation: none !important; }
                }
            `}</style>

            {/* Compact page heading */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <button type="button" onClick={backToJob} className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-indigo-600">
                        <ArrowLeft size={15} /> Back to job details
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Apply for this job</h1>
                    <p className="mt-1 text-sm text-slate-500">Review your details and submit your application.</p>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 sm:flex">
                    <CheckCircle2 size={15} /> Application form
                </div>
            </div>

            {/* Main content fills the available layout width */}
            <div className="grid w-full grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.8fr)]">
                {/* Job summary panel */}
                <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-5 text-white sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-sm backdrop-blur">
                                <BriefcaseBusiness size={24} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-indigo-100">Applying to</p>
                                <p className="mt-0.5 truncate text-sm font-semibold">{selectedJob.company}</p>
                            </div>
                        </div>
                        <h2 className="mt-5 text-xl font-bold leading-snug sm:text-2xl">{selectedJob.title}</h2>
                        <p className="mt-2 flex items-start gap-2 text-sm text-indigo-100">
                            <MapPin size={16} className="mt-0.5 shrink-0" />
                            <span>{selectedJob.location || "Location not specified"}</span>
                        </p>
                    </div>
                    <div className="space-y-4 p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Job overview</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <BriefcaseBusiness size={17} className="text-indigo-600" />
                                <p className="mt-2 text-[11px] font-medium text-slate-500">Employment</p>
                                <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">{selectedJob.employmentType || "Not specified"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <Laptop size={17} className="text-indigo-600" />
                                <p className="mt-2 text-[11px] font-medium text-slate-500">Work mode</p>
                                <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">{selectedJob.workMode || "Not specified"}</p>
                            </div>
                            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <Clock3 size={17} className="text-indigo-600" />
                                <p className="mt-2 text-[11px] font-medium text-slate-500">Experience</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-800">{selectedJob.experience}</p>
                            </div>
                            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <Users size={17} className="text-indigo-600" />
                                <p className="mt-2 text-[11px] font-medium text-slate-500">Openings remaining</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-800">{Number(selectedJob.remainingOpenings)}</p>
                            </div>
                        </div>
                        {!isJobOpen && (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                                This job is no longer accepting applications.
                            </p>
                        )}
                        {selectedJob.description && (
                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">About the role</p>
                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{selectedJob.description}</p>
                            </div>
                        )}
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5">
                            <p className="text-sm font-semibold text-indigo-900">Before you submit</p>
                            <p className="mt-1 text-xs leading-5 text-indigo-800">Check your contact details and make sure your latest resume is attached.</p>
                        </div>
                    </div>
                </aside>

                {/* Application form */}
                <form onSubmit={handleSubmit} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Your application</h2>
                            <p className="mt-0.5 text-xs text-slate-500">Fields marked <span className="text-rose-500">*</span> are required.</p>
                        </div>
                        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
                            <FileText size={20} />
                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">1</span>
                                <h3 className="text-sm font-bold text-slate-800">Contact information</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="min-w-0">
                                    <label htmlFor="candidateName" className="mb-1.5 block text-xs font-semibold text-slate-700">Full name <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input id="candidateName" type="text" value={candidateName} onChange={(event) => setCandidateName(event.target.value)} placeholder="Your full name" required className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <label htmlFor="candidateEmail" className="mb-1.5 block text-xs font-semibold text-slate-700">Account email <span className="ml-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">READ ONLY</span></label>
                                    <div className="relative">
                                        <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input id="candidateEmail" type="email" value={email} readOnly aria-readonly="true" title="Your email is linked to your account and cannot be changed here." placeholder="Email linked to your account" className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-500 outline-none" />
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400">This email is linked to your account and cannot be edited here.</p>
                                </div>
                                <div className="min-w-0 md:col-span-2">
                                    <label htmlFor="candidatePhone" className="mb-1.5 block text-xs font-semibold text-slate-700">Phone number <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input id="candidatePhone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Your contact number" required className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">2</span>
                                <h3 className="text-sm font-bold text-slate-800">Resume</h3>
                                {!existingResume && !resume && <span className="text-xs font-semibold text-rose-500">Required</span>}
                            </div>

                            {existingResume && !resume && (
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700"><FileText size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-emerald-900">Saved resume</p>
                                            <p className="max-w-full break-all text-xs text-emerald-800">{existingResume.split(/[\\/]/).pop()}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-emerald-700">Will be submitted</span>
                                </div>
                            )}

                            <input id="resumeUpload" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="sr-only" />
                            <label htmlFor="resumeUpload" className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105 group-hover:ring-indigo-200"><Upload size={20} /></span>
                                <span className="mt-2.5 text-sm font-semibold text-slate-800">{resume ? "Choose a different resume" : existingResume ? "Upload a newer resume (optional)" : "Click to upload your resume"}</span>
                                <span className="mt-1 text-xs text-slate-500">PDF, DOC or DOCX · Maximum 5 MB</span>
                                {resume && <span className="mt-2 inline-flex max-w-full items-center gap-1.5 break-all rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700"><FileText size={14} />{resume.name}</span>}
                            </label>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">3</span>
                                <h3 className="text-sm font-bold text-slate-800">Cover letter</h3>
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">OPTIONAL</span>
                            </div>
                            <p className="mb-3 text-xs leading-5 text-slate-500">Briefly explain why you're interested in this role and which skills make you a good fit.</p>
                            <textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} rows={4} maxLength={3000} placeholder="Hello, I'm interested in this position because..." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                            <div className="mt-1 flex justify-between gap-3 text-[11px] text-slate-400">
                                <span>Keep it concise and specific to this job.</span>
                                <span className="shrink-0 tabular-nums">{coverLetter.length}/3000</span>
                            </div>
                        </section>

                        {error && (
                            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                                <span className="mt-0.5 font-bold">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <button type="button" onClick={backToJob} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                                <ArrowLeft size={16} /> Cancel
                            </button>
                            <button type="submit" disabled={submitting || !isJobOpen} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                                {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Submitting application...</> : !isJobOpen ? "Applications closed" : <><Send size={16} /> Submit application</>}
                            </button>
                        </div>
                        <p className="text-center text-[11px] leading-5 text-slate-400">By submitting, you confirm that the information provided is accurate.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyJob;
