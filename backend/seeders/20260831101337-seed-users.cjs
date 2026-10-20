"use strict";

const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const candidateEmail = "candidate@jobbridge.com";

        const password = await bcrypt.hash("Password@123", 10);

        await queryInterface.bulkInsert("users", [
            {
                name: "Candidate User",
                email: candidateEmail,
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

        // Candidate endpoints use candidate_profiles.id as their identity.
        // Seed that row alongside the user, just like normal registration.
        const [candidateUsers] = await queryInterface.sequelize.query(
            "SELECT id FROM users WHERE email = :email AND role = 'CANDIDATE'",
            { replacements: { email: candidateEmail } }
        );

        if (candidateUsers.length) {
            await queryInterface.bulkInsert(
                "candidate_profiles",
                candidateUsers.map(({ id }) => ({
                    user_id: id,
                    created_at: now,
                    updated_at: now,
                }))
            );
        }
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
