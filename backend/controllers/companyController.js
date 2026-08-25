import asyncHandler from "../utils/asyncHandler.js";

import {
    getAllCompanies,
    getCompanyById,
    getMyCompany,
    updateMyCompany,
} from "../services/companyService.js";

import {
    updateCompanySchema,
} from "../validation/companyValidation.js";


const getMyCompanyController = asyncHandler(
    async (req, res) => {

        const company = await getMyCompany(
            req.user.id
        );

        res.status(200).json({
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
            return res.status(400).json({
                success: false,
                message: "Validation failed",
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

        res.status(200).json({
            success: true,
            message:
                "Company updated successfully",
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

        res.status(200).json({
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

        res.status(200).json({
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
