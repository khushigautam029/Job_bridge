
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("candidate_plans", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            payment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: "payments",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "application_pass_plans",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            end_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM(
                    "ACTIVE",
                    "EXPIRED",
                    "REVOKED"
                ),
                allowNull: false,
                defaultValue: "ACTIVE",
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
            "candidate_plans",
            ["user_id"]
        );

        await queryInterface.addIndex(
            "candidate_plans",
            ["status", "end_date"]
        );

        await queryInterface.addIndex(
            "candidate_plans",
            ["plan_id"]
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable("candidate_plans");
    },
};