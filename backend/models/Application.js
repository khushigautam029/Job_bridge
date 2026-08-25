import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Application = sequelize.define(
    "Application",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "job_id",
        },

        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "candidate_id",
        },

        resume: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        coverLetter: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "cover_letter",
        },

        expectedSalary: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            field: "expected_salary",
        },

        noticePeriod: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Notice period in days",
            field: "notice_period",
        },

        status: {
            type: DataTypes.ENUM(
                "APPLIED",
                "UNDER_REVIEW",
                "SHORTLISTED",
                "INTERVIEW",
                "SELECTED",
                "REJECTED",
                "WITHDRAWN"
            ),
            allowNull: false,
            defaultValue: "APPLIED",
        },

        appliedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "applied_at",
        },
    },
    {
        tableName: "applications",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["job_id", "candidate_id"],
            },
            {
                fields: ["job_id"],
            },
            {
                fields: ["candidate_id"],
            },
            {
                fields: ["status"],
            },
        ],
    }
);

export default Application;