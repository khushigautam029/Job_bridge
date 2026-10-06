import {
    RecruiterProfile,
    User,
} from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

const getMyProfile = asyncHandler(
    async (req, res) => {
        const recruiterProfile =
            await RecruiterProfile.findOne({
                where: {
                    userId: req.user.id,
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
        if (!recruiterProfile) {
            return sendError(
                res,
                STATUS_CODES.NOT_FOUND,
                MESSAGES.RECRUITER_PROFILE_NOT_FOUND
            );
        }
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.RECRUITER_PROFILE_FETCHED,
            {
                recruiter: recruiterProfile,
            }
        );
    }
);


const updateMyProfile = asyncHandler(
    async (req, res) => {

        const recruiterProfile =
            await RecruiterProfile.findOne({
                where: {
                    userId: req.user.id,
                },
            });

        if (!recruiterProfile) {
            return sendError(
                res,
                STATUS_CODES.NOT_FOUND,
                MESSAGES.RECRUITER_PROFILE_NOT_FOUND
            );
        }

        const user = await User.findByPk(
            req.user.id
        );

        await user.update({
            name:
                req.body.name ??
                user.name,

            phone:
                req.body.phone ??
                user.phone,
        });

        await recruiterProfile.update({
            designation:
                req.body.designation ??
                recruiterProfile.designation,

            phone:
                req.body.phone ??
                recruiterProfile.phone,
        });

        const updatedProfile =
            await RecruiterProfile.findOne({
                where: {
                    userId: req.user.id,
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

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.RECRUITER_PROFILE_UPDATED,
            {
                recruiter: updatedProfile,
            }
        );
    }
);


export {
    getMyProfile,
    updateMyProfile
};

