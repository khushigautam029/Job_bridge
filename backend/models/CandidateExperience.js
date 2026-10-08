import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidateExperience =
    sequelize.define(
        "CandidateExperience",
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

            companyName: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: "company_name",
            },

            jobTitle: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: "job_title",
            },

            employmentType: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: "employment_type",
            },

            location: {
                type: DataTypes.STRING(150),
                allowNull: true,
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

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            skills: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            tableName:
                "candidate_experiences",

            timestamps: true,

            underscored: true,
        }
    );


export default CandidateExperience;
