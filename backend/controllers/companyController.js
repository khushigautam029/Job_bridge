import {
    getAllCompanies,
    getCompanyById,
    getMyCompany,
    updateMyCompany,
} from "../services/companyService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";
import {
    updateCompanySchema,
} from "../validation/companyValidation.js";

// Get My Company
const getMyCompanyController = asyncHandler(
    async (req, res) => {
        const company =
            await getMyCompany(
                req.user.id
            );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.MY_COMPANY_FETCHED,
            {
                company,
            }
        );
    }
);

// Update My Company
const updateMyCompanyController = asyncHandler(
        async (req, res) => {
            const {
                error,
                value,
            } = updateCompanySchema.validate(
                req.body,
                {
                    abortEarly: false,
                    stripUnknown: true,
                }
            );
            if (error) {
                return sendError(
                    res,
                    STATUS_CODES.BAD_REQUEST,
                    MESSAGES.VALIDATION_FAILED,
                    error.details.map(
                        (detail) => detail.message
                    )
                );
            }

            const company =
                await updateMyCompany(
                    req.user.id,
                    value
                );

            return sendSuccess(
                res,
                STATUS_CODES.OK,
                MESSAGES.COMPANY_UPDATED,
                {
                    company,
                }
            );
        }
);

// Get All Companies
const getCompanies = asyncHandler(
    async (req, res) => {
        const companies =
            await getAllCompanies();
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.COMPANIES_FETCHED,
            {
                companies,
            }
        );
    }
);

// Get Company By ID
const getCompany = asyncHandler(
    async (req, res) => {
        const company =
            await getCompanyById(
                req.params.id
            );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.COMPANY_FETCHED,
            {
                company,
            }
        );
    }
);

export {
    getCompanies,
    getCompany,
    getMyCompanyController,
    updateMyCompanyController
};
