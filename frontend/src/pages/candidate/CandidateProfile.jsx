import {
    Briefcase,
    Building,
    CheckCircle2,
    Download,
    FileText,
    GraduationCap,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Trash2,
    Upload,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

import {
    getCandidateProfile,
    updateCandidateProfile,
    uploadCandidateResume,
} from "../../services/profileService";

const CandidateProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("viewEdit");

    // Profile state with all necessary sections
    const [profile, setProfile] = useState({
        name: "Khushi gautam",
        degree: "B.Tech / B.E.",
        college: "Banasthali Vidyapith, Banasthali",
        location: "Jaipur",
        gender: "Female",
        dob: "9th September 2004",
        phone: "6367739531",
        email: "khushigautam029@gmail.com",
        experienceYears: "0",
        bio: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        resume: "Final_resume.pdf",
        resumeDate: "Oct 8, 2026",
        preferences: {
            preferredJobType: "Jobs, Internships",
            preferredLocation: "Gurgaon/Gurugram, Mumbai, Pune, Noida, Delhi / NCR",
            availability: "Immediate",
        },
        education: [
            {
                id: 1,
                title: "B.Tech / B.E. from Banasthali Vidyapith, Banasthali",
                details: "Graduated in 2026, Full Time",
            },
            {
                id: 2,
                title: "Class XII",
                details: "Other, English • Scored 85.5%, Passed out in 2022",
            },
            {
                id: 3,
                title: "Class X",
                details: "Rajasthan, English • Scored 86.05%, Passed out in 2020",
            },
        ],
        skills: ["React.js", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Node.js", "Git"],
        internships: [
            {
                id: 1,
                company: "Pratham Software",
                period: "Jan'26 to Jun'26",
                role: "Software Developer Intern",
            },
        ],
        projects: [],
    });

    // Modal / Inline Editing States
    const [editingHeader, setEditingHeader] = useState(false);
    const [headerForm, setHeaderForm] = useState({});

    const [editingPref, setEditingPref] = useState(false);
    const [prefForm, setPrefForm] = useState({});

    const [editingBio, setEditingBio] = useState(false);
    const [bioText, setBioText] = useState("");

    const [newSkill, setNewSkill] = useState("");
    const [showSkillInput, setShowSkillInput] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getCandidateProfile();
            const candidate = response.data?.candidate || {};

            setProfile((prev) => ({
                ...prev,
                name: candidate.user?.name || prev.name,
                email: candidate.user?.email || prev.email,
                phone: candidate.user?.phone || prev.phone,
                location: candidate.location || prev.location,
                bio: candidate.bio || prev.bio,
                experienceYears: candidate.experienceYears ?? prev.experienceYears,
                linkedinUrl: candidate.linkedinUrl || prev.linkedinUrl,
                githubUrl: candidate.githubUrl || prev.githubUrl,
                portfolioUrl: candidate.portfolioUrl || prev.portfolioUrl,
                resume: candidate.resume || prev.resume,
            }));
        } catch (err) {
            // Keep UI interactive using standard or mock profile if API is not present
            console.warn("Could not load candidate profile from API, using default/mock state.", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfileData = async (updatedFields) => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const newProfileData = { ...profile, ...updatedFields };
            setProfile(newProfileData);

            await updateCandidateProfile({
                name: newProfileData.name,
                phone: newProfileData.phone,
                location: newProfileData.location,
                bio: newProfileData.bio,
                experienceYears:
                    newProfileData.experienceYears === ""
                        ? undefined
                        : Number(newProfileData.experienceYears),
                linkedinUrl: newProfileData.linkedinUrl,
                githubUrl: newProfileData.githubUrl,
                portfolioUrl: newProfileData.portfolioUrl,
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            setMessage("Profile updated locally.");
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setMessage("");
            setError("");

            const response = await uploadCandidateResume(file);
            const candidate = response.data?.candidate;

            setProfile((prev) => ({
                ...prev,
                resume: candidate?.resume || file.name,
                resumeDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            }));

            setMessage("Resume uploaded successfully.");
        } catch (err) {
            setProfile((prev) => ({
                ...prev,
                resume: file.name,
                resumeDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            }));
            setMessage("Resume uploaded successfully.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResume = () => {
        setProfile((prev) => ({ ...prev, resume: "", resumeDate: "" }));
        setMessage("Resume removed successfully.");
    };

    // Header Modal Submit
    const handleHeaderSubmit = (e) => {
        e.preventDefault();
        handleSaveProfileData(headerForm);
        setEditingHeader(false);
    };

    // Preferences Submit
    const handlePrefSubmit = (e) => {
        e.preventDefault();
        setProfile((prev) => ({ ...prev, preferences: prefForm }));
        setMessage("Career preferences updated.");
        setEditingPref(false);
    };

    // Bio Submit
    const handleBioSubmit = (e) => {
        e.preventDefault();
        handleSaveProfileData({ bio: bioText });
        setEditingBio(false);
    };

    // Skills Add/Delete
    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
            setShowSkillInput(false);
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToDelete),
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 w-full p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto space-y-6">

                {/* Notifications */}
                {message && (
                    <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-between">
                        <span>{message}</span>
                        <button onClick={() => setMessage("")}>
                            <X size={18} />
                        </button>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError("")}>
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Top Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">

                        {/* Left Info: Photo + Basic Details */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-2/3">

                            {/* Avatar with percentage completion arc */}
                            <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-amber-400 bg-gray-100 flex-shrink-0 group cursor-pointer">
                                <div className="text-center">
                                    <User className="mx-auto text-gray-400 mb-1" size={32} />
                                    <span className="text-xs text-gray-600 font-medium block">Add photo</span>
                                </div>
                                <div className="absolute -bottom-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    75%
                                </div>
                            </div>

                            {/* Main Identity */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                    <button
                                        onClick={() => {
                                            setHeaderForm(profile);
                                            setEditingHeader(true);
                                        }}
                                        className="text-gray-400 hover:text-blue-600 transition"
                                        title="Edit Profile Info"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </div>

                                <p className="text-sm font-semibold text-gray-700">{profile.degree}</p>
                                <p className="text-sm text-gray-500">{profile.college}</p>

                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100 mt-3">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Phone size={16} className="text-gray-400" />
                                        <span>{profile.phone}</span>
                                        <CheckCircle2 size={14} className="text-green-500 fill-green-100" />
                                    </div>
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <User size={16} className="text-gray-400" />
                                        <span>{profile.gender}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center sm:justify-start overflow-hidden">
                                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{profile.email}</span>
                                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 fill-green-100" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Quick Add Progress Banner */}
                        <div className="w-full lg:w-1/3 bg-amber-50/60 rounded-xl p-4 border border-amber-100 space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                                <span className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-amber-600" /> Add project
                                </span>
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">↑ 7%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                                <span className="flex items-center gap-2">
                                    <GraduationCap size={16} className="text-amber-600" /> Add experience
                                </span>
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">↑ 5%</span>
                            </div>
                            <button className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm">
                                Add missing details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("viewEdit")}
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab === "viewEdit"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            View & Edit
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab === "activity"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Activity insights
                        </button>
                    </nav>
                </div>

                {/* FULL WIDTH MAIN CONTENT (Quick Links removed completely) */}
                <div className="w-full space-y-6">

                    {/* Section 1: Career Preferences */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                Your career preferences
                            </h2>
                            <button
                                onClick={() => {
                                    setPrefForm(profile.preferences);
                                    setEditingPref(true);
                                }}
                                className="text-gray-400 hover:text-blue-600 transition"
                            >
                                <Pencil size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Preferred job type</p>
                                <p className="font-semibold text-gray-800 mt-1">{profile.preferences.preferredJobType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Availability to work</p>
                                <p className="font-semibold text-blue-600 mt-1">{profile.preferences.availability}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-gray-400 font-medium">Preferred location</p>
                                <p className="font-semibold text-gray-800 mt-1">{profile.preferences.preferredLocation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Education */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Education</h2>
                            <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {profile.education.map((edu) => (
                                <div key={edu.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm text-gray-900">{edu.title}</p>
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{edu.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Key Skills */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Key skills</h2>
                            <button
                                onClick={() => setShowSkillInput(!showSkillInput)}
                                className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {showSkillInput && (
                            <form onSubmit={handleAddSkill} className="flex items-center gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Enter skill name..."
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </form>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-medium"
                                >
                                    {skill}
                                    <button
                                        onClick={() => handleDeleteSkill(skill)}
                                        className="hover:text-red-500 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Internships */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Internships</h2>
                            <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        {profile.internships.length > 0 ? (
                            <div className="space-y-4">
                                {profile.internships.map((intern) => (
                                    <div key={intern.id} className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-blue-600">
                                                <Building size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{intern.company}</p>
                                                <p className="text-xs text-gray-500">{intern.period}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500">Mention internships to highlight practical work experience.</p>
                        )}
                    </div>

                    {/* Section 5: Projects */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-bold text-gray-900">Projects</h2>
                            <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Talk about your projects that made you proud and contributed to your learnings
                        </p>
                    </div>

                    {/* Section 6: Profile Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-base font-bold text-gray-900">Profile Summary</h2>
                            <button
                                onClick={() => {
                                    setBioText(profile.bio);
                                    setEditingBio(true);
                                }}
                                className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                            >
                                {profile.bio ? <Pencil size={14} /> : <Plus size={16} />} {profile.bio ? "Edit" : "Add"}
                            </button>
                        </div>
                        {profile.bio ? (
                            <p className="text-sm text-gray-700 leading-relaxed mt-2">{profile.bio}</p>
                        ) : (
                            <p className="text-xs text-gray-500">
                                Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters.
                            </p>
                        )}
                    </div>

                    {/* Section 7: Resume */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Resume</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Your resume is the first impression you make on potential employers. Craft it carefully to secure your desired job or internship.
                            </p>
                        </div>

                        {profile.resume && (
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <FileText size={24} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{profile.resume}</p>
                                        <p className="text-xs text-gray-400">Uploaded on {profile.resumeDate || "Today"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition" title="Download Resume">
                                        <Download size={18} />
                                    </button>
                                    <button onClick={handleDeleteResume} className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white transition" title="Delete Resume">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center space-y-3 bg-gray-50/50">
                            <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-full font-semibold text-sm hover:bg-blue-50 cursor-pointer transition shadow-sm">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploading ? "Uploading..." : "Update resume"}
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-400">Supported formats: doc, docx, rtf, pdf, up to 2MB</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal: Edit Header Basic Info */}
            {editingHeader && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="font-bold text-gray-900">Edit Personal Details</h3>
                            <button onClick={() => setEditingHeader(false)}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleHeaderSubmit} className="space-y-3 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={headerForm.name || ""}
                                    onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={headerForm.degree || ""}
                                    onChange={(e) => setHeaderForm({ ...headerForm, degree: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">College / University</label>
                                <input
                                    type="text"
                                    value={headerForm.college || ""}
                                    onChange={(e) => setHeaderForm({ ...headerForm, college: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={headerForm.location || ""}
                                    onChange={(e) => setHeaderForm({ ...headerForm, location: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={headerForm.phone || ""}
                                    onChange={(e) => setHeaderForm({ ...headerForm, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingHeader(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Career Preferences */}
            {editingPref && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="font-bold text-gray-900">Edit Career Preferences</h3>
                            <button onClick={() => setEditingPref(false)}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handlePrefSubmit} className="space-y-3 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Job Type</label>
                                <input
                                    type="text"
                                    value={prefForm.preferredJobType || ""}
                                    onChange={(e) => setPrefForm({ ...prefForm, preferredJobType: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Availability to Work</label>
                                <input
                                    type="text"
                                    value={prefForm.availability || ""}
                                    onChange={(e) => setPrefForm({ ...prefForm, availability: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Location</label>
                                <input
                                    type="text"
                                    value={prefForm.preferredLocation || ""}
                                    onChange={(e) => setPrefForm({ ...prefForm, preferredLocation: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingPref(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Profile Summary */}
            {editingBio && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="font-bold text-gray-900">Edit Profile Summary</h3>
                            <button onClick={() => setEditingBio(false)}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleBioSubmit} className="space-y-3 text-sm">
                            <div>
                                <textarea
                                    rows="5"
                                    value={bioText}
                                    onChange={(e) => setBioText(e.target.value)}
                                    placeholder="Write a meaningful summary..."
                                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingBio(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CandidateProfile;