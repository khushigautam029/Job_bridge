
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MockInterviewReport = sequelize.define(
    "MockInterviewReport",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        mockInterviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "mock_interview_id",
        },

        technicalScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: "technical_score",
        },

        communicationScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: "communication_score",
        },

        relevanceScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: "relevance_score",
        },

        completenessScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: "completeness_score",
        },

        overallFeedback: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "overall_feedback",
        },

        strengths: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        weaknesses: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        improvementSuggestions: {
            type: DataTypes.JSON,
            allowNull: true,
            field: "improvement_suggestions",
        },
    },
    {
        tableName: "mock_interview_reports",
        timestamps: true,
        underscored: true,
    }
);

export default MockInterviewReport;
