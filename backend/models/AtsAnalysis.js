import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AtsAnalysis = sequelize.define(
    "AtsAnalysis",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "applications",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
            },
        },
        matchedSkills: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        missingSkills: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        matchedKeywords: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        missingKeywords: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        breakDown: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            field: "break_down",
        },
        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED"
            ),
            allowNull: false,
            defaultValue: "PENDING",
        },

        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        analyzedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "ats_analyses",
        timestamps: true,
        underscored: true,
    }
);

export default AtsAnalysis;