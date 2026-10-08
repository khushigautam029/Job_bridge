"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "candidate_projects",
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

                title: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },

                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },

                technologies: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },

                project_url: {
                    type: Sequelize.STRING(500),
                    allowNull: true,
                },

                github_url: {
                    type: Sequelize.STRING(500),
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

                currently_working: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                role: {
                    type: Sequelize.STRING(255),
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
            "candidate_projects"
        );
    },
};
