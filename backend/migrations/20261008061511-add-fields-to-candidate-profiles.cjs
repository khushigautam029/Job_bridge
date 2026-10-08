"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "candidate_profiles",
            "degree",
            {
                type: Sequelize.STRING(255),
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "college",
            {
                type: Sequelize.STRING(255),
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "gender",
            {
                type: Sequelize.STRING(50),
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "dob",
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "preferred_job_type",
            {
                type: Sequelize.JSON,
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "preferred_location",
            {
                type: Sequelize.JSON,
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "availability",
            {
                type: Sequelize.STRING(100),
                allowNull: true,
            }
        );

        await queryInterface.addColumn(
            "candidate_profiles",
            "profile_completion_percentage",
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            "candidate_profiles",
            "profile_completion_percentage"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "availability"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "preferred_location"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "preferred_job_type"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "dob"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "gender"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "college"
        );

        await queryInterface.removeColumn(
            "candidate_profiles",
            "degree"
        );
    },
};
