
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payments", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "application_pass_plans",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "Payment amount in paise",
            },

            currency: {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: "INR",
            },

            stripe_session_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
                unique: true,
            },

            stripe_payment_intent_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "PENDING",
                    "SUCCESS",
                    "FAILED",
                    "CANCELLED",
                    "REFUNDED"
                ),
                allowNull: false,
                defaultValue: "PENDING",
            },

            paid_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });

        await queryInterface.addIndex(
            "payments",
            ["user_id"]
        );

        await queryInterface.addIndex(
            "payments",
            ["plan_id"]
        );

        await queryInterface.addIndex(
            "payments",
            ["status"]
        );

        await queryInterface.addIndex(
            "payments",
            ["stripe_payment_intent_id"]
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable("payments");
    },
};