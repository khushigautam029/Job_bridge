"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "reset_password_token_hash", {
            type: Sequelize.STRING(64),
            allowNull: true,
        });

        await queryInterface.addColumn("users", "reset_password_expires_at", {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            "users",
            "reset_password_expires_at"
        );

        await queryInterface.removeColumn(
            "users",
            "reset_password_token_hash"
        );
    },
};