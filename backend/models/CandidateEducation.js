import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidateEducation =
    sequelize.define(
        "CandidateEducation",
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

            degree: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            fieldOfStudy: {
                type: DataTypes.STRING(255),
                allowNull: true,
                field: "field_of_study",
            },

            institution: {
                type: DataTypes.STRING(255),
                allowNull: false,
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

            grade: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },

        {
            tableName:
                "candidate_educations",

            timestamps: true,

            underscored: true,
        }
    );


export default CandidateEducation;
