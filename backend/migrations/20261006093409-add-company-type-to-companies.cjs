"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("companies", "company_type", {
            type: Sequelize.ENUM("DIRECT", "CONSULTANCY"),
            allowNull: false,
            defaultValue: "DIRECT",
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("companies", "company_type");
    },
};