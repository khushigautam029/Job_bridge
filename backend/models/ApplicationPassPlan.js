
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ApplicationPassPlan = sequelize.define(
    "ApplicationPassPlan",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        planCode: {
            type: DataTypes.ENUM(
                "ONE_DAY",
                "ONE_MONTH",
                "SIX_MONTHS"
            ),
            allowNull: false,
            unique: true,
            field: "plan_code",
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        durationDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "duration_days",
            validate: {
                min: 1,
            },
        },

        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Amount in INR paise",
            validate: {
                min: 1,
            },
        },

        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: "INR",
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    },
    {
        tableName: "application_pass_plans",
        timestamps: true,
        underscored: true,
    }
);

export default ApplicationPassPlan;
