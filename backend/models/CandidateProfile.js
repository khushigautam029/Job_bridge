import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidateProfile = sequelize.define(
    "CandidateProfile",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "user_id",
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        profileImage: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "profile_image",
        },

        resume: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        linkedinUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "linkedin_url",
        },

        githubUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "github_url",
        },

        portfolioUrl: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "portfolio_url",
        },

        experienceYears: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: false,
            defaultValue: 0,
            field: "experience_years",
        },
    },
    {
        tableName: "candidate_profiles",
        timestamps: true,
        underscored: true,
    }
);

export default CandidateProfile;