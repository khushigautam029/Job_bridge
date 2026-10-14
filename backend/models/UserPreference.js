import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserPreference = sequelize.define(
    "UserPreference",
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
        notificationSettings: {
            type: DataTypes.JSON,
            allowNull: false,
            field: "notification_settings",
        },
        privacySettings: {
            type: DataTypes.JSON,
            allowNull: false,
            field: "privacy_settings",
        },
    },
    {
        tableName: "user_preferences",
        timestamps: true,
        underscored: true,
    }
);

export default UserPreference;
