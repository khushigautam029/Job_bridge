"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "candidate_educations",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },

                candidate_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,

                    references: {
                        model: "candidate_profiles",
                        key: "id",
                    },

                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },

                degree: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },

                field_of_study: {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                },

                institution: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },

                location: {
                    type: Sequelize.STRING(150),
                    allowNull: true,
                },

                start_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },

                end_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },

                grade: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },

                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },

                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue:
                        Sequelize.literal(
                            "CURRENT_TIMESTAMP"
                        ),
                },

                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue:
                        Sequelize.literal(
                            "CURRENT_TIMESTAMP"
                        ),
                },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(
            "candidate_educations"
        );
    },
};
