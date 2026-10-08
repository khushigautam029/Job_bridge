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
    X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import {
    addCandidateSkill,
    deleteCandidateProfileImage,
    deleteCandidateResume,
    deleteCandidateSkill,
    getCandidateEducation,
    getCandidateExperiences,
    getCandidateProfile,
    getCandidateProjects,
    getCandidateSkills,
    updateCandidateProfile,
    uploadCandidateProfileImage,
    uploadCandidateResume,
} from "../../services/profileService";
import { getSkills as getSkillCatalog } from "../../services/skillService";


const CandidateProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [activeTab, setActiveTab] = useState("viewEdit");

    const profileImageInputRef = useRef(null);


    // =====================================================
    // PROFILE STATE
    // =====================================================

    const [profile, setProfile] = useState({
        name: "",
        degree: "",
        college: "",
        location: "",
        gender: "",
        dob: "",
        phone: "",
        email: "",
        experienceYears: "",
        bio: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: "",

        resume: "",
        resumeDate: "",

        profileImage: "",

        profileCompletionPercentage: 0,

        preferences: {
            preferredJobType: [],
            preferredLocation: [],
            availability: "",
        },

        education: [],
        skills: [],
        internships: [],
        projects: [],
    });


    // =====================================================
    // EDITING STATES
    // =====================================================

    const [editingHeader, setEditingHeader] =
        useState(false);

    const [headerForm, setHeaderForm] =
        useState({});


    const [editingPref, setEditingPref] =
        useState(false);

    const [prefForm, setPrefForm] =
        useState({
            preferredJobType: [],
            preferredLocation: [],
            availability: "",
        });


    const [editingBio, setEditingBio] =
        useState(false);

    const [bioText, setBioText] =
        useState("");


    const [newSkill, setNewSkill] =
        useState("");
    const [skillOptions, setSkillOptions] = useState([]);

    const [showSkillInput, setShowSkillInput] =
        useState(false);


    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const [response, skillsResponse, educationResponse, experienceResponse, projectsResponse, catalog] = await Promise.all([
                getCandidateProfile(),
                getCandidateSkills(),
                getCandidateEducation(),
                getCandidateExperiences(),
                getCandidateProjects(),
                getSkillCatalog(),
            ]);
            setSkillOptions(catalog);

            const candidate = response.data?.candidate || {};
            const unwrap = (result, key) => result?.data?.[key] || [];

            setProfile((prev) => ({
                ...prev,

                // -----------------------------
                // USER INFORMATION
                // -----------------------------

                name:
                    candidate.user?.name ||
                    "",

                email:
                    candidate.user?.email ||
                    "",

                phone:
                    candidate.user?.phone ||
                    "",


                // -----------------------------
                // CANDIDATE PROFILE
                // -----------------------------

                degree:
                    candidate.degree ||
                    "",

                college:
                    candidate.college ||
                    "",

                location:
                    candidate.location ||
                    "",

                gender:
                    candidate.gender ||
                    "",

                dob:
                    candidate.dob ||
                    "",

                experienceYears:
                    candidate.experienceYears ??
                    "",

                bio:
                    candidate.bio ||
                    "",

                linkedinUrl:
                    candidate.linkedinUrl ||
                    "",

                githubUrl:
                    candidate.githubUrl ||
                    "",

                portfolioUrl:
                    candidate.portfolioUrl ||
                    "",


                // -----------------------------
                // RESUME
                // -----------------------------

                resume:
                    candidate.resume ||
                    "",
                resumeDate: candidate.updatedAt
                    ? new Date(candidate.updatedAt).toLocaleDateString()
                    : "",


                // -----------------------------
                // PROFILE IMAGE
                // -----------------------------

                profileImage:
                    candidate.profileImage ||
                    "",


                // -----------------------------
                // PROFILE COMPLETION
                // -----------------------------

                profileCompletionPercentage:
                    candidate.profileCompletionPercentage ??
                    0,


                // -----------------------------
                // CAREER PREFERENCES
                // -----------------------------

                preferences: {
                    preferredJobType:
                        Array.isArray(
                            candidate.preferredJobType
                        )
                            ? candidate.preferredJobType
                            : [],

                    preferredLocation:
                        Array.isArray(
                            candidate.preferredLocation
                        )
                            ? candidate.preferredLocation
                            : [],

                    availability:
                        candidate.availability ||
                        "",
                },
                skills: unwrap(skillsResponse, "skills"),
                education: unwrap(educationResponse, "educations").map((edu) => ({
                    ...edu,
                    title: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} from ${edu.institution}`,
                    details: [edu.location, edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate || edu.startDate, edu.grade].filter(Boolean).join(" • "),
                })),
                internships: unwrap(experienceResponse, "experiences").map((item) => ({
                    ...item,
                    company: item.companyName,
                    period: [item.startDate, item.currentlyWorking ? "Present" : item.endDate].filter(Boolean).join(" to "),
                    role: item.jobTitle,
                })),
                projects: unwrap(projectsResponse, "projects"),
            }));
        } catch (err) {
            console.error(
                "Failed to load candidate profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load candidate profile."
            );
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleSaveProfileData = async (
        updatedFields
    ) => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const newProfileData = {
                ...profile,
                ...updatedFields,
            };


            const payload = {
                name: newProfileData.name,

                phone:
                    newProfileData.phone,

                location:
                    newProfileData.location,

                degree:
                    newProfileData.degree,

                college:
                    newProfileData.college,

                gender:
                    newProfileData.gender,

                dob:
                    newProfileData.dob ||
                    undefined,

                experienceYears:
                    newProfileData.experienceYears === ""
                        ? undefined
                        : Number(
                            newProfileData.experienceYears
                        ),

                bio:
                    newProfileData.bio,

                linkedinUrl:
                    newProfileData.linkedinUrl,

                githubUrl:
                    newProfileData.githubUrl,

                portfolioUrl:
                    newProfileData.portfolioUrl,

                preferredJobType:
                    newProfileData.preferences
                        ?.preferredJobType || [],

                preferredLocation:
                    newProfileData.preferences
                        ?.preferredLocation || [],

                availability:
                    newProfileData.preferences
                        ?.availability || "",
            };


            const response =
                await updateCandidateProfile(
                    payload
                );


            const updatedCandidate =
                response.data?.candidate;


            setProfile((prev) => ({
                ...prev,

                ...newProfileData,

                ...(updatedCandidate || {}),
            }));


            setMessage(
                "Profile updated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update profile:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };


    // =====================================================
    // RESUME UPLOAD
    // =====================================================

    const handleResumeUpload = async (e) => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        try {
            setUploading(true);
            setMessage("");
            setError("");


            const response =
                await uploadCandidateResume(
                    file
                );


            const candidate =
                response.data?.candidate;


            setProfile((prev) => ({
                ...prev,

                resume:
                    candidate?.resume ||
                    file.name,

                resumeDate:
                    new Date().toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }
                    ),
            }));


            setMessage(
                "Resume uploaded successfully."
            );
        } catch (err) {
            console.error(
                "Failed to upload resume:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to upload resume."
            );
        } finally {
            setUploading(false);

            // Allow selecting the same file again
            e.target.value = "";
        }
    };


    // =====================================================
    // RESUME DELETE
    // =====================================================

    const handleDeleteResume = async () => {
        try {
            setUploading(true);
            setMessage("");
            setError("");


            await deleteCandidateResume();


            setProfile((prev) => ({
                ...prev,

                resume: "",

                resumeDate: "",
            }));


            setMessage(
                "Resume removed successfully."
            );
        } catch (err) {
            console.error(
                "Failed to delete resume:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete resume."
            );
        } finally {
            setUploading(false);
        }
    };


    // =====================================================
    // PROFILE IMAGE UPLOAD
    // =====================================================

    const handleProfileImageUpload = async (
        e
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        try {
            setUploadingImage(true);
            setMessage("");
            setError("");


            const response =
                await uploadCandidateProfileImage(
                    file
                );


            const imagePath =
                response.data?.profileImage;


            setProfile((prev) => ({
                ...prev,

                profileImage:
                    imagePath || "",
            }));


            setMessage(
                "Profile image uploaded successfully."
            );
        } catch (err) {
            console.error(
                "Failed to upload profile image:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to upload profile image."
            );
        } finally {
            setUploadingImage(false);

            e.target.value = "";
        }
    };


    // =====================================================
    // PROFILE IMAGE DELETE
    // =====================================================

    const handleDeleteProfileImage =
        async () => {
            try {
                setUploadingImage(true);
                setMessage("");
                setError("");


                await deleteCandidateProfileImage();


                setProfile((prev) => ({
                    ...prev,

                    profileImage: "",
                }));


                setMessage(
                    "Profile image removed successfully."
                );
            } catch (err) {
                console.error(
                    "Failed to delete profile image:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to delete profile image."
                );
            } finally {
                setUploadingImage(false);
            }
        };


    // =====================================================
    // HEADER FORM
    // =====================================================

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();

        await handleSaveProfileData(
            headerForm
        );

        setEditingHeader(false);
    };


    // =====================================================
    // PREFERENCES
    // =====================================================

    const handlePrefSubmit = async (e) => {
        e.preventDefault();


        await handleSaveProfileData({
            preferences: {
                preferredJobType:
                    Array.isArray(
                        prefForm.preferredJobType
                    )
                        ? prefForm.preferredJobType
                        : [],

                preferredLocation:
                    Array.isArray(
                        prefForm.preferredLocation
                    )
                        ? prefForm.preferredLocation
                        : [],

                availability:
                    prefForm.availability ||
                    "",
            },
        });


        setEditingPref(false);
    };


    // =====================================================
    // BIO
    // =====================================================

    const handleBioSubmit = async (e) => {
        e.preventDefault();

        await handleSaveProfileData({
            bio: bioText,
        });

        setEditingBio(false);
    };


    // =====================================================
    // SKILLS
    // NOTE:
    // Backend integration will be done next.
    // =====================================================

    const handleAddSkill = async (e) => {
        e.preventDefault();
        const requestedName = newSkill.trim();
        if (!requestedName) return;
        try {
            setSaving(true);
            setError("");
            const match = skillOptions.find((item) => item.name.toLowerCase() === requestedName.toLowerCase());
            if (!match) {
                setError("Choose a skill from the supported skill catalog.");
                return;
            }
            if (profile.skills.some((item) => item.id === match.id)) {
                setError("This skill is already in your profile.");
                return;
            }
            const response = await addCandidateSkill(match.id);
            setProfile((prev) => ({ ...prev, skills: [...prev.skills, response.data?.skill || match] }));
            setNewSkill("");
            setShowSkillInput(false);
            setMessage("Skill added successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add skill.");
        } finally {
            setSaving(false);
        }
    };


    const handleDeleteSkill = async (skillToDelete) => {
        try {
            await deleteCandidateSkill(skillToDelete.id);
            setProfile((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill.id !== skillToDelete.id) }));
            setMessage("Skill removed successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove skill.");
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2
                    className="animate-spin text-blue-600"
                    size={36}
                />
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-white text-gray-800 w-full p-4 md:p-8">

            <div className="w-full max-w-7xl mx-auto space-y-6">


                {/* =====================================================
                    NOTIFICATIONS
                ===================================================== */}

                {message && (
                    <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-between">

                        <span>
                            {message}
                        </span>

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}


                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}


                {/* =====================================================
                    TOP PROFILE CARD
                ===================================================== */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">

                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">


                        {/* LEFT SIDE */}

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-2/3">


                            {/* PROFILE IMAGE */}

                            <div className="relative">

                                <div
                                    onClick={() =>
                                        profileImageInputRef.current?.click()
                                    }
                                    className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-amber-400 bg-gray-100 flex-shrink-0 group cursor-pointer overflow-hidden"
                                >

                                    {profile.profileImage ? (
                                        <img
                                            src={
                                                profile.profileImage.startsWith(
                                                    "http"
                                                )
                                                    ? profile.profileImage
                                                    : `${
                                                        import.meta.env.VITE_API_URL?.replace(
                                                            /\/api$/,
                                                            ""
                                                        ) ||
                                                        "http://localhost:5001"
                                                    }${profile.profileImage}`
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <User
                                                className="mx-auto text-gray-400 mb-1"
                                                size={32}
                                            />

                                            <span className="text-xs text-gray-600 font-medium block">
                                                {uploadingImage
                                                    ? "Uploading..."
                                                    : "Add photo"}
                                            </span>
                                        </div>
                                    )}

                                </div>


                                <input
                                    ref={
                                        profileImageInputRef
                                    }
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={
                                        handleProfileImageUpload
                                    }
                                    className="hidden"
                                />


                                {/* DELETE IMAGE */}

                                {profile.profileImage && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleDeleteProfileImage
                                        }
                                        disabled={
                                            uploadingImage
                                        }
                                        className="absolute -right-1 -top-1 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-red-600 shadow-sm"
                                        title="Delete profile image"
                                    >
                                        {uploadingImage ? (
                                            <Loader2
                                                size={13}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <X
                                                size={13}
                                            />
                                        )}
                                    </button>
                                )}


                                {/* COMPLETION */}

                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {profile.profileCompletionPercentage}%
                                </div>

                            </div>


                            {/* MAIN IDENTITY */}

                            <div className="flex-1 text-center sm:text-left space-y-2">

                                <div className="flex items-center justify-center sm:justify-start gap-2">

                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {profile.name ||
                                            "Candidate"}
                                    </h1>

                                    <button
                                        onClick={() => {
                                            setHeaderForm(
                                                profile
                                            );

                                            setEditingHeader(
                                                true
                                            );
                                        }}
                                        className="text-gray-400 hover:text-blue-600 transition"
                                        title="Edit Profile Info"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                </div>


                                <p className="text-sm font-semibold text-gray-700">
                                    {profile.degree ||
                                        "Degree not added"}
                                </p>


                                <p className="text-sm text-gray-500">
                                    {profile.college ||
                                        "College not added"}
                                </p>


                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100 mt-3">


                                    <div className="flex items-center gap-2 justify-center sm:justify-start">

                                        <MapPin
                                            size={16}
                                            className="text-gray-400"
                                        />

                                        <span>
                                            {profile.location ||
                                                "Location not added"}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 justify-center sm:justify-start">

                                        <Phone
                                            size={16}
                                            className="text-gray-400"
                                        />

                                        <span>
                                            {profile.phone ||
                                                "Phone not added"}
                                        </span>

                                        {profile.phone && (
                                            <CheckCircle2
                                                size={14}
                                                className="text-green-500 fill-green-100"
                                            />
                                        )}

                                    </div>


                                    <div className="flex items-center gap-2 justify-center sm:justify-start">

                                        <User
                                            size={16}
                                            className="text-gray-400"
                                        />

                                        <span>
                                            {profile.gender ||
                                                "Gender not added"}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 justify-center sm:justify-start overflow-hidden">

                                        <Mail
                                            size={16}
                                            className="text-gray-400 flex-shrink-0"
                                        />

                                        <span className="truncate">
                                            {profile.email ||
                                                "Email not available"}
                                        </span>

                                        {profile.email && (
                                            <CheckCircle2
                                                size={14}
                                                className="text-green-500 flex-shrink-0 fill-green-100"
                                            />
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* QUICK ADD */}

                        <div className="w-full lg:w-1/3 bg-amber-50/60 rounded-xl p-4 border border-amber-100 space-y-3">

                            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">

                                <span className="flex items-center gap-2">

                                    <Briefcase
                                        size={16}
                                        className="text-amber-600"
                                    />

                                    Add project

                                </span>

                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                    ↑ 7%
                                </span>

                            </div>


                            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">

                                <span className="flex items-center gap-2">

                                    <GraduationCap
                                        size={16}
                                        className="text-amber-600"
                                    />

                                    Add experience

                                </span>

                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                    ↑ 5%
                                </span>

                            </div>


                            <button className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm">
                                Add missing details
                            </button>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    TABS
                ===================================================== */}

                <div className="border-b border-gray-200">

                    <nav className="flex gap-8">

                        <button
                            onClick={() =>
                                setActiveTab(
                                    "viewEdit"
                                )
                            }
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab ===
                                "viewEdit"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            View & Edit
                        </button>


                        <button
                            onClick={() =>
                                setActiveTab(
                                    "activity"
                                )
                            }
                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                activeTab ===
                                "activity"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Activity insights
                        </button>

                    </nav>

                </div>


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                {activeTab === "viewEdit" && (
                    <div className="w-full space-y-6">


                        {/* =================================================
                            CAREER PREFERENCES
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-base font-bold text-gray-900">
                                    Your career preferences
                                </h2>

                                <button
                                    onClick={() => {
                                        setPrefForm(
                                            profile.preferences
                                        );

                                        setEditingPref(
                                            true
                                        );
                                    }}
                                    className="text-gray-400 hover:text-blue-600 transition"
                                >
                                    <Pencil size={16} />
                                </button>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                                <div>

                                    <p className="text-xs text-gray-400 font-medium">
                                        Preferred job type
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">

                                        {profile.preferences
                                            .preferredJobType
                                            ?.length
                                            ? profile.preferences.preferredJobType.join(
                                                ", "
                                            )
                                            : "Not added"}

                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-gray-400 font-medium">
                                        Availability to work
                                    </p>

                                    <p className="font-semibold text-blue-600 mt-1">

                                        {profile.preferences
                                            .availability ||
                                            "Not added"}

                                    </p>

                                </div>


                                <div className="md:col-span-2">

                                    <p className="text-xs text-gray-400 font-medium">
                                        Preferred location
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">

                                        {profile.preferences
                                            .preferredLocation
                                            ?.length
                                            ? profile.preferences.preferredLocation.join(
                                                ", "
                                            )
                                            : "Not added"}

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            EDUCATION
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-base font-bold text-gray-900">
                                    Education
                                </h2>

                                <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            <div className="space-y-4">

                                {profile.education.map(
                                    (edu) => (
                                        <div
                                            key={edu.id}
                                            className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                                        >

                                            <div className="flex items-center justify-between">

                                                <p className="font-semibold text-sm text-gray-900">
                                                    {edu.title}
                                                </p>

                                                <button className="text-gray-400 hover:text-blue-600">
                                                    <Pencil
                                                        size={14}
                                                    />
                                                </button>

                                            </div>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {edu.details}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-base font-bold text-gray-900">
                                    Key skills
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowSkillInput(
                                            !showSkillInput
                                        )
                                    }
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            {showSkillInput && (
                                <form
                                    onSubmit={
                                        handleAddSkill
                                    }
                                    className="flex items-center gap-2 mb-4"
                                >

                                    <input
                                        type="text"
                                        list="candidate-skill-options"
                                        value={
                                            newSkill
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setNewSkill(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter skill name..."
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                                    />
                                    <datalist id="candidate-skill-options">
                                        {skillOptions.map((skill) => (
                                            <option key={skill.id} value={skill.name} />
                                        ))}
                                    </datalist>

                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                    >
                                        Add
                                    </button>

                                </form>
                            )}


                            <div className="flex flex-wrap gap-2">

                                {profile.skills.map(
                                    (
                                        skill,
                                        index
                                    ) => (
                                        <span
                                            key={skill.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-medium"
                                        >

                                            {skill.name}

                                            <button
                                                onClick={() =>
                                                    handleDeleteSkill(
                                                        skill
                                                    )
                                                }
                                                className="hover:text-red-500 transition"
                                            >
                                                <X
                                                    size={
                                                        12
                                                    }
                                                />
                                            </button>

                                        </span>
                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            INTERNSHIPS
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-base font-bold text-gray-900">
                                    Internships
                                </h2>

                                <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            {profile.internships.length >
                            0 ? (
                                <div className="space-y-4">

                                    {profile.internships.map(
                                        (
                                            intern
                                        ) => (
                                            <div
                                                key={
                                                    intern.id
                                                }
                                                className="flex items-start justify-between"
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-blue-600">

                                                        <Building
                                                            size={
                                                                20
                                                            }
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-sm text-gray-900">
                                                            {
                                                                intern.company
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                intern.period
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                <button className="text-gray-400 hover:text-blue-600">

                                                    <Pencil
                                                        size={
                                                            14
                                                        }
                                                    />

                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Mention internships to highlight practical work experience.
                                </p>
                            )}

                        </div>


                        {/* =================================================
                            PROJECTS
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-2">

                                <h2 className="text-base font-bold text-gray-900">
                                    Projects
                                </h2>

                                <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            <p className="text-xs text-gray-500">

                                Talk about your projects that made you proud and contributed to your learnings

                            </p>

                        </div>


                        {/* =================================================
                            PROFILE SUMMARY
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-2">

                                <h2 className="text-base font-bold text-gray-900">
                                    Profile Summary
                                </h2>

                                <button
                                    onClick={() => {
                                        setBioText(
                                            profile.bio
                                        );

                                        setEditingBio(
                                            true
                                        );
                                    }}
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

                                    {profile.bio ? (
                                        <Pencil
                                            size={
                                                14
                                            }
                                        />
                                    ) : (
                                        <Plus
                                            size={
                                                16
                                            }
                                        />
                                    )}

                                    {profile.bio
                                        ? "Edit"
                                        : "Add"}

                                </button>

                            </div>


                            {profile.bio ? (
                                <p className="text-sm text-gray-700 leading-relaxed mt-2">
                                    {profile.bio}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">

                                    Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters.

                                </p>
                            )}

                        </div>


                        {/* =================================================
                            RESUME
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">

                            <div>

                                <h2 className="text-base font-bold text-gray-900">
                                    Resume
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">

                                    Your resume is the first impression you make on potential employers. Craft it carefully to secure your desired job or internship.

                                </p>

                            </div>


                            {profile.resume && (
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">

                                    <div className="flex items-center gap-3">

                                        <FileText
                                            size={
                                                24
                                            }
                                            className="text-blue-600"
                                        />

                                        <div>

                                            <p className="text-sm font-semibold text-gray-900">

                                                {profile.resume
                                                    .split(
                                                        "/"
                                                    )
                                                    .pop()}

                                            </p>

                                            <p className="text-xs text-gray-400">

                                                Uploaded on{" "}
                                                {profile.resumeDate ||
                                                    "Available"}

                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-center gap-2">

                                        <a
                                            href={`${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${profile.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition"
                                            title="Download Resume"
                                        >
                                            <Download
                                                size={
                                                    18
                                                }
                                            />
                                        </a>


                                        <button
                                            onClick={
                                                handleDeleteResume
                                            }
                                            disabled={
                                                uploading
                                            }
                                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white transition"
                                            title="Delete Resume"
                                        >

                                            {uploading ? (
                                                <Loader2
                                                    size={
                                                        18
                                                    }
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash2
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}

                                        </button>

                                    </div>

                                </div>
                            )}


                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center space-y-3 bg-gray-50/50">

                                <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-full font-semibold text-sm hover:bg-blue-50 cursor-pointer transition shadow-sm">

                                    {uploading ? (
                                        <Loader2
                                            size={
                                                16
                                            }
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload
                                            size={
                                                16
                                            }
                                        />
                                    )}

                                    {uploading
                                        ? "Uploading..."
                                        : "Update resume"}

                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={
                                            handleResumeUpload
                                        }
                                        className="hidden"
                                    />

                                </label>


                                <p className="text-xs text-gray-400">

                                    Supported formats: doc, docx, pdf, up to 5MB

                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* =====================================================
                    ACTIVITY TAB
                ===================================================== */}

                {activeTab === "activity" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                        <h2 className="text-base font-bold text-gray-900">
                            Activity insights
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Your activity insights will be connected with your applications, saved jobs, interviews and notifications.
                        </p>

                    </div>
                )}

            </div>


            {/* =====================================================
                HEADER MODAL
            ===================================================== */}

            {editingHeader && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3">

                            <h3 className="font-bold text-gray-900">
                                Edit Personal Details
                            </h3>

                            <button
                                onClick={() =>
                                    setEditingHeader(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleHeaderSubmit
                            }
                            className="space-y-3 text-sm"
                        >

                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.name ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                name: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Degree
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.degree ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                degree: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    College / University
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.college ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                college: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.location ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                location: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Gender
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.gender ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                gender: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    value={
                                        headerForm.dob ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                dob: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    value={
                                        headerForm.phone ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                phone: e
                                                    .target
                                                    .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div className="flex justify-end gap-2 pt-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingHeader(
                                            false
                                        )
                                    }
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >

                                    {saving && (
                                        <Loader2
                                            size={
                                                15
                                            }
                                            className="animate-spin"
                                        />
                                    )}

                                    Save

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =====================================================
                CAREER PREFERENCES MODAL
            ===================================================== */}

            {editingPref && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3">

                            <h3 className="font-bold text-gray-900">
                                Edit Career Preferences
                            </h3>

                            <button
                                onClick={() =>
                                    setEditingPref(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handlePrefSubmit
                            }
                            className="space-y-3 text-sm"
                        >

                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Preferred Job Type
                                </label>

                                <input
                                    type="text"
                                    value={
                                        Array.isArray(
                                            prefForm.preferredJobType
                                        )
                                            ? prefForm.preferredJobType.join(
                                                ", "
                                            )
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setPrefForm(
                                            {
                                                ...prefForm,

                                                preferredJobType:
                                                    e.target.value
                                                        .split(
                                                            ","
                                                        )
                                                        .map(
                                                            (
                                                                value
                                                            ) =>
                                                                value.trim()
                                                        )
                                                        .filter(
                                                            Boolean
                                                        ),
                                            }
                                        )
                                    }
                                    placeholder="Jobs, Internships"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Availability to Work
                                </label>

                                <input
                                    type="text"
                                    value={
                                        prefForm.availability ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setPrefForm(
                                            {
                                                ...prefForm,
                                                availability:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Immediate"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Preferred Location
                                </label>

                                <input
                                    type="text"
                                    value={
                                        Array.isArray(
                                            prefForm.preferredLocation
                                        )
                                            ? prefForm.preferredLocation.join(
                                                ", "
                                            )
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setPrefForm(
                                            {
                                                ...prefForm,

                                                preferredLocation:
                                                    e.target.value
                                                        .split(
                                                            ","
                                                        )
                                                        .map(
                                                            (
                                                                value
                                                            ) =>
                                                                value.trim()
                                                        )
                                                        .filter(
                                                            Boolean
                                                        ),
                                            }
                                        )
                                    }
                                    placeholder="Gurgaon, Mumbai, Pune"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />

                            </div>


                            <div className="flex justify-end gap-2 pt-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingPref(
                                            false
                                        )
                                    }
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >

                                    {saving && (
                                        <Loader2
                                            size={
                                                15
                                            }
                                            className="animate-spin"
                                        />
                                    )}

                                    Save

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =====================================================
                PROFILE SUMMARY MODAL
            ===================================================== */}

            {editingBio && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3">

                            <h3 className="font-bold text-gray-900">
                                Edit Profile Summary
                            </h3>

                            <button
                                onClick={() =>
                                    setEditingBio(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleBioSubmit
                            }
                            className="space-y-3 text-sm"
                        >

                            <textarea
                                rows="5"
                                value={
                                    bioText
                                }
                                onChange={(e) =>
                                    setBioText(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Write a meaningful summary..."
                                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />


                            <div className="flex justify-end gap-2 pt-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingBio(
                                            false
                                        )
                                    }
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >

                                    {saving && (
                                        <Loader2
                                            size={
                                                15
                                            }
                                            className="animate-spin"
                                        />
                                    )}

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
