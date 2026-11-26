
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("payments", "refund_amount", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: "Refund amount in paise",
        });

        await queryInterface.addColumn("payments", "refund_status", {
            type: Sequelize.ENUM(
                "NOT_REQUESTED",
                "PENDING",
                "SUCCESS",
                "FAILED"
            ),
            allowNull: false,
            defaultValue: "NOT_REQUESTED",
        });

        await queryInterface.addColumn("payments", "stripe_refund_id", {
            type: Sequelize.STRING(255),
            allowNull: true,
        });

        await queryInterface.addColumn("payments", "refunded_at", {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("payments", "refunded_at");
        await queryInterface.removeColumn("payments", "stripe_refund_id");
        await queryInterface.removeColumn("payments", "refund_status");
        await queryInterface.removeColumn("payments", "refund_amount");
    },
};