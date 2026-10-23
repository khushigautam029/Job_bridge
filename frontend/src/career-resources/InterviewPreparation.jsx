
import CareerResourcePage from "./CareerResourcePage";

const resource = {
    title: "Interview Preparation",
    description:
        "Prepare for interviews with a simple plan, clear answers, thoughtful questions, and confidence in your own experience.",
    sections: [
        {
            heading: "1. Research the company and role",
            points: [
                "Read the job description carefully and identify the skills the employer needs.",
                "Understand what the company does and learn about its products or services.",
                "Prepare examples from your projects, internships, coursework, or other relevant experience.",
                "Review the interview format and any instructions shared by the recruiter."
            ]
        },
        {
            heading: "2. Prepare common HR questions",
            points: [
                "Tell me about yourself: give a short introduction about your education, skills, and goals.",
                "Why should we hire you? Connect your relevant strengths to the role.",
                "What is your biggest strength? Give a real example.",
                "What is one area you are improving? Explain what you are doing to improve it.",
                "Why do you want this role? Show how it connects with your interests and skills."
            ],
            example:
                "Tell me about yourself:\n'I am a Computer Science graduate interested in full-stack development. I have worked on projects using React and backend technologies, which helped me understand how web applications work. I am looking for an opportunity to apply my skills and continue learning as a developer.'"
        },
        {
            heading: "3. Explain your projects confidently",
            points: [
                "Start by explaining the problem your project solves.",
                "Describe the main features and the technologies used.",
                "Explain which parts you personally developed.",
                "Prepare to discuss one challenge and how you handled it.",
                "Never claim experience or project work that you did not do."
            ]
        },
        {
            heading: "4. Practice your communication",
            points: [
                "Practice answering questions aloud instead of only reading answers.",
                "Keep answers focused and give examples when possible.",
                "Listen to the full question before answering.",
                "If you do not know something, be honest and explain how you would approach learning it.",
                "Ask the interviewer to repeat or clarify a question when necessary."
            ]
        },
        {
            heading: "5. On the interview day",
            points: [
                "Test your internet, microphone, camera, or travel arrangements in advance.",
                "Keep your resume and relevant project details ready.",
                "Join on time and dress appropriately for the company and interview format.",
                "Prepare two or three thoughtful questions about the role or team.",
                "After the interview, send a short thank-you message when appropriate."
            ]
        }
    ],
    checklist: [
        "Read the job description.",
        "Research the company.",
        "Practice your introduction.",
        "Review your resume and projects.",
        "Prepare questions for the interviewer."
    ]
};

const InterviewPreparation = () => (
    <CareerResourcePage resource={resource} />
);

export default InterviewPreparation;
