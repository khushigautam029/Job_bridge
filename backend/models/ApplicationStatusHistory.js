import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ApplicationStatusHistory = sequelize.define(
    "ApplicationStatusHistory",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "application_id",
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
        },

        changedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "changed_by",
        },
    },
    {
        tableName: "application_status_history",
        timestamps: true,
        updatedAt: false,
        underscored: true,
    }
);

export default ApplicationStatusHistory;