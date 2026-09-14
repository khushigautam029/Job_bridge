import {
    Application,
    CandidateProfile,
    Job,
    RecruiterProfile,
    User,
} from "../models/index.js";

import { STATUS_CODES } from "../utils/setConstants.js";


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

    await candidateProfile.update(data);

    return getCandidateProfile(userId);
};


/*
    Upload candidate resume
*/
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

    return getCandidateProfile(userId);
};


/*
    Recruiter views candidate resume

    Recruiter can access the resume only when
    the candidate has applied to one of the
    recruiter's jobs.
*/
const getCandidateResumeForRecruiter = async (userId, candidateId) => {
    const recruiter = await RecruiterProfile.findOne({
        where: { userId },
    });

    if (!recruiter) {
        const error = new Error("Recruiter profile not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const candidate = await CandidateProfile.findByPk(candidateId);

    if (!candidate) {
        const error = new Error("Candidate not found");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const application = await Application.findOne({
        where: {
            candidateId,
        },
        include: [
            {
                model: Job,
                as: "job",
                where: {
                    recruiterId: recruiter.id,
                },
                attributes: ["id", "title"],
            },
        ],
        order: [["appliedAt", "DESC"]],
    });

    if (!application) {
        const error = new Error(
            "You are not authorized to view this candidate's resume"
        );
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }
    const resumePath = candidate.resume;

    if (!resumePath) {
        const error = new Error("Candidate has not uploaded a resume");
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return resumePath;
};

/*
    Calculate candidate profile completion
*/
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


    const fields = [
        {
            name: "name",
            value: candidateProfile.user?.name,
        },

        {
            name: "location",
            value: candidateProfile.location,
        },

        {
            name: "bio",
            value: candidateProfile.bio,
        },

        {
            name: "profileImage",
            value: candidateProfile.profileImage,
        },

        {
            name: "resume",
            value: candidateProfile.resume,
        },

        {
            name: "linkedinUrl",
            value: candidateProfile.linkedinUrl,
        },

        {
            name: "githubUrl",
            value: candidateProfile.githubUrl,
        },

        {
            name: "portfolioUrl",
            value: candidateProfile.portfolioUrl,
        },

        {
            name: "experienceYears",
            value: candidateProfile.experienceYears,
        },
    ];


    const completedFields =
        fields.filter(
            (field) =>
                field.value !== null &&
                field.value !== undefined &&
                field.value !== ""
        );


    const totalFields = fields.length;

    const completedCount =
        completedFields.length;


    const percentage = Math.round(
        (completedCount / totalFields) * 100
    );


    return {
        percentage,
        completedFields: completedCount,
        totalFields,
        remainingFields: fields
            .filter(
                (field) =>
                    field.value === null ||
                    field.value === undefined ||
                    field.value === ""
            )
            .map(
                (field) => field.name
            ),
    };
};


export {
    getCandidateProfile,
    getCandidateProfileCompletion, getCandidateResumeForRecruiter, updateCandidateProfile,
    uploadCandidateResume
};
