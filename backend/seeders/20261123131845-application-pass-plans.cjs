
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "application_pass_plans",
            [
                {
                    plan_code: "ONE_DAY",
                    name: "1 Day Pass",
                    duration_days: 1,
                    amount: 4900,
                    currency: "INR",
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    plan_code: "ONE_MONTH",
                    name: "1 Month Pass",
                    duration_days: 30,
                    amount: 29900,
                    currency: "INR",
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    plan_code: "SIX_MONTHS",
                    name: "6 Months Pass",
                    duration_days: 180,
                    amount: 49900,
                    currency: "INR",
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            "application_pass_plans",
            {
                plan_code: {
                    [Sequelize.Op.in]: [
                        "ONE_DAY",
                        "ONE_MONTH",
                        "SIX_MONTHS",
                    ],
                },
            }
        );
    },
};