
"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = [
            "Software Development",
            "Web Development",
            "Mobile Development",
            "Data Science",
            "Machine Learning",
            "DevOps",
            "UI/UX Design",
            "Database",
            "Cybersecurity",
            "Testing & QA",
            "Product Management",
            "Business & Management",
            "Marketing",
            "Human Resources",
            "Finance",
            "Other",
        ];

        await queryInterface.bulkInsert(
            "job_categories",
            categories.map((name) => ({
                name,
                created_at: new Date(),
                updated_at: new Date(),
            }))
        );
    },

    async down(queryInterface, Sequelize) {
        const categories = [
            "Software Development",
            "Web Development",
            "Mobile Development",
            "Data Science",
            "Machine Learning",
            "DevOps",
            "UI/UX Design",
            "Database",
            "Cybersecurity",
            "Testing & QA",
            "Product Management",
            "Business & Management",
            "Marketing",
            "Human Resources",
            "Finance",
            "Other",
        ];

        await queryInterface.bulkDelete(
            "job_categories",
            {
                name: {
                    [Sequelize.Op.in]: categories,
                },
            }
        );
    },
};
