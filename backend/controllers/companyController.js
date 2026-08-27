import {
    getAllCompanies,
    getCompanyById,
    getMyCompany,
    updateMyCompany,
} from "../services/companyService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import {
    updateCompanySchema,
} from "../validation/companyValidation.js";

const getMyCompanyController = asyncHandler(
    async (req, res) => {
        const company = await getMyCompany(
            req.user.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                company,
            },
        });
    }
);


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
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }

        const company =
            await updateMyCompany(
                req.user.id,
                value
            );

        res.status(STATUS_CODES.OK).json({
            success: true,
            message:MESSAGES.COMPANY_UPDATED,
            data: {
                company,
            },
        });
    }
);


const getCompanies = asyncHandler(
    async (req, res) => {

        const companies =
            await getAllCompanies();

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                companies,
            },
        });
    }
);


const getCompany = asyncHandler(
    async (req, res) => {

        const company =
            await getCompanyById(
                req.params.id
            );

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
                company,
            },
        });
    }
);


export {
    getCompanies,
    getCompany, getMyCompanyController,
    updateMyCompanyController
};
