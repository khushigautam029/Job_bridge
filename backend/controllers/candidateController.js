import path from "path";
import { fileURLToPath } from "url";
import {
    getCandidateProfile,
    getCandidateProfileCompletion,
    getCandidateResumeForRecruiter,
    updateCandidateProfile,
    uploadCandidateResume,
} from "../services/candidateService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    updateCandidateProfileSchema,
} from "../validation/candidateValidation.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getProfile = asyncHandler(
    async (req, res) => {

        const candidate =
            await getCandidateProfile(
                req.user.id
            );

        res.status(
            STATUS_CODES.OK
        ).json({
            success: true,

            data: {
                candidate,
            },
        });
    }
);


const updateProfile = asyncHandler(
    async (req, res) => {

        const {
            error,
            value,
        } =
            updateCandidateProfileSchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );

        if (error) {

            return res.status(
                STATUS_CODES.BAD_REQUEST
            ).json({
                success: false,

                message:
                    MESSAGES.VALIDATION_FAILED,

                errors:
                    error.details.map(
                        (detail) =>
                            detail.message
                    ),
            });
        }


        const candidate =
            await updateCandidateProfile(
                req.user.id,
                value
            );


        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            message:
                MESSAGES.PROFILE_UPDATED,

            data: {
                candidate,
            },
        });
    }
);


/*
    Upload resume
*/
const uploadResume = asyncHandler(
    async (req, res) => {

        const candidate =
            await uploadCandidateResume(
                req.user.id,
                req.file
            );

        res.status(
            STATUS_CODES.OK
        ).json({

            success: true,

            message:
                "Resume uploaded successfully",

            data: {
                candidate,
            },
        });
    }
);


/*
    Recruiter views/downloads candidate resume
*/
const getCandidateResume = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;

    const resumePath = await getCandidateResumeForRecruiter(
        req.user.id,
        candidateId
    );

    const relativePath = resumePath.replace(/^[/\\]+/, "");

    const filePath = path.join(
        process.cwd(),
        relativePath
    );

    res.sendFile(filePath);
});

/*
    Profile completion
*/
const getProfileCompletion =
    asyncHandler(
        async (req, res) => {

            const completion =
                await getCandidateProfileCompletion(
                    req.user.id
                );

            res.status(
                STATUS_CODES.OK
            ).json({

                success: true,

                message:
                    "Profile completion fetched successfully",

                data: {
                    completion,
                },
            });
        }
    );


export {
    getCandidateResume, getProfile,
    getProfileCompletion,
    updateProfile,
    uploadResume
};
