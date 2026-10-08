"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "candidate_experiences",
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

                company_name: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },

                job_title: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },

                employment_type: {
                    type: Sequelize.STRING(50),
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

                currently_working: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },

                skills: {
                    type: Sequelize.JSON,
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
            "candidate_experiences"
        );
    },
};
