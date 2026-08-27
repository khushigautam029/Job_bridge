import {
    getCandidateDashboard,
    getRecruiterDashboard,
} from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { STATUS_CODES } from "../utils/setConstants.js";

// Candidate Dashboard
const getCandidateDashboardController =
    asyncHandler(async (req, res) => {
        const dashboard =
            await getCandidateDashboard(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: dashboard,
        });
    });

//  Recruiter Dashboard
const getRecruiterDashboardController =
    asyncHandler(async (req, res) => {
        const dashboard =
            await getRecruiterDashboard(
                req.user.id
            );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: dashboard,
        });
    });

export {
    getCandidateDashboardController,
    getRecruiterDashboardController
};
