import {
    getCandidateDashboard,
    getRecruiterDashboard,
} from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

// Candidate Dashboard
const getCandidateDashboardController =
    asyncHandler(async (req, res) => {
        const dashboard =
            await getCandidateDashboard(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CANDIDATE_DASHBOARD_FETCHED,
            dashboard
        );
    });

// Recruiter Dashboard
const getRecruiterDashboardController =
    asyncHandler(async (req, res) => {
        const dashboard =
            await getRecruiterDashboard(
                req.user.id
            );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.RECRUITER_DASHBOARD_FETCHED,
            dashboard
        );
    });

export {
    getCandidateDashboardController,
    getRecruiterDashboardController
};
