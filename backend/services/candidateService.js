import {
    Application,
    CandidateProfile,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";

import { STATUS_CODES } from "../utils/setConstants.js";


// ======================================================
// PROFILE COMPLETION HELPER
// ======================================================

const isFieldCompleted = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return false;
    }

    // For preferred job type/location arrays
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return true;
};


const calculateProfileCompletion = (candidateProfile) => {
    const fields = [
        candidateProfile.user?.name,
        candidateProfile.location,
        candidateProfile.degree,
        candidateProfile.college,
        candidateProfile.gender,
        candidateProfile.dob,
        candidateProfile.bio,
        candidateProfile.profileImage,
        candidateProfile.resume,
        candidateProfile.linkedinUrl,
        candidateProfile.githubUrl,
        candidateProfile.portfolioUrl,
        candidateProfile.experienceYears,
        candidateProfile.preferredJobType,
        candidateProfile.preferredLocation,
        candidateProfile.availability,
    ];

    const completedFields = fields.filter(
        isFieldCompleted
    );

    const totalFields = fields.length;

    const completedCount = completedFields.length;

    const percentage = Math.round(
        (completedCount / totalFields) * 100
    );

    return {
        percentage,
        completedFields: completedCount,
        totalFields,
    };
};


// ======================================================
// GET CANDIDATE PROFILE
// ======================================================

const getCandidateProfile = async (userId) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "phone",
                        "role",
                    ],
                },
            ],
        });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return candidateProfile;
};


// ======================================================
// UPDATE CANDIDATE PROFILE
// ======================================================

const updateCandidateProfile = async (
    userId,
    data
) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error(
            "User not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    // ==================================================
    // UPDATE USERS TABLE
    // ==================================================

    await user.update({
        name:
            data.name !== undefined
                ? data.name
                : user.name,

        phone:
            data.phone !== undefined
                ? data.phone
                : user.phone,
    });


    // ==================================================
    // UPDATE CANDIDATE_PROFILES TABLE
    // ==================================================

    const candidateData = {
        location: data.location,
        bio: data.bio,
        profileImage: data.profileImage,

        linkedinUrl:
            data.linkedinUrl,

        githubUrl:
            data.githubUrl,

        portfolioUrl:
            data.portfolioUrl,

        experienceYears:
            data.experienceYears,

        degree:
            data.degree,

        college:
            data.college,

        gender:
            data.gender,

        dob:
            data.dob,

        preferredJobType:
            data.preferredJobType,

        preferredLocation:
            data.preferredLocation,

        availability:
            data.availability,
    };


    // Remove undefined values
    Object.keys(candidateData).forEach(
        (key) => {
            if (
                candidateData[key] ===
                undefined
            ) {
                delete candidateData[key];
            }
        }
    );


    await candidateProfile.update(
        candidateData
    );


    // ==================================================
    // RECALCULATE PROFILE COMPLETION
    // ==================================================

    const updatedProfile =
        await getCandidateProfile(userId);

    const completion =
        calculateProfileCompletion(
            updatedProfile
        );


    // Save percentage in database
    await candidateProfile.update({
        profileCompletionPercentage:
            completion.percentage,
    });


    // Return latest profile
    return getCandidateProfile(userId);
};


// ======================================================
// UPLOAD CANDIDATE RESUME
// ======================================================

const uploadCandidateResume = async (
    userId,
    file
) => {
    if (!file) {
        const error = new Error(
            "Resume file is required"
        );

        error.statusCode =
            STATUS_CODES.BAD_REQUEST;

        throw error;
    }


    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const resumePath =
        `/uploads/resumes/${file.filename}`;


    await candidateProfile.update({
        resume: resumePath,
    });


    // ==================================================
    // RECALCULATE PROFILE COMPLETION AFTER RESUME
    // ==================================================

    const updatedProfile =
        await getCandidateProfile(userId);

    const completion =
        calculateProfileCompletion(
            updatedProfile
        );


    await candidateProfile.update({
        profileCompletionPercentage:
            completion.percentage,
    });


    return getCandidateProfile(userId);
};


