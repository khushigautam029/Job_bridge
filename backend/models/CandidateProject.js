import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidateProject = sequelize.define(
    "CandidateProject",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "candidate_id",
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        technologies: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        projectUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "project_url",
        },

        githubUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "github_url",
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "start_date",
        },

        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "end_date",
        },

        currentlyWorking: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "currently_working",
        },

        role: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: "candidate_projects",
        timestamps: true,
        underscored: true,
    }
);

export default CandidateProject;
