import { Op } from "sequelize";
import {
    Application,
    ApplicationStatusHistory,
    AtsAnalysis,
    CandidateEducation,
    CandidateExperience,
    CandidateProfile,
    CandidateProject,
    Company,
    Job,
    JobCategory,
    RecruiterProfile,
    Skill,
    User,
    UserPreference
} from "../models/index.js";
import createNotification from "../utils/createNotification.js";
import {
    sendApplicationConfirmationEmail,
} from "../utils/emailService.js";
import extractResumeText from "../utils/resumeParserService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import calculateAtsScore from "./atsScoringService.js";

const sendApplicationEmails = async ({
    candidateUserId,
    jobTitle,
}) => {
    try {
        const candidate = await User.findByPk(candidateUserId);

        if (candidate?.email) {
            await sendApplicationConfirmationEmail({
                email: candidate.email,
                name: candidate.name,
                jobTitle,
            });
        }
    } catch (error) {
        console.error(
            "Candidate application email failed:",
            error.message
        );
    }
};

/*
    Candidate applies for a job
*/
const applyForJob = async (
    userId,
    jobId,
    data
) => {
    const candidate = await CandidateProfile.findOne({
        where: {
            userId,
        },
    });

    if (!candidate) {
        const error = new Error(
            MESSAGES.PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
        const error = new Error(
            MESSAGES.JOB_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (job.status !== "OPEN") {
        const error = new Error(
            MESSAGES.JOB_NOT_OPEN
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (
        job.applicationDeadline &&
        new Date(job.applicationDeadline) < new Date()
    ) {
        const error = new Error(
            MESSAGES.JOB_DEADLINE_PASSED
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const existingApplication =
        await Application.findOne({
            where: {
                jobId,
                candidateId: candidate.id,
            },
        });

    // Find the recruiter who owns this job.
    const recruiter = await RecruiterProfile.findByPk(
        job.recruiterId
    );

    // Handle reapplication after withdrawal.
    if (existingApplication) {
        if (existingApplication.status === "WITHDRAWN") {
            await existingApplication.update({
                ...data,
                status: "APPLIED",
                appliedAt: new Date(),
            });

            await sendApplicationEmails({
                candidateUserId: userId,
                recruiterUserId: recruiter?.userId,
                jobTitle: job.title,
            });

            if (recruiter) {
                await createNotification({
                    userId: recruiter.userId,
                    title: "New Job Application",
                    message: `A candidate has applied for your job: ${job.title}`,
                    type: "APPLICATION",
                });
            }

            return existingApplication;
        }

        const error = new Error(
            MESSAGES.ALREADY_APPLIED
        );

        error.statusCode = STATUS_CODES.CONFLICT;
        throw error;
    }

    // Create a new application.
    const application = await Application.create({
        jobId,
        candidateId: candidate.id,
        resume: data.resume || null,
        coverLetter: data.coverLetter || null,
        expectedSalary: data.expectedSalary || null,
        noticePeriod: data.noticePeriod || null,
    });

    // Create initial application status history.
    await ApplicationStatusHistory.create({
        applicationId: application.id,
        status: "APPLIED",
        changedBy: userId,
    });

    // Create the recruiter's in-app notification.
    if (recruiter) {
        await createNotification({
            userId: recruiter.userId,
            title: "New Job Application",
            message: `A candidate has applied for your job: ${job.title}`,
            type: "APPLICATION",
        });
    }

    // Send emails to the candidate and recruiter.
    await sendApplicationEmails({
        candidateUserId: userId,
        recruiterUserId: recruiter?.userId,
        jobTitle: job.title,
    });

    return application;
};

// Candidate gets all of their applications
const getMyApplications = async (
    userId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });

    if (!candidate) {
        const error = new Error(
            MESSAGES.PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const applications =
        await Application.findAll({

            where: {
                candidateId: candidate.id,
            },

            include: [
                {
                    model: Job,
                    as: "job",
                    attributes: [
                        "id",
                        "title",
                        "location",
                        "jobType",
                        "workMode",
                        "minSalary",
                        "maxSalary",
                        "status",
                        "description",
                        "requirements",
                        "experienceMin",
                        "experienceMax",
                        "applicationDeadline",
                    ],
                    include: [
                        {
                            model: Company,
                            as: "company",
                            attributes: ["id", "name", "location", "logo"],
                        },
                        {
                            model: JobCategory,
                            as: "category",
                            attributes: ["id", "name"],
                        },
                        {
                            model: Skill,
                            as: "skills",
                            attributes: ["id", "name"],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
                {
                    model: AtsAnalysis,
                    as: "atsAnalysis",
                    attributes: [
                        "score",
                        "matchedSkills",
                        "missingSkills",
                        "matchedKeywords",
                        "missingKeywords",
                        "status",
                        "analyzedAt",
                    ],
                    required: false,
                },
            ],

            order: [["appliedAt", "DESC"]],
        });


    return applications;
};


/*
    Get one application
*/
const getApplicationById = async (
    userId,
    applicationId
) => {

    const application =
        await Application.findByPk(
            applicationId,
            {
                include: [
                    {
                        model: CandidateProfile,
                        as: "candidate",
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: [
                                    "id",
                                    "name",
                                    "email",
                                    "phone",
                                ],
                            },
                        ],
                    },

                    {
                        model: Job,
                        as: "job",

                        include: [
                            {
                                model: RecruiterProfile,
                                as: "recruiter",
                            },
                        ],
                    },
                ],
            }
        );


    if (!application) {
        const error = new Error(
            MESSAGES.APPLICATION_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (
        application.candidate.userId !==
        userId
    ) {

        const recruiterProfile =
            await RecruiterProfile.findOne({
                where: {
                    userId,
                },
            });


        if (
            !recruiterProfile ||
            application.job.recruiterId !==
            recruiterProfile.id
        ) {

            const error = new Error(
                MESSAGES.APPLICATION_NOT_AUTHORIZED
            );

            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error;
        }
    }


    return application;
};

const applyCandidatePrivacySettings = async (applications) => {
    const rows = applications.map((application) => application.toJSON());
    const userIds = rows
        .map((application) => application.candidate?.user?.id)
        .filter(Boolean);
    if (userIds.length === 0) return rows;

    const preferences = await UserPreference.findAll({
        where: { userId: [...new Set(userIds)] },
    });
    const byUserId = new Map(preferences.map((preference) => [
        preference.userId,
        preference,
    ]));

    return rows.map((application) => {
        const candidate = application.candidate;
        const userId = candidate?.user?.id;
        const settings = byUserId.get(userId);
        const privacy = settings?.privacySettings || {};

        if (privacy.profileVisibility === false && candidate) {
            candidate.bio = null;
            candidate.location = null;
            candidate.experienceYears = null;
            candidate.linkedinUrl = null;
            candidate.githubUrl = null;
            candidate.portfolioUrl = null;
            candidate.skills = [];
            candidate.educations = [];
            candidate.experiences = [];
            candidate.projects = [];
            if (candidate.user) {
                candidate.user.name = "Candidate";
                candidate.user.email = null;
                candidate.user.phone = null;
            }
        }
        if (privacy.resumeVisibility === false) {
            application.resume = null;
            if (candidate) candidate.resume = null;
            application.atsAnalysis = null;
        }
        return application;
    });
};


/*
    Candidate withdraws application
*/
const withdrawApplication = async (
    userId,
    applicationId
) => {

    const candidate =
        await CandidateProfile.findOne({
            where: {
                userId,
            },
        });


    if (!candidate) {
        const error = new Error(
            MESSAGES.PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const application =
        await Application.findOne({
            where: {
                id: applicationId,
                candidateId: candidate.id,
            },
        });


    if (!application) {
        const error = new Error(
            MESSAGES.APPLICATION_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    if (
        [
            "SELECTED",
            "REJECTED",
        ].includes(application.status)
    ) {

        const error = new Error(
            MESSAGES.CANNOT_WITHDRAW
        );

        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }


    application.status = "WITHDRAWN";


    await application.save();

    await ApplicationStatusHistory.create({
        applicationId: application.id,
        status: "WITHDRAWN",
        changedBy: userId,
    });


    return application;
};


/*
    Recruiter gets applications
    for their job
*/
const getJobApplications = async (
    userId,
    jobId
) => {

    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });


    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }


    const job = await Job.findOne({
        where: {
            id: jobId,
            recruiterId: recruiter.id,
        },
    });


    if (!job) {
        const error = new Error(
            MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
        );

        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }


    const applications =
        await Application.findAll({

            where: {
                jobId,
            },

            include: [
                {
                    model: Job,
                    as: "job",
                    attributes: ["id", "title", "categoryId"],
                    include: [
                        {
                            model: JobCategory,
                            as: "category",
                            attributes: ["id", "name"],
                        },
                    ],
                },
                {
                    model: CandidateProfile,
                    as: "candidate",

                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "phone",
                            ],
                        },
                        {
                            model: Skill,
                            as: "skills",
                            attributes: ["id", "name"],
                            through: { attributes: [] },
                        },
                        { model: CandidateEducation, as: "educations" },
                        { model: CandidateExperience, as: "experiences" },
                        { model: CandidateProject, as: "projects" },
                    ],
                },
                {
                    model: AtsAnalysis,
                    as: "atsAnalysis",
                    required: false,
                },
            ],

            order: [
                [{ model: AtsAnalysis, as: "atsAnalysis" }, "score", "DESC"],
                ["appliedAt", "DESC"],
            ],
        });


    return applyCandidatePrivacySettings(applications);
};


const getRankedJobApplications = async (
    userId,
    jobId,
    page = 1,
    limit = 20
) => {
    const { count, rows } = await (async () => {
        // 1. Find the logged-in recruiter's profile.
        const recruiter = await RecruiterProfile.findOne({
            where: { userId },
        });

        if (!recruiter) {
            const error = new Error(
                MESSAGES.RECRUITER_PROFILE_NOT_FOUND
            );
            error.statusCode = STATUS_CODES.NOT_FOUND;
            throw error;
        }

        // 2. Verify the recruiter owns this job.
        const job = await Job.findOne({
            where: {
                id: jobId,
                recruiterId: recruiter.id,
            },
        });

        if (!job) {
            const error = new Error(
                MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
            );
            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error;
        }

        // 3. Fetch applications with saved ATS results.
        return Application.findAndCountAll({
            where: { jobId },
            attributes: [
                "id",
                "jobId",
                "candidateId",
                "resume",
                "coverLetter",
                "status",
                "appliedAt",
            ],
            include: [
                {
                    model: CandidateProfile,
                    as: "candidate",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "phone",
                            ],
                            include: [
                                {
                                    model: UserPreference,
                                    as: "preferences",
                                    attributes: [
                                        "privacySettings",
                                    ],
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    model: AtsAnalysis,
                    as: "atsAnalysis",
                    attributes: [
                        "score",
                        "matchedSkills",
                        "missingSkills",
                        "matchedKeywords",
                        "missingKeywords",
                        "breakDown",
                        "status",
                        "errorMessage",
                        "analyzedAt",
                    ],
                    required: false,
                },
            ],
            order: [
                [
                    { model: AtsAnalysis, as: "atsAnalysis" },
                    "score",
                    "DESC",
                ],
                ["appliedAt", "DESC"],
                ["id", "ASC"],
            ],
            limit,
            offset: (page - 1) * limit,
            distinct: true,
        });
    })();

    // 4. Apply the same candidate privacy filtering as the existing API.
    const safeApplications =
        await applyCandidatePrivacySettings(rows);

    // 5. Do not expose ATS details if resume visibility is disabled.
    const applications = safeApplications.map((application) => {
        const candidate = application.candidate;
        const settings =
            candidate?.user?.preferences?.privacySettings || {};

        let privacySettings = settings;

        if (typeof settings === "string") {
            try {
                privacySettings = JSON.parse(settings);
            } catch {
                privacySettings = {};
            }
        }

        const plainApplication =
            typeof application.toJSON === "function"
                ? application.toJSON()
                : { ...application };

        if (privacySettings.resumeVisibility === false) {
            plainApplication.atsAnalysis = null;
        }

        return plainApplication;
    });

    return {
        applications,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};


const getRecruiterApplications = async (userId) => {
    const recruiter =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const applications = await Application.findAll({
        include: [
            {
                model: Job,
                as: "job",
                where: {
                    recruiterId: recruiter.id,
                },
                include: [
                    {
                        model: JobCategory,
                        as: "category",
                        attributes: ["id", "name"],
                    },
                    {
                        model: Company,
                        as: "company",
                        attributes: ["id", "name", "location", "logo"],
                    },
                ],
            },
            {
                model: CandidateProfile,
                as: "candidate",
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "id",
                            "name",
                            "email",
                            "phone",
                        ],
                    },
                    {
                        model: Skill,
                        as: "skills",
                        attributes: ["id", "name"],
                        through: {
                            attributes: [],
                        },
                    },
                    { model: CandidateEducation, as: "educations" },
                    { model: CandidateExperience, as: "experiences" },
                    { model: CandidateProject, as: "projects" },
                ],
            },
            {
                model: AtsAnalysis,
                as: "atsAnalysis",
                required: false,
            },
        ],
        order: [
            [{ model: AtsAnalysis, as: "atsAnalysis" }, "score", "DESC"],
            ["appliedAt", "DESC"],
        ],
    });
    return applyCandidatePrivacySettings(applications);
};


/*
    Recruiter changes application status
*/

/*
    Recruiter changes application status.
    Automatically closes a job when all openings are filled.
*/
const updateApplicationStatus = async (
    userId,
    applicationId,
    status
) => {
    const allowedStatuses = [
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid application status.");
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const recruiter = await RecruiterProfile.findOne({
        where: { userId },
    });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return sequelize.transaction(async (transaction) => {
        // Lock the job row so two simultaneous selections
        // cannot exceed the available openings.
        const application = await Application.findByPk(
            applicationId,
            {
                transaction,
                include: [
                    {
                        model: Job,
                        as: "job",
                    },
                ],
            }
        );

        if (!application) {
            const error = new Error(
                MESSAGES.APPLICATION_NOT_FOUND
            );
            error.statusCode = STATUS_CODES.NOT_FOUND;
            throw error;
        }

        const job = await Job.findByPk(application.jobId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!job || job.recruiterId !== recruiter.id) {
            const error = new Error(
                MESSAGES.NOT_AUTHORIZED_UPDATE
            );
            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error;
        }

        if (application.status === "WITHDRAWN") {
            const error = new Error(
                MESSAGES.WITHDRAWN_CANNOT_UPDATE
            );
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const previousStatus = application.status;

        // Only check capacity when a candidate is newly selected.
        if (
            status === "SELECTED" &&
            previousStatus !== "SELECTED"
        ) {
            const selectedCount = await Application.count({
                where: {
                    jobId: job.id,
                    status: "SELECTED",
                },
                transaction,
            });

            const totalOpenings = Number(job.totalOpenings || 1);

            if (selectedCount >= totalOpenings) {
                const error = new Error(
                    `All ${totalOpenings} openings for this job have already been filled.`
                );
                error.statusCode = STATUS_CODES.BAD_REQUEST;
                throw error;
            }
        }

        // Update the application status.
        application.status = status;
        await application.save({ transaction });

        // Record the status change.
        await ApplicationStatusHistory.create(
            {
                applicationId: application.id,
                status,
                changedBy: userId,
            },
            { transaction }
        );

        // Count selected candidates after the update.
        if (status === "SELECTED") {
            const selectedCount = await Application.count({
                where: {
                    jobId: job.id,
                    status: "SELECTED",
                },
                transaction,
            });

            if (
                selectedCount >= Number(job.totalOpenings || 1) &&
                job.status !== "CLOSED"
            ) {
                job.status = "CLOSED";
                await job.save({ transaction });
            }
        }

        return {
            ...application.toJSON(),
            job: {
                id: job.id,
                title: job.title,
                status: job.status,
                totalOpenings: job.totalOpenings,
            },
        };
    }).then(async (updatedApplication) => {
        // Send the notification after the transaction succeeds.
        const candidate = await CandidateProfile.findByPk(
            updatedApplication.candidateId
        );

        if (candidate) {
            await createNotification({
                userId: candidate.userId,
                title: "Application Status Updated",
                message: `Your application for "${updatedApplication.job.title}" has been moved to ${status}.`,
                type: "APPLICATION",
            });
        }

        return updatedApplication;
    });
};

const getApplicationAtsScore = async (userId, applicationId) => {
    // 1. Find the logged-in recruiter's profile.
    const recruiter = await RecruiterProfile.findOne({
        where: { userId },
    });

    if (!recruiter) {
        const error = new Error(
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    // 2. Load the application, its job, and the job's required skills.
    const application = await Application.findByPk(
        applicationId,
        {
            include: [
                {
                    model: Job,
                    as: "job",
                    include: [
                        {
                            model: Skill,
                            as: "skills",
                            attributes: ["id", "name"],
                            through: { attributes: [] },
                        },
                    ],
                },
                {
                    model: CandidateProfile,
                    as: "candidate",
                },
            ],
        }
    );

    if (!application) {
        const error = new Error( MESSAGES.APPLICATION_NOT_FOUND );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    // 3. Never allow a recruiter to score another recruiter's applicant.
    if (application.job.recruiterId !== recruiter.id) {
        const error = new Error(
            "You are not authorized to access this application."
        );
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    // 4. Respect the candidate's resume privacy setting.
    const preferences = await UserPreference.findOne({
        where: {
            userId: application.candidate.userId,
        },
    });

    const privacySettings =
        preferences?.privacySettings || {};

    if (privacySettings.resumeVisibility === false) {
        const error = new Error(
            "ATS analysis is unavailable because the candidate's resume is hidden."
        );
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    // 5. Use the resume attached to this application only.
    if (!application.resume) {
        const error = new Error(
            "This application does not have an uploaded resume."
        );
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    // 6. Extract resume text and calculate the match score.
    let parsedResume;

    try {
        parsedResume = await extractResumeText(
            application.resume
        );
    } catch {
        const error = new Error(
            "The resume could not be parsed. Check that the file exists and is a supported PDF or DOCX."
        );
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const atsResult = calculateAtsScore({
        resumeText: parsedResume.text,
        job: application.job,
    });


    await AtsAnalysis.upsert({
        applicationId: application.id,
        score: atsResult.score,
        matchedSkills: atsResult.matchedSkills,
        missingSkills: atsResult.missingSkills,
        matchedKeywords: atsResult.matchedKeywords,
        missingKeywords: atsResult.missingKeywords,
        breakDown: atsResult.breakdown,
        status: "COMPLETED",
        errorMessage: null,
        analyzedAt: new Date(),
    });

    return {
        applicationId: application.id,
        jobId: application.job.id,
        jobTitle: application.job.title,
        ats: atsResult,
    };
};


const analyzeJobApplicationsBatch = async (
    userId,
    jobId,
    afterApplicationId = 0
) => {
    const BATCH_SIZE = 50;

    // 1. Verify the logged-in recruiter's profile.
    const recruiter = await RecruiterProfile.findOne({
        where: { userId },
    });

    if (!recruiter) {
        const error = new Error( MESSAGES.RECRUITER_PROFILE_NOT_FOUND );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    // 2. Verify job ownership and load its required skills.
    const job = await Job.findOne({
        where: {
            id: jobId,
            recruiterId: recruiter.id,
        },
        include: [
            {
                model: Skill,
                as: "skills",
                attributes: ["id", "name"],
                through: { attributes: [] },
            },
        ],
    });

    if (!job) {
        const error = new Error(
            "Job not found or you are not authorized to analyze it."
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    // 3. Fetch the next batch, plus one extra row to detect more work.
    const rows = await Application.findAll({
        where: {
            jobId: job.id,
            id: { [Op.gt]: afterApplicationId },
            status: { [Op.notIn]: ["WITHDRAWN", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"] },
        },
        attributes: [
            "id",
            "jobId",
            "candidateId",
            "resume",
        ],
        order: [["id", "ASC"]],
        limit: BATCH_SIZE + 1,
    });

    const hasMore = rows.length > BATCH_SIZE;
    const applications = rows.slice(0, BATCH_SIZE);

    const summary = {
        total: applications.length,
        completed: 0,
        failed: 0,
        skipped: 0,
        results: [],
    };

    // 4. Process each application separately so one failure
    //    doesn't stop the remaining applications.
    for (const application of applications) {
        const result = {
            applicationId: application.id,
            status: "FAILED",
            message: "",
        };

        try {
            // Check that the candidate profile exists.
            const candidate = await CandidateProfile.findByPk(
                application.candidateId
            );

            if (!candidate) {
                throw new Error( MESSAGES.PROFILE_NOT_FOUND );
            }

            // Respect resume privacy settings.
            const preferences = await UserPreference.findOne({
                where: { userId: candidate.userId },
            });

            let privacySettings =
                preferences?.privacySettings || {};

            if (typeof privacySettings === "string") {
                try {
                    privacySettings = JSON.parse(privacySettings);
                } catch {
                    privacySettings = {};
                }
            }

            if (privacySettings.resumeVisibility === false) {
                summary.skipped++;

                result.status = "SKIPPED";
                result.message = "Resume privacy settings prevent analysis.";

                // Record the skipped state without reading the resume.
                await AtsAnalysis.upsert({
                    applicationId: application.id,
                    score: 0,
                    matchedSkills: [],
                    missingSkills: [],
                    matchedKeywords: [],
                    missingKeywords: [],
                    breakDown: {},
                    status: "FAILED",
                    errorMessage: result.message,
                    analyzedAt: null,
                });

                summary.results.push(result);
                continue;
            }

            if (!application.resume) {
                throw new Error(
                    "This application does not have an uploaded resume."
                );
            }

            // Record that analysis has started.
            await AtsAnalysis.upsert({
                applicationId: application.id,
                score: 0,
                matchedSkills: [],
                missingSkills: [],
                matchedKeywords: [],
                missingKeywords: [],
                breakDown: {},
                status: "PROCESSING",
                errorMessage: null,
                analyzedAt: null,
            });

            // Parse the resume attached to this application.
            const parsedResume = await extractResumeText(
                application.resume
            );

            // Calculate the ATS score using the existing scoring service.
            const atsResult = calculateAtsScore({
                resumeText: parsedResume.text,
                job,
            });

            // Save the completed result.
            await AtsAnalysis.upsert({
                applicationId: application.id,
                score: atsResult.score,
                matchedSkills: atsResult.matchedSkills,
                missingSkills: atsResult.missingSkills,
                matchedKeywords: atsResult.matchedKeywords,
                missingKeywords: atsResult.missingKeywords,
                breakDown: atsResult.breakdown,
                status: "COMPLETED",
                errorMessage: null,
                analyzedAt: new Date(),
            });

            summary.completed++;
            result.status = "COMPLETED";
            result.score = atsResult.score;
            result.message = "ATS analysis completed successfully.";
        } catch (error) {
            summary.failed++;

            result.status = "FAILED";
            result.message = error.message || "ATS analysis failed.";

            // Keep the failure so it can be inspected or retried.
            await AtsAnalysis.upsert({
                applicationId: application.id,
                score: 0,
                matchedSkills: [],
                missingSkills: [],
                matchedKeywords: [],
                missingKeywords: [],
                breakDown: {},
                status: "FAILED",
                errorMessage: result.message,
                analyzedAt: null,
            });
        }

        summary.results.push(result);
    }

    const nextCursor = applications.length
        ? applications[applications.length - 1].id
        : afterApplicationId;

    return {
        jobId: job.id,
        jobTitle: job.title,
        batchSize: BATCH_SIZE,
        ...summary,
        nextCursor,
        hasMore,
    };
};


export {
    analyzeJobApplicationsBatch, applyForJob, getApplicationAtsScore, getApplicationById,
    getJobApplications,
    getMyApplications, getRankedJobApplications, getRecruiterApplications, sendApplicationEmails, updateApplicationStatus, withdrawApplication
};

