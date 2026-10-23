
import CareerResourcePage from "./CareerResourcePage";

const resource = {
    title: "Fresher's Career Guide",
    description:
        "A practical starting guide for graduates who want to find their first job, gain experience, and build a career step by step.",
    sections: [
        {
            heading: "1. Choose a suitable starting role",
            points: [
                "Explore roles such as junior developer, graduate trainee, QA tester, support engineer, or analyst.",
                "Compare job requirements with your current skills and interests.",
                "Do not reject every opportunity just because you do not meet every listed requirement.",
                "Check the role, learning opportunities, location, and employment terms before applying."
            ]
        },
        {
            heading: "2. Build skills employers can see",
            points: [
                "Choose a learning path rather than trying to learn every technology at once.",
                "Practice programming fundamentals, problem-solving, and the tools required for your target role.",
                "Build small projects that demonstrate what you can do.",
                "Use documentation and practical exercises to strengthen your understanding."
            ],
            example:
                "For a junior full-stack role:\nHTML and CSS → JavaScript → React → Node.js and Express → SQL → Build and deploy a complete project."
        },
        {
            heading: "3. Gain experience through projects",
            points: [
                "Build projects that solve a clear problem instead of only copying tutorials.",
                "Publish suitable code on GitHub with a useful README and setup instructions.",
                "Explain your contribution if a project was developed in a team.",
                "Look for internships, trainee positions, open-source contributions, and relevant practical work."
            ]
        },
        {
            heading: "4. Apply strategically",
            points: [
                "Create a resume suited to the roles you want.",
                "Set up a professional email address and keep your contact information updated.",
                "Use job filters to find suitable entry-level opportunities.",
                "Track applications and follow up professionally when appropriate.",
                "Be cautious of employers asking for money in exchange for a job offer."
            ]
        },
        {
            heading: "5. Create a weekly career routine",
            points: [
                "Spend time learning and practicing your target skills.",
                "Apply to suitable roles rather than sending the same application everywhere.",
                "Practice interview questions and review your project explanations.",
                "Review your progress weekly and improve one area at a time."
            ]
        }
    ],
    checklist: [
        "Chosen a target role.",
        "Updated resume and professional profile.",
        "Completed at least one relevant project.",
        "Practiced basic interview questions.",
        "Started tracking job applications."
    ]
};

const FreshersCareerGuide = () => (
    <CareerResourcePage resource={resource} />
);

export default FreshersCareerGuide;
