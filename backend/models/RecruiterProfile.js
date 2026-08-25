import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RecruiterProfile = sequelize.define(
    "RecruiterProfile",
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

        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "company_id",
        },

        designation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
    },
    {
        tableName: "recruiter_profiles",
        timestamps: true,
        underscored: true,
    }
);

export default RecruiterProfile;