// ======================================================
// GET CANDIDATE RESUME FOR RECRUITER
// ======================================================

const getCandidateResumeForRecruiter = async (
    userId,
    candidateId
) => {
    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const candidate =
        await CandidateProfile.findByPk(
            candidateId
        );

    if (!candidate) {
        const error = new Error(
            "Candidate not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const application =
        await Application.findOne({
            where: {
                candidateId,
            },

            include: [
                {
                    model: Job,
                    as: "job",

                    where: {
                        recruiterId:
                            recruiter.id,
                    },

                    attributes: [
                        "id",
                        "title",
                    ],
                },
            ],

            order: [
                ["appliedAt", "DESC"],
            ],
        });


    if (!application) {
        const error = new Error(
            "You are not authorized to view this candidate's resume"
        );

        error.statusCode =
            STATUS_CODES.FORBIDDEN;

        throw error;
    }


    const resumePath =
        candidate.resume;


    if (!resumePath) {
        const error = new Error(
            "Candidate has not uploaded a resume"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    return resumePath;
};


// ======================================================
// GET PROFILE COMPLETION
// ======================================================

const getCandidateProfileCompletion = async (
    userId
) => {
    const candidateProfile =
        await CandidateProfile.findOne({
            where: {
                userId,
            },

            include: [
                {
                    model: User,
                    as: "user",

                    attributes: [
                        "name",
                        "email",
                        "phone",
                    ],
                },
            ],
        });


    if (!candidateProfile) {
        const error = new Error(
            "Candidate profile not found"
        );

        error.statusCode =
            STATUS_CODES.NOT_FOUND;

        throw error;
    }


    const completion =
        calculateProfileCompletion(
            candidateProfile
        );


    // Keep database value synchronized
    if (
        candidateProfile
            .profileCompletionPercentage !==
        completion.percentage
    ) {
        await candidateProfile.update({
            profileCompletionPercentage:
                completion.percentage,
        });
    }


    const fields = [
        {
            name: "name",
            value:
                candidateProfile.user?.name,
        },

        {
            name: "location",
            value:
                candidateProfile.location,
        },

        {
            name: "degree",
            value:
                candidateProfile.degree,
        },

        {
            name: "college",
            value:
                candidateProfile.college,
        },

        {
            name: "gender",
            value:
                candidateProfile.gender,
        },

        {
            name: "dob",
            value:
                candidateProfile.dob,
        },

        {
            name: "bio",
            value:
                candidateProfile.bio,
        },

        {
            name: "profileImage",
            value:
                candidateProfile.profileImage,
        },

        {
            name: "resume",
            value:
                candidateProfile.resume,
        },

        {
            name: "linkedinUrl",
            value:
                candidateProfile.linkedinUrl,
        },

        {
            name: "githubUrl",
            value:
                candidateProfile.githubUrl,
        },

        {
            name: "portfolioUrl",
            value:
                candidateProfile.portfolioUrl,
        },

        {
            name: "experienceYears",
            value:
                candidateProfile.experienceYears,
        },

        {
            name: "preferredJobType",
            value:
                candidateProfile.preferredJobType,
        },

        {
            name: "preferredLocation",
            value:
                candidateProfile.preferredLocation,
        },

        {
            name: "availability",
            value:
                candidateProfile.availability,
        },
    ];


    const completedFields =
        fields.filter(
            (field) =>
                isFieldCompleted(
                    field.value
                )
        );


    const remainingFields =
        fields
            .filter(
                (field) =>
                    !isFieldCompleted(
                        field.value
                    )
            )
            .map(
                (field) =>
                    field.name
            );


    return {
        percentage:
            completion.percentage,

        completedFields:
            completedFields.length,

        totalFields:
            fields.length,

        remainingFields,
    };
};


export {
    getCandidateProfile,
    getCandidateProfileCompletion,
    getCandidateResumeForRecruiter,
    updateCandidateProfile,
    uploadCandidateResume
};

