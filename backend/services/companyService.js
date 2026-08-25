import {
    Company,
    RecruiterProfile,
} from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";


const getMyCompany = async (userId) => {

    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
            include: [
                {
                    model: Company,
                    as: "company",
                },
            ],
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    if (!recruiterProfile.company) {
        const error = new Error(
            "Company not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return recruiterProfile.company;
};


const updateMyCompany = async (
    userId,
    data
) => {

    const recruiterProfile =
        await RecruiterProfile.findOne({
            where: {
                userId,
            },
        });

    if (!recruiterProfile) {
        const error = new Error(
            "Recruiter profile not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    const company = await Company.findByPk(
        recruiterProfile.companyId
    );

    if (!company) {
        const error = new Error(
            "Company not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    if (
        data.name &&
        data.name !== company.name
    ) {
        const existingCompany =
            await Company.findOne({
                where: {
                    name: data.name,
                },
            });

        if (existingCompany) {
            const error = new Error(
                "Company name already exists"
            );

            error.statusCode = STATUS_CODES.CONFLICT;

            throw error;
        }
    }

    await company.update(data);

    return company;
};


const getAllCompanies = async () => {

    const companies = await Company.findAll({
        order: [
            ["createdAt", "DESC"],
        ],
    });

    return companies;
};


const getCompanyById = async (companyId) => {

    const company = await Company.findByPk(
        companyId
    );

    if (!company) {
        const error = new Error(
            "Company not found"
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    return company;
};


export {
    getAllCompanies,
    getCompanyById, getMyCompany,
    updateMyCompany
};
