
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MockInterviewQuestion = sequelize.define(
    "MockInterviewQuestion",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        mockInterviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "mock_interview_id",
        },

        question: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        questionType: {
            type: DataTypes.ENUM(
                "TECHNICAL",
                "HR",
                "BEHAVIORAL"
            ),
            allowNull: false,
            field: "question_type",
        },

        questionOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "question_order",
        },

        candidateAnswer: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "candidate_answer",
        },

        score: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },

        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        strengths: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        improvements: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        tableName: "mock_interview_questions",
        timestamps: true,
        underscored: true,
    }
);

export default MockInterviewQuestion;
