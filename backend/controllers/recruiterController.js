import {
    RecruiterProfile,
    User,
} from "../models/index.js";

import asyncHandler from "../utils/asyncHandler.js";
import {
    STATUS_CODES,
} from "../utils/setConstants.js";

const getMyProfile = asyncHandler(async (req, res) => {

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
        return res.status(
            STATUS_CODES.NOT_FOUND
        ).json({
            success: false,
            message: "Recruiter profile not found",
        });
    }

    res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        data: {
            recruiter: recruiterProfile,
        },
    });
});


const updateMyProfile = asyncHandler(async (req, res) => {

    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId: req.user.id,
            },
        });

    if (!recruiterProfile) {
        return res.status(
            STATUS_CODES.NOT_FOUND
        ).json({
            success: false,
            message: "Recruiter profile not found",
        });
    }

    const user = await User.findByPk(
        req.user.id
    );

    await user.update({
        name: req.body.name ?? user.name,
        phone: req.body.phone ?? user.phone,
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

    res.status(
        STATUS_CODES.OK
    ).json({
        success: true,
        message: "Recruiter profile updated successfully",
        data: {
            recruiter: updatedProfile,
        },
    });
});


export {
    getMyProfile,
    updateMyProfile
};
