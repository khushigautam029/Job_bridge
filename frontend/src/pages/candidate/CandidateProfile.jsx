import {
    FileText,
    Globe,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Upload,
    User,
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

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        experienceYears: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        resume: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {
            setLoading(true);
            setError("");

            const response =
                await getCandidateProfile();

            const candidate =
                response.data.candidate;

            setProfile({
                name:
                    candidate.user?.name || "",

                email:
                    candidate.user?.email || "",

                phone:
                    candidate.user?.phone || "",

                location:
                    candidate.location || "",

                bio:
                    candidate.bio || "",

                experienceYears:
                    candidate.experienceYears ?? "",

                linkedinUrl:
                    candidate.linkedinUrl || "",

                githubUrl:
                    candidate.githubUrl || "",

                portfolioUrl:
                    candidate.portfolioUrl || "",

                resume:
                    candidate.resume || "",
            });

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSave = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setMessage("");
            setError("");

            const response =
                await updateCandidateProfile({
                    name: profile.name,
                    phone: profile.phone,
                    location: profile.location,
                    bio: profile.bio,
                    experienceYears:
                        profile.experienceYears === ""
                            ? undefined
                            : Number(
                                profile.experienceYears
                            ),
                    linkedinUrl:
                        profile.linkedinUrl,

                    githubUrl:
                        profile.githubUrl,

                    portfolioUrl:
                        profile.portfolioUrl,
                });

            const candidate =
                response.data.candidate;

            setProfile((previous) => ({
                ...previous,
                name:
                    candidate.user?.name ||
                    previous.name,

                phone:
                    candidate.user?.phone ||
                    "",

                email:
                    candidate.user?.email ||
                    previous.email,
            }));

            setMessage(
                "Profile updated successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {
            setSaving(false);
        }
    };


    const handleResumeUpload = async (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        try {

            setUploading(true);
            setMessage("");
            setError("");

            const response =
                await uploadCandidateResume(
                    file
                );

            const candidate =
                response.data.candidate;

            setProfile((previous) => ({
                ...previous,
                resume:
                    candidate.resume || "",
            }));

            setMessage(
                "Resume uploaded successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to upload resume"
            );

        } finally {
            setUploading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2
                    className="animate-spin"
                    size={30}
                />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">

            <div className="max-w-5xl mx-auto">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Header */}

                    <div className="px-6 py-6 border-b border-gray-200">

                        <div className="flex items-center gap-4">

                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                                <User
                                    size={30}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">
                                    Candidate Profile
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Keep your professional profile up to date.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Messages */}

                    {(message || error) && (
                        <div className="px-6 pt-5">

                            {message && (
                                <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
                                    {error}
                                </div>
                            )}

                        </div>
                    )}


                    <form
                        onSubmit={handleSave}
                        className="p-6 space-y-8"
                    >

                        {/* Basic Information */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <InputField
                                    label="Full Name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    icon={<User size={18} />}
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    icon={<Mail size={18} />}
                                />

                                <InputField
                                    label="Phone"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    icon={<Phone size={18} />}
                                />

                                <InputField
                                    label="Location"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                    icon={<MapPin size={18} />}
                                />

                            </div>

                        </section>


                        {/* Professional Information */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Professional Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="99.9"
                                        step="0.1"
                                        name="experienceYears"
                                        value={profile.experienceYears}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                            </div>

                            <div className="mt-5">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Summary
                                </label>

                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows="5"
                                    maxLength="2000"
                                    placeholder="Write a short professional summary..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />

                            </div>

                        </section>


                        {/* Skills */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Skills
                            </h2>

                            <p className="text-sm text-gray-500">
                                Skills will be connected to your existing Skill and CandidateSkill tables.
                            </p>

                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                                Skill management will be added using your existing
                                <strong> Skill </strong>
                                and
                                <strong> CandidateSkill </strong>
                                relationships.
                            </div>

                        </section>


                        {/* Social Links */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Professional Links
                            </h2>

                            <div className="space-y-5">

                                <InputField
                                    label="LinkedIn URL"
                                    name="linkedinUrl"
                                    value={profile.linkedinUrl}
                                    onChange={handleChange}
                                    icon={<Globe size={18} />}
                                    placeholder="https://linkedin.com/in/your-profile"
                                />

                                <InputField
                                    label="GitHub URL"
                                    name="githubUrl"
                                    value={profile.githubUrl}
                                    onChange={handleChange}
                                    icon={<Globe size={18} />}
                                    placeholder="https://github.com/your-username"
                                />

                                <InputField
                                    label="Portfolio URL"
                                    name="portfolioUrl"
                                    value={profile.portfolioUrl}
                                    onChange={handleChange}
                                    icon={<Globe size={18} />}
                                    placeholder="https://yourportfolio.com"
                                />

                            </div>

                        </section>


                        {/* Resume */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Resume
                            </h2>

                            <div className="border border-gray-200 rounded-xl p-5">

                                <div className="flex items-center gap-3 mb-4">

                                    <FileText
                                        className="text-blue-600"
                                        size={24}
                                    />

                                    <div>

                                        <p className="font-medium text-gray-900">
                                            Upload your resume
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Keep your resume updated for recruiters.
                                        </p>

                                    </div>

                                </div>


                                {profile.resume && (
                                    <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                        Resume uploaded successfully.
                                    </div>
                                )}


                                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800">

                                    {uploading ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload
                                            size={18}
                                        />
                                    )}

                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Resume"
                                    }

                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />

                                </label>

                            </div>

                        </section>


                        {/* Save */}

                        <div className="flex justify-end pt-2">

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
                            >

                                {saving ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={18} />
                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Profile"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};


const InputField = ({
    label,
    name,
    value,
    onChange,
    icon,
    disabled = false,
    placeholder = "",
}) => {

    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="relative">

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>

                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                />

            </div>

        </div>
    );
};


export default CandidateProfile;