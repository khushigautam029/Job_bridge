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
    addCandidateEducation,
    addCandidateExperience,
    addCandidateProject,
    addCandidateSkill,
    deleteCandidateEducation,
    deleteCandidateExperience,
    deleteCandidateProfileImage,
    deleteCandidateProject,
    deleteCandidateResume,
    deleteCandidateSkill,
    getCandidateEducation,
    getCandidateExperiences,
    getCandidateProfile,
    getCandidateProjects,
    getCandidateSkills,
    updateCandidateEducation,
    updateCandidateExperience,
    updateCandidateProfile,
    updateCandidateProject,
    uploadCandidateProfileImage,
    uploadCandidateResume,
} from "../../services/profileService";

import { getSkills as getSkillCatalog } from "../../services/skillService";


const CandidateProfile = () => {
    // BASIC STATES
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [activeTab, setActiveTab] = useState("viewEdit");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const profileImageInputRef = useRef(null);

    // PROFILE STATE
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


    // EDIT MODAL STATES
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

    // EDUCATION MODAL
    const [showEducationModal, setShowEducationModal] =
        useState(false);

    const [editingEducationId, setEditingEducationId] =
        useState(null);

    const [educationForm, setEducationForm] =
        useState({
            degree: "",
            fieldOfStudy: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",
        });


    // EXPERIENCE MODAL
    const [showExperienceModal, setShowExperienceModal] =
        useState(false);

    const [editingExperienceId, setEditingExperienceId] =
        useState(null);

    const [experienceForm, setExperienceForm] =
        useState({
            companyName: "",
            jobTitle: "",
            employmentType: "INTERNSHIP",
            location: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            description: "",
            skills: [],
        });


    // PROJECT MODAL
    const [showProjectModal, setShowProjectModal] =
        useState(false);

    const [editingProjectId, setEditingProjectId] =
        useState(null);

    const [projectForm, setProjectForm] =
        useState({
            title: "",
            description: "",
            technologies: [],
            projectUrl: "",
            githubUrl: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            role: "",
        });


    // SKILLS
    const [newSkill, setNewSkill] =
        useState("");

    const [skillOptions, setSkillOptions] =
        useState([]);

    const [showSkillInput, setShowSkillInput] =
        useState(false);


    // HELPER FUNCTIONS
    const getResponseData = (response) => {
        return response?.data || {};
    };


    const getAssetUrl = (filePath) => {

        if (!filePath) {
            return "";
        }

        if (filePath.startsWith("http")) {
            return filePath;
        }

        const apiUrl =
            import.meta.env.VITE_API_URL ||
            "http://localhost:5001/api";

        const serverUrl =
            apiUrl.replace(/\/api\/?$/, "");

        return `${serverUrl}${filePath.startsWith("/")
            ? filePath
            : `/${filePath}`
            }`;
    };


    const getFileName = (filePath) => {

        if (!filePath) {
            return "";
        }

        return filePath
            .split("/")
            .pop();
    };


    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        try {
            return new Date(date).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }
            );
        } catch {
            return date;
        }
    };


    const splitCommaValues = (value) => {

        if (Array.isArray(value)) {
            return value;
        }

        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };


    const normalizeSkillOptions = (response) => {

        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.data?.skills)) {
            return response.data.skills;
        }

        if (Array.isArray(response?.skills)) {
            return response.skills;
        }

        return [];
    };


    const showSuccess = (text) => {
        setMessage(text);
        setError("");
    };


    const showError = (text) => {
        setError(text);
        setMessage("");
    };

    // LOAD PROFILE
    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                profileResponse,
                skillsResponse,
                educationResponse,
                experienceResponse,
                projectsResponse,
                catalogResponse,
            ] = await Promise.all([
                getCandidateProfile(),
                getCandidateSkills(),
                getCandidateEducation(),
                getCandidateExperiences(),
                getCandidateProjects(),
                getSkillCatalog(),
            ]);


            const candidate =
                profileResponse?.data?.candidate ||
                {};


            const skills =
                skillsResponse?.data?.skills ||
                [];


            const educations =
                educationResponse?.data?.educations ||
                [];


            const experiences =
                experienceResponse?.data?.experiences ||
                [];


            const projects =
                projectsResponse?.data?.projects ||
                [];


            setSkillOptions(
                normalizeSkillOptions(
                    catalogResponse
                )
            );


            setProfile({

                name:
                    candidate.user?.name ||
                    "",

                email:
                    candidate.user?.email ||
                    "",

                phone:
                    candidate.user?.phone ||
                    "",

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

                resume:
                    candidate.resume ||
                    "",

                resumeDate:
                    candidate.updatedAt
                        ? formatDate(
                            candidate.updatedAt
                        )
                        : "",

                profileImage:
                    candidate.profileImage ||
                    "",

                profileCompletionPercentage:
                    candidate.profileCompletionPercentage ??
                    0,

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


                skills,


                education:
                    educations,


                internships:
                    experiences,


                projects,
            });

        } catch (err) {

            console.error(
                "Failed to load candidate profile:",
                err
            );

            showError(
                err.response?.data?.message ||
                "Unable to load candidate profile."
            );

        } finally {

            setLoading(false);
        }
    };

    // UPDATE MAIN PROFILE
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

                name:
                    newProfileData.name,

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
                        ?.preferredJobType ||
                    [],

                preferredLocation:
                    newProfileData.preferences
                        ?.preferredLocation ||
                    [],

                availability:
                    newProfileData.preferences
                        ?.availability ||
                    "",
            };


            const response =
                await updateCandidateProfile(
                    payload
                );


            const updatedCandidate =
                response?.data?.candidate;


            if (updatedCandidate) {

                setProfile((prev) => ({

                    ...prev,

                    ...newProfileData,

                    name:
                        updatedCandidate.user?.name ||
                        newProfileData.name,

                    email:
                        updatedCandidate.user?.email ||
                        prev.email,

                    phone:
                        updatedCandidate.user?.phone ||
                        newProfileData.phone,

                    degree:
                        updatedCandidate.degree ??
                        newProfileData.degree,

                    college:
                        updatedCandidate.college ??
                        newProfileData.college,

                    location:
                        updatedCandidate.location ??
                        newProfileData.location,

                    gender:
                        updatedCandidate.gender ??
                        newProfileData.gender,

                    dob:
                        updatedCandidate.dob ??
                        newProfileData.dob,

                    experienceYears:
                        updatedCandidate.experienceYears ??
                        newProfileData.experienceYears,

                    bio:
                        updatedCandidate.bio ??
                        newProfileData.bio,

                    linkedinUrl:
                        updatedCandidate.linkedinUrl ??
                        newProfileData.linkedinUrl,

                    githubUrl:
                        updatedCandidate.githubUrl ??
                        newProfileData.githubUrl,

                    portfolioUrl:
                        updatedCandidate.portfolioUrl ??
                        newProfileData.portfolioUrl,

                    profileCompletionPercentage:
                        updatedCandidate.profileCompletionPercentage ??
                        prev.profileCompletionPercentage,

                    preferences: {
                        preferredJobType:
                            updatedCandidate.preferredJobType ??
                            newProfileData.preferences.preferredJobType,

                        preferredLocation:
                            updatedCandidate.preferredLocation ??
                            newProfileData.preferences.preferredLocation,

                        availability:
                            updatedCandidate.availability ??
                            newProfileData.preferences.availability,
                    },

                }));

            } else {

                setProfile(
                    (prev) => ({
                        ...prev,
                        ...newProfileData,
                    })
                );
            }


            showSuccess(
                "Profile updated successfully."
            );

            return true;

        } catch (err) {

            console.error(
                "Failed to update profile:",
                err
            );

            showError(
                err.response?.data?.message ||
                "Failed to update profile."
            );

            return false;

        } finally {

            setSaving(false);
        }
    };

    // HEADER
    const openHeaderEdit = () => {

        setHeaderForm({

            name:
                profile.name,

            degree:
                profile.degree,

            college:
                profile.college,

            location:
                profile.location,

            gender:
                profile.gender,

            dob:
                profile.dob
                    ? profile.dob.substring(
                        0,
                        10
                    )
                    : "",

            phone:
                profile.phone,

            experienceYears:
                profile.experienceYears,

            linkedinUrl:
                profile.linkedinUrl,

            githubUrl:
                profile.githubUrl,

            portfolioUrl:
                profile.portfolioUrl,
        });


        setEditingHeader(true);
    };


    const handleHeaderSubmit = async (e) => {

        e.preventDefault();

        const success =
            await handleSaveProfileData(
                headerForm
            );

        if (success) {
            setEditingHeader(false);
        }
    };

    // CAREER PREFERENCES
    const openPreferenceEdit = () => {

        setPrefForm({

            preferredJobType:
                [
                    ...(profile.preferences
                        ?.preferredJobType ||
                        []),
                ],

            preferredLocation:
                [
                    ...(profile.preferences
                        ?.preferredLocation ||
                        []),
                ],

            availability:
                profile.preferences
                    ?.availability ||
                "",
        });


        setEditingPref(true);
    };


    const handlePrefSubmit = async (e) => {

        e.preventDefault();


        const success =
            await handleSaveProfileData({

                preferences: {

                    preferredJobType:
                        prefForm.preferredJobType,

                    preferredLocation:
                        prefForm.preferredLocation,

                    availability:
                        prefForm.availability,
                },

            });


        if (success) {
            setEditingPref(false);
        }
    };


    // BIO
    const openBioEdit = () => {

        setBioText(
            profile.bio || ""
        );

        setEditingBio(true);
    };


    const handleBioSubmit = async (e) => {

        e.preventDefault();


        const success =
            await handleSaveProfileData({

                bio: bioText,

            });


        if (success) {
            setEditingBio(false);
        }
    };

    // RESUME UPLOAD
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
                response?.data?.candidate;


            setProfile((prev) => ({

                ...prev,

                resume:
                    candidate?.resume ||
                    file.name,

                resumeDate:
                    formatDate(
                        new Date()
                    ),

                profileCompletionPercentage:
                    candidate?.profileCompletionPercentage ??
                    prev.profileCompletionPercentage,

            }));


            showSuccess(
                "Resume uploaded successfully."
            );

        } catch (err) {

            console.error(
                "Failed to upload resume:",
                err
            );

            showError(
                err.response?.data?.message ||
                "Failed to upload resume."
            );

        } finally {

            setUploading(false);

            e.target.value = "";
        }
    };

    // RESUME DELETE
    const handleDeleteResume = async () => {

        try {

            setUploading(true);
            setMessage("");
            setError("");


            const response =
                await deleteCandidateResume();


            const candidate =
                response?.data?.candidate;


            setProfile((prev) => ({

                ...prev,

                resume: "",

                resumeDate: "",

                profileCompletionPercentage:
                    candidate?.profileCompletionPercentage ??
                    prev.profileCompletionPercentage,
            }));


            showSuccess(
                "Resume removed successfully."
            );

        } catch (err) {

            console.error(
                "Failed to delete resume:",
                err
            );

            showError(
                err.response?.data?.message ||
                "Failed to delete resume."
            );

        } finally {

            setUploading(false);
        }
    };

    // PROFILE IMAGE UPLOAD
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


            const candidate =
                response?.data?.candidate;


            const imagePath =
                candidate?.profileImage ||
                response?.data?.profileImage;


            setProfile((prev) => ({

                ...prev,

                profileImage:
                    imagePath || "",

                profileCompletionPercentage:
                    candidate?.profileCompletionPercentage ??
                    prev.profileCompletionPercentage,

            }));


            showSuccess(
                "Profile image uploaded successfully."
            );

        } catch (err) {

            console.error(
                "Failed to upload profile image:",
                err
            );

            showError(
                err.response?.data?.message ||
                "Failed to upload profile image."
            );

        } finally {

            setUploadingImage(false);

            e.target.value = "";
        }
    };


    // PROFILE IMAGE DELETE
    const handleDeleteProfileImage =
        async () => {

            try {

                setUploadingImage(true);
                setMessage("");
                setError("");


                const response =
                    await deleteCandidateProfileImage();


                const candidate =
                    response?.data?.candidate;


                setProfile((prev) => ({

                    ...prev,

                    profileImage: "",

                    profileCompletionPercentage:
                        candidate?.profileCompletionPercentage ??
                        prev.profileCompletionPercentage,

                }));


                showSuccess(
                    "Profile image removed successfully."
                );

            } catch (err) {

                console.error(
                    "Failed to delete profile image:",
                    err
                );

                showError(
                    err.response?.data?.message ||
                    "Failed to delete profile image."
                );

            } finally {

                setUploadingImage(false);
            }
        };


    // EDUCATION
    const resetEducationForm = () => {

        setEducationForm({

            degree: "",
            fieldOfStudy: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",

        });

        setEditingEducationId(null);
    };


    const openAddEducation = () => {

        resetEducationForm();

        setShowEducationModal(true);
    };


    const openEditEducation = (education) => {

        setEducationForm({

            degree:
                education.degree || "",

            fieldOfStudy:
                education.fieldOfStudy || "",

            institution:
                education.institution || "",

            location:
                education.location || "",

            startDate:
                education.startDate
                    ? education.startDate.substring(
                        0,
                        10
                    )
                    : "",

            endDate:
                education.endDate
                    ? education.endDate.substring(
                        0,
                        10
                    )
                    : "",

            grade:
                education.grade || "",

            description:
                education.description || "",

        });


        setEditingEducationId(
            education.id
        );

        setShowEducationModal(true);
    };


    const handleEducationSubmit =
        async (e) => {

            e.preventDefault();


            try {

                setSaving(true);
                setMessage("");
                setError("");


                let response;


                if (editingEducationId) {

                    response =
                        await updateCandidateEducation(
                            editingEducationId,
                            educationForm
                        );

                } else {

                    response =
                        await addCandidateEducation(
                            educationForm
                        );
                }


                const education =
                    response?.data?.education;


                if (editingEducationId) {

                    setProfile((prev) => ({

                        ...prev,

                        education:
                            prev.education.map(
                                (item) =>
                                    item.id ===
                                        editingEducationId
                                        ? education ||
                                        {
                                            ...item,
                                            ...educationForm,
                                        }
                                        : item
                            ),

                    }));

                } else {

                    setProfile((prev) => ({

                        ...prev,

                        education: [

                            ...prev.education,

                            education ||
                            {
                                id:
                                    Date.now(),
                                ...educationForm,
                            },

                        ],

                    }));
                }


                setShowEducationModal(false);
                resetEducationForm();


                showSuccess(
                    editingEducationId
                        ? "Education updated successfully."
                        : "Education added successfully."
                );

            } catch (err) {

                console.error(
                    "Education save error:",
                    err
                );

                showError(
                    err.response?.data?.message ||
                    "Failed to save education."
                );

            } finally {

                setSaving(false);
            }
        };


    const handleDeleteEducation =
        async (educationId) => {

            if (
                !window.confirm(
                    "Are you sure you want to delete this education?"
                )
            ) {
                return;
            }


            try {

                setSaving(true);


                await deleteCandidateEducation(
                    educationId
                );


                setProfile((prev) => ({

                    ...prev,

                    education:
                        prev.education.filter(
                            (item) =>
                                item.id !==
                                educationId
                        ),

                }));


                showSuccess(
                    "Education removed successfully."
                );

            } catch (err) {

                showError(
                    err.response?.data?.message ||
                    "Failed to delete education."
                );

            } finally {

                setSaving(false);
            }
        };

    // EXPERIENCE
    const resetExperienceForm = () => {

        setExperienceForm({

            companyName: "",
            jobTitle: "",
            employmentType: "INTERNSHIP",
            location: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            description: "",
            skills: [],

        });

        setEditingExperienceId(null);
    };


    const openAddExperience = () => {

        resetExperienceForm();

        setShowExperienceModal(true);
    };


    const openEditExperience =
        (experience) => {

            setExperienceForm({

                companyName:
                    experience.companyName ||
                    "",

                jobTitle:
                    experience.jobTitle ||
                    "",

                employmentType:
                    experience.employmentType ||
                    "INTERNSHIP",

                location:
                    experience.location ||
                    "",

                startDate:
                    experience.startDate
                        ? experience.startDate.substring(
                            0,
                            10
                        )
                        : "",

                endDate:
                    experience.endDate
                        ? experience.endDate.substring(
                            0,
                            10
                        )
                        : "",

                currentlyWorking:
                    Boolean(
                        experience.currentlyWorking
                    ),

                description:
                    experience.description ||
                    "",

                skills:
                    Array.isArray(
                        experience.skills
                    )
                        ? experience.skills
                        : [],

            });


            setEditingExperienceId(
                experience.id
            );

            setShowExperienceModal(true);
        };


    const handleExperienceSubmit =
        async (e) => {

            e.preventDefault();


            try {

                setSaving(true);
                setMessage("");
                setError("");


                const payload = {

                    ...experienceForm,

                    skills:
                        Array.isArray(
                            experienceForm.skills
                        )
                            ? experienceForm.skills
                            : splitCommaValues(
                                experienceForm.skills
                            ),

                    endDate:
                        experienceForm.currentlyWorking
                            ? null
                            : experienceForm.endDate ||
                            null,

                };


                let response;


                if (editingExperienceId) {

                    response =
                        await updateCandidateExperience(
                            editingExperienceId,
                            payload
                        );

                } else {

                    response =
                        await addCandidateExperience(
                            payload
                        );
                }


                const experience =
                    response?.data?.experience;


                if (editingExperienceId) {

                    setProfile((prev) => ({

                        ...prev,

                        internships:
                            prev.internships.map(
                                (item) =>
                                    item.id ===
                                        editingExperienceId
                                        ? experience ||
                                        {
                                            ...item,
                                            ...payload,
                                        }
                                        : item
                            ),

                    }));

                } else {

                    setProfile((prev) => ({

                        ...prev,

                        internships: [

                            ...prev.internships,

                            experience ||
                            {
                                id:
                                    Date.now(),
                                ...payload,
                            },

                        ],

                    }));
                }


                setShowExperienceModal(false);
                resetExperienceForm();


                showSuccess(
                    editingExperienceId
                        ? "Experience updated successfully."
                        : "Experience added successfully."
                );

            } catch (err) {

                console.error(
                    "Experience save error:",
                    err
                );

                showError(
                    err.response?.data?.message ||
                    "Failed to save experience."
                );

            } finally {

                setSaving(false);
            }
        };


    const handleDeleteExperience =
        async (experienceId) => {

            if (
                !window.confirm(
                    "Are you sure you want to delete this experience?"
                )
            ) {
                return;
            }


            try {

                setSaving(true);


                await deleteCandidateExperience(
                    experienceId
                );


                setProfile((prev) => ({

                    ...prev,

                    internships:
                        prev.internships.filter(
                            (item) =>
                                item.id !==
                                experienceId
                        ),

                }));


                showSuccess(
                    "Experience removed successfully."
                );

            } catch (err) {

                showError(
                    err.response?.data?.message ||
                    "Failed to delete experience."
                );

            } finally {

                setSaving(false);
            }
        };

    // PROJECTS
    const resetProjectForm = () => {

        setProjectForm({

            title: "",
            description: "",
            technologies: [],
            projectUrl: "",
            githubUrl: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
            role: "",

        });

        setEditingProjectId(null);
    };


    const openAddProject = () => {

        resetProjectForm();

        setShowProjectModal(true);
    };


    const openEditProject = (project) => {

        setProjectForm({

            title:
                project.title || "",

            description:
                project.description || "",

            technologies:
                Array.isArray(
                    project.technologies
                )
                    ? project.technologies
                    : [],

            projectUrl:
                project.projectUrl ||
                "",

            githubUrl:
                project.githubUrl ||
                "",

            startDate:
                project.startDate
                    ? project.startDate.substring(
                        0,
                        10
                    )
                    : "",

            endDate:
                project.endDate
                    ? project.endDate.substring(
                        0,
                        10
                    )
                    : "",

            currentlyWorking:
                Boolean(
                    project.currentlyWorking
                ),

            role:
                project.role || "",

        });


        setEditingProjectId(
            project.id
        );

        setShowProjectModal(true);
    };


    const handleProjectSubmit =
        async (e) => {

            e.preventDefault();


            try {

                setSaving(true);
                setMessage("");
                setError("");


                const payload = {

                    ...projectForm,

                    technologies:
                        Array.isArray(
                            projectForm.technologies
                        )
                            ? projectForm.technologies
                            : splitCommaValues(
                                projectForm.technologies
                            ),

                    endDate:
                        projectForm.currentlyWorking
                            ? null
                            : projectForm.endDate ||
                            null,

                };


                let response;


                if (editingProjectId) {

                    response =
                        await updateCandidateProject(
                            editingProjectId,
                            payload
                        );

                } else {

                    response =
                        await addCandidateProject(
                            payload
                        );
                }


                const project =
                    response?.data?.project;


                if (editingProjectId) {

                    setProfile((prev) => ({

                        ...prev,

                        projects:
                            prev.projects.map(
                                (item) =>
                                    item.id ===
                                        editingProjectId
                                        ? project ||
                                        {
                                            ...item,
                                            ...payload,
                                        }
                                        : item
                            ),

                    }));

                } else {

                    setProfile((prev) => ({

                        ...prev,

                        projects: [

                            ...prev.projects,

                            project ||
                            {
                                id:
                                    Date.now(),
                                ...payload,
                            },

                        ],

                    }));
                }


                setShowProjectModal(false);
                resetProjectForm();


                showSuccess(
                    editingProjectId
                        ? "Project updated successfully."
                        : "Project added successfully."
                );

            } catch (err) {

                console.error(
                    "Project save error:",
                    err
                );

                showError(
                    err.response?.data?.message ||
                    "Failed to save project."
                );

            } finally {

                setSaving(false);
            }
        };


    const handleDeleteProject =
        async (projectId) => {

            if (
                !window.confirm(
                    "Are you sure you want to delete this project?"
                )
            ) {
                return;
            }


            try {

                setSaving(true);


                await deleteCandidateProject(
                    projectId
                );


                setProfile((prev) => ({

                    ...prev,

                    projects:
                        prev.projects.filter(
                            (item) =>
                                item.id !==
                                projectId
                        ),

                }));


                showSuccess(
                    "Project removed successfully."
                );

            } catch (err) {

                showError(
                    err.response?.data?.message ||
                    "Failed to delete project."
                );

            } finally {

                setSaving(false);
            }
        };


    // =====================================================
    // SKILLS
    // =====================================================

    const handleAddSkill = async (e) => {

        e.preventDefault();


        const requestedName =
            newSkill.trim();


        if (!requestedName) {
            return;
        }


        try {

            setSaving(true);
            setError("");


            const match =
                skillOptions.find(
                    (item) =>
                        item.name?.toLowerCase() ===
                        requestedName.toLowerCase()
                );


            if (!match) {

                showError(
                    "Choose a skill from the supported skill catalog."
                );

                return;
            }


            if (
                profile.skills.some(
                    (item) =>
                        item.id ===
                        match.id
                )
            ) {

                showError(
                    "This skill is already in your profile."
                );

                return;
            }


            const response =
                await addCandidateSkill(
                    match.id
                );


            const addedSkill =
                response?.data?.skill ||
                match;


            setProfile((prev) => ({

                ...prev,

                skills: [
                    ...prev.skills,
                    addedSkill,
                ],

            }));


            setNewSkill("");
            setShowSkillInput(false);


            showSuccess(
                "Skill added successfully."
            );

        } catch (err) {

            showError(
                err.response?.data?.message ||
                "Failed to add skill."
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDeleteSkill =
        async (skillToDelete) => {

            try {

                setSaving(true);


                await deleteCandidateSkill(
                    skillToDelete.id
                );


                setProfile((prev) => ({

                    ...prev,

                    skills:
                        prev.skills.filter(
                            (skill) =>
                                skill.id !==
                                skillToDelete.id
                        ),

                }));


                showSuccess(
                    "Skill removed successfully."
                );

            } catch (err) {

                showError(
                    err.response?.data?.message ||
                    "Failed to remove skill."
                );

            } finally {

                setSaving(false);
            }
        };

    // LOADING
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


    // UI
    return (

        <div className="min-h-screen bg-white text-gray-800 w-full p-4 md:p-8">

            <div className="w-full max-w-7xl mx-auto space-y-6">


                    {/* NOTIFICATIONS */}
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


                    {/* TOP PROFILE CARD */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">


                        {/* PROFILE */}

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-2/3">


                            {/* IMAGE */}

                            <div className="relative">

                                <div
                                    onClick={() =>
                                        profileImageInputRef.current?.click()
                                    }
                                    className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-amber-400 bg-gray-100 flex-shrink-0 group cursor-pointer overflow-hidden"
                                >

                                    {profile.profileImage ? (

                                        <img
                                            src={getAssetUrl(
                                                profile.profileImage
                                            )}
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


                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">

                                    {profile.profileCompletionPercentage}%

                                </div>

                            </div>


                            {/* IDENTITY */}

                            <div className="flex-1 text-center sm:text-left space-y-2">

                                <div className="flex items-center justify-center sm:justify-start gap-2">

                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {profile.name ||
                                            "Candidate"}
                                    </h1>

                                    <button
                                        type="button"
                                        onClick={
                                            openHeaderEdit
                                        }
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

                            <button
                                type="button"
                                onClick={
                                    openAddProject
                                }
                                className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-blue-600"
                            >

                                <span className="flex items-center gap-2">

                                    <Briefcase
                                        size={16}
                                        className="text-amber-600"
                                    />

                                    Add project

                                </span>

                                <Plus size={15} />

                            </button>


                            <button
                                type="button"
                                onClick={
                                    openAddExperience
                                }
                                className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-blue-600"
                            >

                                <span className="flex items-center gap-2">

                                    <GraduationCap
                                        size={16}
                                        className="text-amber-600"
                                    />

                                    Add experience

                                </span>

                                <Plus size={15} />

                            </button>


                            <button
                                type="button"
                                onClick={
                                    openHeaderEdit
                                }
                                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm"
                            >
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
                            type="button"
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
                            type="button"
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
                    VIEW & EDIT
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
                                    type="button"
                                    onClick={
                                        openPreferenceEdit
                                    }
                                    className="text-gray-400 hover:text-blue-600 transition"
                                    title="Edit career preferences"
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

                                <button
                                    type="button"
                                    onClick={
                                        openAddEducation
                                    }
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            {profile.education.length >
                                0 ? (

                                <div className="space-y-4">

                                    {profile.education.map(
                                        (edu) => (

                                            <div
                                                key={
                                                    edu.id
                                                }
                                                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <p className="font-semibold text-sm text-gray-900">

                                                            {edu.degree}

                                                            {edu.fieldOfStudy
                                                                ? ` in ${edu.fieldOfStudy}`
                                                                : ""}

                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">

                                                            {edu.institution}

                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">

                                                            {[
                                                                edu.location,

                                                                edu.startDate &&
                                                                    edu.endDate
                                                                    ? `${formatDate(
                                                                        edu.startDate
                                                                    )} – ${formatDate(
                                                                        edu.endDate
                                                                    )}`
                                                                    : edu.currentlyStudying
                                                                        ? "Currently studying"
                                                                        : edu.endDate
                                                                            ? `Completed ${formatDate(
                                                                                edu.endDate
                                                                            )}`
                                                                            : edu.startDate
                                                                                ? `Started ${formatDate(
                                                                                    edu.startDate
                                                                                )}`
                                                                                : "",

                                                                edu.grade,
                                                            ]
                                                                .filter(
                                                                    Boolean
                                                                )
                                                                .join(
                                                                    " • "
                                                                )}

                                                        </p>

                                                    </div>


                                                    <div className="flex items-center gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditEducation(
                                                                    edu
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-blue-600"
                                                            title="Edit education"
                                                        >
                                                            <Pencil
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteEducation(
                                                                    edu.id
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-red-600"
                                                            title="Delete education"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="text-center py-6">

                                    <GraduationCap
                                        size={30}
                                        className="mx-auto text-gray-300 mb-2"
                                    />

                                    <p className="text-sm text-gray-500">
                                        No education added yet.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            openAddEducation
                                        }
                                        className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                                    >
                                        + Add education
                                    </button>

                                </div>
                            )}

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
                                    type="button"
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
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter skill name..."
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                                    />


                                    <datalist id="candidate-skill-options">

                                        {skillOptions.map(
                                            (skill) => (

                                                <option
                                                    key={
                                                        skill.id
                                                    }
                                                    value={
                                                        skill.name
                                                    }
                                                />
                                            )
                                        )}

                                    </datalist>


                                    <button
                                        type="submit"
                                        disabled={
                                            saving
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Add
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSkillInput(
                                                false
                                            );
                                            setNewSkill("");
                                        }}
                                        className="p-2 text-gray-400 hover:text-gray-700"
                                    >
                                        <X size={18} />
                                    </button>

                                </form>
                            )}


                            <div className="flex flex-wrap gap-2">

                                {profile.skills.length >
                                    0 ? (

                                    profile.skills.map(
                                        (
                                            skill
                                        ) => (

                                            <span
                                                key={
                                                    skill.id
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-medium"
                                            >

                                                {skill.name}


                                                <button
                                                    type="button"
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
                                    )

                                ) : (

                                    <p className="text-sm text-gray-500">
                                        No skills added yet.
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            EXPERIENCE
                        ================================================= */}

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-base font-bold text-gray-900">
                                    Internships & Experience
                                </h2>

                                <button
                                    type="button"
                                    onClick={
                                        openAddExperience
                                    }
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

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
                                                className="flex items-start justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                                            >

                                                <div className="flex items-start gap-3">

                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">

                                                        <Building
                                                            size={
                                                                20
                                                            }
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-sm text-gray-900">

                                                            {intern.jobTitle}

                                                        </p>

                                                        <p className="text-xs text-gray-600 mt-1">

                                                            {intern.companyName}

                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">

                                                            {[
                                                                intern.employmentType,

                                                                intern.location,

                                                                intern.startDate &&
                                                                    intern.endDate
                                                                    ? `${formatDate(
                                                                        intern.startDate
                                                                    )} – ${formatDate(
                                                                        intern.endDate
                                                                    )}`
                                                                    : intern.currentlyWorking
                                                                        ? `${formatDate(
                                                                            intern.startDate
                                                                        )} – Present`
                                                                        : intern.startDate
                                                                            ? `From ${formatDate(
                                                                                intern.startDate
                                                                            )}`
                                                                            : "",
                                                            ]
                                                                .filter(
                                                                    Boolean
                                                                )
                                                                .join(
                                                                    " • "
                                                                )}

                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="flex items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditExperience(
                                                                intern
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-blue-600"
                                                        title="Edit experience"
                                                    >
                                                        <Pencil
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteExperience(
                                                                intern.id
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-600"
                                                        title="Delete experience"
                                                    >
                                                        <Trash2
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="text-center py-6">

                                    <Briefcase
                                        size={30}
                                        className="mx-auto text-gray-300 mb-2"
                                    />

                                    <p className="text-sm text-gray-500">
                                        No internships or experience added yet.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            openAddExperience
                                        }
                                        className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                                    >
                                        + Add experience
                                    </button>

                                </div>
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

                                <button
                                    type="button"
                                    onClick={
                                        openAddProject
                                    }
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            <p className="text-xs text-gray-500 mb-5">

                                Talk about your projects that made you proud and contributed to your learnings.

                            </p>


                            {profile.projects.length >
                                0 ? (

                                <div className="space-y-4">

                                    {profile.projects.map(
                                        (
                                            project
                                        ) => (

                                            <div
                                                key={
                                                    project.id
                                                }
                                                className="border border-gray-100 rounded-lg p-4"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <h3 className="font-semibold text-sm text-gray-900">

                                                            {project.title}

                                                        </h3>

                                                        {project.role && (

                                                            <p className="text-xs text-blue-600 mt-1">

                                                                {project.role}

                                                            </p>
                                                        )}

                                                    </div>


                                                    <div className="flex items-center gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditProject(
                                                                    project
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-blue-600"
                                                        >
                                                            <Pencil
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project.id
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-red-600"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>

                                                    </div>

                                                </div>


                                                {project.description && (

                                                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">

                                                        {project.description}

                                                    </p>
                                                )}


                                                {Array.isArray(
                                                    project.technologies
                                                ) &&
                                                    project.technologies.length >
                                                    0 && (

                                                        <div className="flex flex-wrap gap-2 mt-3">

                                                            {project.technologies.map(
                                                                (
                                                                    tech,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-gray-100 rounded text-[11px] text-gray-600"
                                                                    >
                                                                        {
                                                                            tech
                                                                        }
                                                                    </span>
                                                                )
                                                            )}

                                                        </div>
                                                    )}

                                            </div>
                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="text-center py-6">

                                    <Briefcase
                                        size={30}
                                        className="mx-auto text-gray-300 mb-2"
                                    />

                                    <p className="text-sm text-gray-500">
                                        No projects added yet.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            openAddProject
                                        }
                                        className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                                    >
                                        + Add project
                                    </button>

                                </div>
                            )}

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
                                    type="button"
                                    onClick={
                                        openBioEdit
                                    }
                                    className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1"
                                >

                                    {profile.bio ? (
                                        <Pencil
                                            size={14}
                                        />
                                    ) : (
                                        <Plus
                                            size={16}
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

                                    Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for.

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
                                            size={24}
                                            className="text-blue-600"
                                        />

                                        <div>

                                            <p className="text-sm font-semibold text-gray-900">

                                                {getFileName(
                                                    profile.resume
                                                )}

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
                                            href={getAssetUrl(
                                                profile.resume
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-white transition"
                                            title="Download Resume"
                                        >
                                            <Download
                                                size={18}
                                            />
                                        </a>


                                        <button
                                            type="button"
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
                                                    size={18}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <Trash2
                                                    size={18}
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
                                            size={16}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Upload
                                            size={16}
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
                    ACTIVITY
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


            {/* =========================================================
                PERSONAL DETAILS MODAL
            ========================================================= */}

            {editingHeader && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                Edit Personal Details
                            </h3>

                            <button
                                type="button"
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
                            className="space-y-4 text-sm"
                        >

                            {[
                                [
                                    "Full Name",
                                    "name",
                                    "text",
                                ],
                                [
                                    "Degree",
                                    "degree",
                                    "text",
                                ],
                                [
                                    "College / University",
                                    "college",
                                    "text",
                                ],
                                [
                                    "Location",
                                    "location",
                                    "text",
                                ],
                                [
                                    "Gender",
                                    "gender",
                                    "text",
                                ],
                                [
                                    "Phone",
                                    "phone",
                                    "text",
                                ],
                            ].map(
                                ([
                                    label,
                                    field,
                                    type,
                                ]) => (

                                    <div
                                        key={
                                            field
                                        }
                                    >

                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            {label}
                                        </label>

                                        <input
                                            type={
                                                type
                                            }
                                            value={
                                                headerForm[
                                                field
                                                ] ||
                                                ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setHeaderForm(
                                                    {
                                                        ...headerForm,
                                                        [field]:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>
                                )
                            )}


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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Experience Years
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={
                                        headerForm.experienceYears ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                experienceYears:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    LinkedIn URL
                                </label>

                                <input
                                    type="url"
                                    value={
                                        headerForm.linkedinUrl ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                linkedinUrl:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    GitHub URL
                                </label>

                                <input
                                    type="url"
                                    value={
                                        headerForm.githubUrl ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                githubUrl:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Portfolio URL
                                </label>

                                <input
                                    type="url"
                                    value={
                                        headerForm.portfolioUrl ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setHeaderForm(
                                            {
                                                ...headerForm,
                                                portfolioUrl:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="https://yourportfolio.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div className="flex justify-end gap-2 pt-3 border-t">

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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (

                                        <Loader2
                                            size={15}
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


            {/* =========================================================
                CAREER PREFERENCES MODAL
            ========================================================= */}

            {editingPref && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                Edit Career Preferences
                            </h3>

                            <button
                                type="button"
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
                            className="space-y-4 text-sm"
                        >

                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Preferred Job Type
                                </label>

                                <input
                                    type="text"
                                    value={
                                        prefForm.preferredJobType.join(
                                            ", "
                                        )
                                    }
                                    onChange={(e) =>
                                        setPrefForm(
                                            {
                                                ...prefForm,
                                                preferredJobType:
                                                    splitCommaValues(
                                                        e
                                                            .target
                                                            .value
                                                    ),
                                            }
                                        )
                                    }
                                    placeholder="Jobs, Internships"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                                <p className="text-[11px] text-gray-400 mt-1">
                                    Separate multiple values with commas.
                                </p>

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Availability to Work
                                </label>

                                <select
                                    value={
                                        prefForm.availability
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >

                                    <option value="">
                                        Select availability
                                    </option>

                                    <option value="Immediate">
                                        Immediate
                                    </option>

                                    <option value="15 Days">
                                        Within 15 Days
                                    </option>

                                    <option value="30 Days">
                                        Within 30 Days
                                    </option>

                                    <option value="60 Days">
                                        Within 60 Days
                                    </option>

                                    <option value="90 Days">
                                        Within 90 Days
                                    </option>

                                </select>

                            </div>


                            <div>

                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Preferred Location
                                </label>

                                <input
                                    type="text"
                                    value={
                                        prefForm.preferredLocation.join(
                                            ", "
                                        )
                                    }
                                    onChange={(e) =>
                                        setPrefForm(
                                            {
                                                ...prefForm,
                                                preferredLocation:
                                                    splitCommaValues(
                                                        e
                                                            .target
                                                            .value
                                                    ),
                                            }
                                        )
                                    }
                                    placeholder="Gurgaon, Mumbai, Pune"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />

                                <p className="text-[11px] text-gray-400 mt-1">
                                    Separate multiple locations with commas.
                                </p>

                            </div>


                            <div className="flex justify-end gap-2 pt-3 border-t">

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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={15}
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


            {/* =========================================================
                EDUCATION MODAL
            ========================================================= */}

            {showEducationModal && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                {editingEducationId
                                    ? "Edit Education"
                                    : "Add Education"}
                            </h3>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEducationModal(
                                        false
                                    );
                                    resetEducationForm();
                                }}
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleEducationSubmit
                            }
                            className="space-y-4 text-sm"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>

                                    <label className="form-label">
                                        Degree *
                                    </label>

                                    <input
                                        required
                                        value={
                                            educationForm.degree
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    degree:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="B.Tech"
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        Field of Study
                                    </label>

                                    <input
                                        value={
                                            educationForm.fieldOfStudy
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    fieldOfStudy:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="Computer Science"
                                        className="form-input"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="form-label">
                                        Institution *
                                    </label>

                                    <input
                                        required
                                        value={
                                            educationForm.institution
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    institution:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="Banasthali Vidyapith"
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        Location
                                    </label>

                                    <input
                                        value={
                                            educationForm.location
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    location:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="Jaipur"
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        Grade / Percentage
                                    </label>

                                    <input
                                        value={
                                            educationForm.grade
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    grade:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="8.5 CGPA"
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            educationForm.startDate
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    startDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            educationForm.endDate
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    endDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        rows="3"
                                        value={
                                            educationForm.description
                                        }
                                        onChange={(e) =>
                                            setEducationForm(
                                                {
                                                    ...educationForm,
                                                    description:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="Describe your education..."
                                        className="form-input"
                                    />

                                </div>

                            </div>


                            <div className="flex justify-end gap-2 pt-3 border-t">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEducationModal(
                                            false
                                        );
                                        resetEducationForm();
                                    }}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingEducationId
                                        ? "Update"
                                        : "Add Education"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =========================================================
                EXPERIENCE MODAL
            ========================================================= */}

            {showExperienceModal && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                {editingExperienceId
                                    ? "Edit Experience"
                                    : "Add Experience"}
                            </h3>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowExperienceModal(
                                        false
                                    );
                                    resetExperienceForm();
                                }}
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleExperienceSubmit
                            }
                            className="space-y-4 text-sm"
                        >

                            <div>

                                <label className="form-label">
                                    Company Name *
                                </label>

                                <input
                                    required
                                    value={
                                        experienceForm.companyName
                                    }
                                    onChange={(e) =>
                                        setExperienceForm(
                                            {
                                                ...experienceForm,
                                                companyName:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Pratham Software"
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    Job Title *
                                </label>

                                <input
                                    required
                                    value={
                                        experienceForm.jobTitle
                                    }
                                    onChange={(e) =>
                                        setExperienceForm(
                                            {
                                                ...experienceForm,
                                                jobTitle:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Software Developer Intern"
                                    className="form-input"
                                />

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>

                                    <label className="form-label">
                                        Employment Type
                                    </label>

                                    <select
                                        value={
                                            experienceForm.employmentType
                                        }
                                        onChange={(e) =>
                                            setExperienceForm(
                                                {
                                                    ...experienceForm,
                                                    employmentType:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input"
                                    >

                                        <option value="INTERNSHIP">
                                            Internship
                                        </option>

                                        <option value="FULL_TIME">
                                            Full Time
                                        </option>

                                        <option value="PART_TIME">
                                            Part Time
                                        </option>

                                        <option value="CONTRACT">
                                            Contract
                                        </option>

                                        <option value="FREELANCE">
                                            Freelance
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="form-label">
                                        Location
                                    </label>

                                    <input
                                        value={
                                            experienceForm.location
                                        }
                                        onChange={(e) =>
                                            setExperienceForm(
                                                {
                                                    ...experienceForm,
                                                    location:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        placeholder="Remote / Jaipur"
                                        className="form-input"
                                    />

                                </div>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>

                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            experienceForm.startDate
                                        }
                                        onChange={(e) =>
                                            setExperienceForm(
                                                {
                                                    ...experienceForm,
                                                    startDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        disabled={
                                            experienceForm.currentlyWorking
                                        }
                                        value={
                                            experienceForm.endDate
                                        }
                                        onChange={(e) =>
                                            setExperienceForm(
                                                {
                                                    ...experienceForm,
                                                    endDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            <label className="flex items-center gap-2 text-sm text-gray-700">

                                <input
                                    type="checkbox"
                                    checked={
                                        experienceForm.currentlyWorking
                                    }
                                    onChange={(e) =>
                                        setExperienceForm(
                                            {
                                                ...experienceForm,
                                                currentlyWorking:
                                                    e
                                                        .target
                                                        .checked,
                                            }
                                        )
                                    }
                                    className="rounded"
                                />

                                I currently work here

                            </label>


                            <div>

                                <label className="form-label">
                                    Skills
                                </label>

                                <input
                                    value={
                                        Array.isArray(
                                            experienceForm.skills
                                        )
                                            ? experienceForm.skills.join(
                                                ", "
                                            )
                                            : experienceForm.skills
                                    }
                                    onChange={(e) =>
                                        setExperienceForm(
                                            {
                                                ...experienceForm,
                                                skills:
                                                    splitCommaValues(
                                                        e
                                                            .target
                                                            .value
                                                    ),
                                            }
                                        )
                                    }
                                    placeholder="React, JavaScript, Spring Boot"
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        experienceForm.description
                                    }
                                    onChange={(e) =>
                                        setExperienceForm(
                                            {
                                                ...experienceForm,
                                                description:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Describe your responsibilities and achievements..."
                                    className="form-input"
                                />

                            </div>


                            <div className="flex justify-end gap-2 pt-3 border-t">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowExperienceModal(
                                            false
                                        );
                                        resetExperienceForm();
                                    }}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingExperienceId
                                        ? "Update"
                                        : "Add Experience"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =========================================================
                PROJECT MODAL
            ========================================================= */}

            {showProjectModal && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                {editingProjectId
                                    ? "Edit Project"
                                    : "Add Project"}
                            </h3>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowProjectModal(
                                        false
                                    );
                                    resetProjectForm();
                                }}
                            >
                                <X
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleProjectSubmit
                            }
                            className="space-y-4 text-sm"
                        >

                            <div>

                                <label className="form-label">
                                    Project Title *
                                </label>

                                <input
                                    required
                                    value={
                                        projectForm.title
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                title:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="JobBridge"
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    Your Role
                                </label>

                                <input
                                    value={
                                        projectForm.role
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                role:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Full Stack Developer"
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    Technologies
                                </label>

                                <input
                                    value={
                                        Array.isArray(
                                            projectForm.technologies
                                        )
                                            ? projectForm.technologies.join(
                                                ", "
                                            )
                                            : projectForm.technologies
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                technologies:
                                                    splitCommaValues(
                                                        e
                                                            .target
                                                            .value
                                                    ),
                                            }
                                        )
                                    }
                                    placeholder="React, Node.js, MySQL"
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        projectForm.description
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                description:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="Describe your project..."
                                    className="form-input"
                                />

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>

                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            projectForm.startDate
                                        }
                                        onChange={(e) =>
                                            setProjectForm(
                                                {
                                                    ...projectForm,
                                                    startDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input"
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        disabled={
                                            projectForm.currentlyWorking
                                        }
                                        value={
                                            projectForm.endDate
                                        }
                                        onChange={(e) =>
                                            setProjectForm(
                                                {
                                                    ...projectForm,
                                                    endDate:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        className="form-input disabled:bg-gray-100"
                                    />

                                </div>

                            </div>


                            <label className="flex items-center gap-2 text-sm text-gray-700">

                                <input
                                    type="checkbox"
                                    checked={
                                        projectForm.currentlyWorking
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                currentlyWorking:
                                                    e
                                                        .target
                                                        .checked,
                                            }
                                        )
                                    }
                                    className="rounded"
                                />

                                I am currently working on this project

                            </label>


                            <div>

                                <label className="form-label">
                                    Project URL
                                </label>

                                <input
                                    type="url"
                                    value={
                                        projectForm.projectUrl
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                projectUrl:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="https://..."
                                    className="form-input"
                                />

                            </div>


                            <div>

                                <label className="form-label">
                                    GitHub URL
                                </label>

                                <input
                                    type="url"
                                    value={
                                        projectForm.githubUrl
                                    }
                                    onChange={(e) =>
                                        setProjectForm(
                                            {
                                                ...projectForm,
                                                githubUrl:
                                                    e
                                                        .target
                                                        .value,
                                            }
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                    className="form-input"
                                />

                            </div>


                            <div className="flex justify-end gap-2 pt-3 border-t">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProjectModal(
                                            false
                                        );
                                        resetProjectForm();
                                    }}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingProjectId
                                        ? "Update"
                                        : "Add Project"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =========================================================
                PROFILE SUMMARY MODAL
            ========================================================= */}

            {editingBio && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">

                        <div className="flex justify-between items-center border-b pb-3 mb-4">

                            <h3 className="font-bold text-gray-900">
                                Edit Profile Summary
                            </h3>

                            <button
                                type="button"
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
                            className="space-y-4 text-sm"
                        >

                            <textarea
                                rows="7"
                                value={
                                    bioText
                                }
                                onChange={(e) =>
                                    setBioText(
                                        e.target.value
                                    )
                                }
                                placeholder="Write a meaningful professional summary..."
                                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />


                            <div className="flex justify-end gap-2 pt-3 border-t">

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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >

                                    {saving && (
                                        <Loader2
                                            size={15}
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
