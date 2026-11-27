"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("applications", "candidate_plan_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "candidate_plans",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        await queryInterface.addIndex(
            "applications",
            ["candidate_plan_id"],
            {
                name: "applications_candidate_plan_id_idx",
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeIndex(
            "applications",
            "applications_candidate_plan_id_idx"
        );

        await queryInterface.removeColumn(
            "applications",
            "candidate_plan_id"
        );
    },
};