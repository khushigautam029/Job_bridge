import asyncHandler from "../utils/asyncHandler.js";

import {
    getCandidateDashboard,
    getRecruiterDashboard,
} from "../services/dashboardService.js";


/*
    Candidate Dashboard
*/

const getCandidateDashboardController =
    asyncHandler(async (req, res) => {

        const dashboard =
            await getCandidateDashboard(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: dashboard,

        });

    });


/*
    Recruiter Dashboard
*/

const getRecruiterDashboardController =
    asyncHandler(async (req, res) => {

        const dashboard =
            await getRecruiterDashboard(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: dashboard,

        });

    });


export {
    getCandidateDashboardController,
    getRecruiterDashboardController
};
