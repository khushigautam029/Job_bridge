
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MockInterview = sequelize.define(
    "MockInterview",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "candidate_id",
        },

        jobId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "job_id",
        },

        jobRole: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "job_role",
        },

        interviewType: {
            type: DataTypes.ENUM("TECHNICAL", "HR", "MIXED"),
            allowNull: false,
            field: "interview_type",
        },

        difficulty: {
            type: DataTypes.ENUM("EASY", "MEDIUM", "HARD"),
            allowNull: false,
            defaultValue: "MEDIUM",
        },

        totalQuestions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "total_questions",
        },

        status: {
            type: DataTypes.ENUM(
                "IN_PROGRESS",
                "COMPLETED",
                "CANCELLED"
            ),
            allowNull: false,
            defaultValue: "IN_PROGRESS",
        },

        overallScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: "overall_score",
        },

        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "started_at",
        },

        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "completed_at",
        },
    },
    {
        tableName: "mock_interviews",
        timestamps: true,
        underscored: true,
    }
);

export default MockInterview;
