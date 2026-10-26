import {
    Company,
    Job,
    RecruiterProfile,
} from "../models/index.js";
import { col, fn } from "sequelize";
import { getHiddenCompanyIds } from "../utils/companyVisibility.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";


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
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    if (!recruiterProfile.company) {
        const error = new Error(
           MESSAGES.COMPANY_NOT_FOUND
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
            MESSAGES.RECRUITER_PROFILE_NOT_FOUND
        );

        error.statusCode = STATUS_CODES.NOT_FOUND;

        throw error;
    }

    const company = await Company.findByPk(
        recruiterProfile.companyId
    );

    if (!company) {
        const error = new Error(
            MESSAGES.COMPANY_NOT_FOUND
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
                MESSAGES.COMPANY_NAME_EXISTS
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
    const jobCounts = await Job.findAll({
        attributes: [
            "companyId",
            [fn("COUNT", col("id")), "openJobsCount"],
        ],
        where: { status: "OPEN" },
        group: ["companyId"],
        raw: true,
    });
    const countsByCompanyId = new Map(
        jobCounts.map((entry) => [
            Number(entry.companyId),
            Number(entry.openJobsCount),
        ])
    );
    const hiddenCompanyIds = await getHiddenCompanyIds(companies.map((company) => company.id));
    return companies
        .filter((company) => !hiddenCompanyIds.has(company.id))
        .map((company) => ({
            ...company.toJSON(),
            openJobsCount: countsByCompanyId.get(company.id) || 0,
        }));
};


const getCompanyById = async (companyId) => {
    const company = await Company.findByPk(
        companyId
    );
    if (!company) {
        const error = new Error(
            MESSAGES.COMPANY_NOT_FOUND
        );
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    const hiddenCompanyIds = await getHiddenCompanyIds([company.id]);
    if (hiddenCompanyIds.has(company.id)) {
        const error = new Error("Company not found");
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
