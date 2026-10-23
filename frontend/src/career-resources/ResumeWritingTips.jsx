
import CareerResourcePage from "./CareerResourcePage";

const resource = {
    title: "Resume Writing Tips",
    description:
        "Create a clear, professional resume that helps recruiters understand your skills, projects, education, and potential.",
    sections: [
        {
            heading: "1. Keep your resume clear and organized",
            intro: "For most freshers, a focused one-page resume is a good starting point.",
            points: [
                "Add your name, phone number, professional email, and relevant portfolio or LinkedIn links.",
                "Use clear headings such as Education, Skills, Projects, Internships, and Certifications.",
                "Choose a readable font and keep spacing, dates, and heading styles consistent.",
                "Avoid unnecessary personal details, decorative graphics, and long paragraphs."
            ]
        },
        {
            heading: "2. Write a useful professional summary",
            points: [
                "Mention your degree or current role, strongest relevant skills, and the type of job you want.",
                "Keep the summary specific to the position you are applying for.",
                "Avoid unsupported claims such as 'best developer' or 'expert in everything'."
            ],
            example:
                "Computer Science graduate with hands-on experience in React, Node.js, and MySQL through academic projects. Interested in a junior full-stack developer role."
        },
        {
            heading: "3. Present your projects properly",
            points: [
                "Explain what the project does and which problem it solves.",
                "Mention the technologies you actually used.",
                "Describe your personal contribution, not only what the team built.",
                "Add a working GitHub repository or live demo when available.",
                "Be prepared to explain your code, decisions, and challenges."
            ],
            example:
                "Job Portal — React, Node.js, Express, MySQL\nBuilt job search and application features, with separate dashboards for candidates and recruiters."
        },
        {
            heading: "4. Show skills honestly",
            points: [
                "List programming languages, frameworks, databases, and tools relevant to the role.",
                "Separate technical skills from communication or teamwork skills.",
                "Do not list a technology simply because it appears in the job description.",
                "Prioritize skills you can explain and demonstrate in an interview."
            ]
        },
        {
            heading: "5. Check before applying",
            points: [
                "Correct spelling, grammar, email address, links, and dates.",
                "Use a professional file name, such as YourName_Resume.pdf.",
                "Keep formatting simple so applicant tracking systems can read the text.",
                "Tailor your resume to the requirements of each suitable job."
            ]
        }
    ],
    checklist: [
        "Contact details are correct.",
        "Skills match the jobs you want.",
        "Projects explain your contribution.",
        "No spelling or grammar mistakes.",
        "Resume is saved as a PDF."
    ]
};

const ResumeWritingTips = () => (
    <CareerResourcePage resource={resource} />
);

export default ResumeWritingTips;
