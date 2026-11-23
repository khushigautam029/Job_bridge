
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("application_pass_plans", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            plan_code: {
                type: Sequelize.ENUM(
                    "ONE_DAY",
                    "ONE_MONTH",
                    "SIX_MONTHS"
                ),
                allowNull: false,
                unique: true,
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            duration_days: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "Amount in INR paise",
            },

            currency: {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: "INR",
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
            "application_pass_plans",
            ["is_active"]
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable("application_pass_plans");
    },
};
