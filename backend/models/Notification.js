import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM(
                "APPLICATION",
                "INTERVIEW",
                "JOB",
                "SYSTEM",
                "SUCCESS",
                "WARNING"
            ),
            allowNull: false,
            defaultValue: "SYSTEM",
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_read",
        },
    },
    {
        tableName: "notifications",
        timestamps: true,
        updatedAt: false,
        underscored: true,

        indexes: [
            {
                fields: ["user_id"],
            },
            {
                fields: ["is_read"],
            },
        ],
    }
);

export default Notification;