
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidatePlan = sequelize.define(
    "CandidatePlan",
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

        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "payment_id",
        },

        planId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "plan_id",
        },

        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "start_date",
        },

        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "end_date",
        },

        status: {
            type: DataTypes.ENUM(
                "ACTIVE",
                "EXPIRED",
                "REVOKED"
            ),
            allowNull: false,
            defaultValue: "ACTIVE",
        },
    },
    {
        tableName: "candidate_plans",
        timestamps: true,
        underscored: true,
    }
);

export default CandidatePlan;