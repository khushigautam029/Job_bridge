"use strict";

const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        const password = await bcrypt.hash("Password@123", 10);

        await queryInterface.bulkInsert("users", [
            {
                name: "Candidate User",
                email: "candidate@jobbridge.com",
                password,
                role: "CANDIDATE",
                created_at: now,
                updated_at: now,
            },
            {
                name: "Recruiter User",
                email: "recruiter@jobbridge.com",
                password,
                role: "RECRUITER",
                created_at: now,
                updated_at: now,
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            "users",
            {
                email: [
                    "candidate@jobbridge.com",
                    "recruiter@jobbridge.com",
                ],
            },
            {}
        );
    },
};
