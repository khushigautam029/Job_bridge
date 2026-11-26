
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Payment = sequelize.define(
    "Payment",
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

        planId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "plan_id",
        },

        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Payment amount in paise",
        },

        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: "INR",
        },

        stripeSessionId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
            field: "stripe_session_id",
        },

        stripePaymentIntentId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "stripe_payment_intent_id",
        },

        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "SUCCESS",
                "FAILED",
                "CANCELLED",
                "REFUNDED"
            ),
            allowNull: false,
            defaultValue: "PENDING",
        },

        // Refund details
        refundAmount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: "refund_amount",
            comment: "Refund amount in paise",
        },

        refundStatus: {
            type: DataTypes.ENUM(
                "NOT_REQUESTED",
                "PENDING",
                "SUCCESS",
                "FAILED"
            ),
            allowNull: false,
            defaultValue: "NOT_REQUESTED",
            field: "refund_status",
        },

        stripeRefundId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "stripe_refund_id",
        },

        refundedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "refunded_at",
        },

        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "paid_at",
        },
    },
    {
        tableName: "payments",
        timestamps: true,
        underscored: true,
    }
);

export default Payment;
