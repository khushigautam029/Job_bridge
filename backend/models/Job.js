import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Job = sequelize.define(
    "Job",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        recruiterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "recruiter_id",
        },

        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "company_id",
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "category_id",
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        requirements: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        responsibilities: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },

        jobType: {
            type: DataTypes.ENUM(
                "FULL_TIME",
                "PART_TIME",
                "INTERNSHIP",
                "CONTRACT",
                "FREELANCE"
            ),
            allowNull: false,
            field: "job_type",
        },

        workMode: {
            type: DataTypes.ENUM(
                "REMOTE",
                "ONSITE",
                "HYBRID"
            ),
            allowNull: false,
            field: "work_mode",
        },

        minSalary: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            field: "min_salary",
        },

        maxSalary: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            field: "max_salary",
        },

        experienceMin: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: false,
            defaultValue: 0,
            field: "experience_min",
        },

        experienceMax: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: true,
            field: "experience_max",
        },

        applicationDeadline: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "application_deadline",
        },

        status: {
            type: DataTypes.ENUM(
                "DRAFT",
                "OPEN",
                "CLOSED"
            ),
            allowNull: false,
            defaultValue: "DRAFT",
        },
    },
    {
        tableName: "jobs",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                fields: ["title"],
            },
            {
                fields: ["location"],
            },
            {
                fields: ["category_id"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["job_type"],
            },
            {
                fields: ["work_mode"],
            },
        ],
    }
);

export default Job;