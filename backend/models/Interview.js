import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Interview = sequelize.define(
    "Interview",
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

        scheduledBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "scheduled_by",
        },

        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "scheduled_at",
        },

        interviewType: {
            type: DataTypes.ENUM(
                "ONLINE",
                "OFFLINE",
                "PHONE"
            ),
            allowNull: false,
            field: "interview_type",
        },

        meetingLink: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "meeting_link",
        },

        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                "SCHEDULED",
                "COMPLETED",
                "CANCELLED",
                "RESCHEDULED"
            ),
            allowNull: false,
            defaultValue: "SCHEDULED",
        },
    },
    {
        tableName: "interviews",
        timestamps: true,
        underscored: true,
    }
);

export default Interview;