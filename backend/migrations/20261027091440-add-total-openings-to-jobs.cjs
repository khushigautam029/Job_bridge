
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("jobs", "total_openings", {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("jobs", "total_openings");
    },
};
