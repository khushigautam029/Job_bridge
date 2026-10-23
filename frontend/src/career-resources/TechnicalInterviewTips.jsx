
import CareerResourcePage from "./CareerResourcePage";

const resource = {
    title: "Technical Interview Tips",
    description:
        "Prepare for technical interviews by strengthening programming fundamentals, practicing problem-solving, and learning to explain your projects clearly.",
    sections: [
        {
            heading: "1. Strengthen programming fundamentals",
            points: [
                "Practice variables, loops, conditions, functions, arrays, strings, and basic recursion.",
                "Understand object-oriented programming concepts such as encapsulation, inheritance, abstraction, and polymorphism.",
                "Practice solving problems in the language you plan to use during the interview.",
                "Focus on understanding solutions instead of memorizing code."
            ]
        },
        {
            heading: "2. Practice data structures and algorithms",
            points: [
                "Start with arrays, strings, searching, sorting, and hash maps.",
                "Move on to linked lists, stacks, queues, trees, and other topics relevant to your target role.",
                "Explain your approach before writing code.",
                "Test your solution with normal cases, edge cases, and empty inputs.",
                "Practice discussing the time and space your solution uses."
            ],
            example:
                "For a problem asking you to find a target in an array:\n1. Clarify the input and expected output.\n2. Explain your approach.\n3. Write the solution.\n4. Test it with an example.\n5. Discuss its time and space complexity."
        },
        {
            heading: "3. Review DBMS and SQL",
            points: [
                "Understand tables, primary keys, foreign keys, and relationships.",
                "Practice SELECT, WHERE, ORDER BY, GROUP BY, and JOIN queries.",
                "Learn normalization, indexes, and basic transaction concepts.",
                "Be able to explain how your project stores and retrieves data."
            ]
        },
        {
            heading: "4. Understand web development concepts",
            points: [
                "For frontend roles, review HTML, CSS, JavaScript, React components, props, state, and effects.",
                "For backend roles, review APIs, HTTP methods, status codes, validation, and error handling.",
                "Understand how the frontend communicates with the backend.",
                "Review authentication basics and how your application handles user data.",
                "Prepare to explain your database design and important project decisions."
            ]
        },
        {
            heading: "5. Practice project-based questions",
            points: [
                "Explain your project architecture in simple terms.",
                "Describe the hardest bug or challenge you encountered.",
                "Explain how you tested your work and handled errors.",
                "Be ready to discuss improvements you would make with more time.",
                "Do not include confidential company code or information in your explanation."
            ]
        },
        {
            heading: "6. During a coding interview",
            points: [
                "Ask clarifying questions if the problem is unclear.",
                "Think aloud so the interviewer can understand your reasoning.",
                "Start with a straightforward solution and improve it when possible.",
                "Check boundary cases and explain any assumptions.",
                "If stuck, explain what you have tried and ask a focused question."
            ]
        }
    ],
    checklist: [
        "Practiced coding problems.",
        "Reviewed OOP concepts.",
        "Practiced common SQL queries.",
        "Can explain one or two projects.",
        "Can discuss approach and complexity."
    ]
};

const TechnicalInterviewTips = () => (
    <CareerResourcePage resource={resource} />
);

export default TechnicalInterviewTips;
