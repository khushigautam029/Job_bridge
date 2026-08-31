const jobsData = [
    // =========================================================
    // SOFTWARE DEVELOPMENT
    // =========================================================

    {
        id: 1,
        title: "Senior React Developer",
        company: "TechNova Solutions",
        category: "Software Development",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹8L - ₹14L",
        experience: "3 - 5 Years",
        posted: "2 days ago",
        skills: ["React", "JavaScript", "Node.js"],
        description:
            "We are looking for a Senior React Developer to build scalable and modern web applications.",
    },

    {
        id: 2,
        title: "Backend Developer",
        company: "CloudCore Technologies",
        category: "Software Development",
        location: "Bangalore, India",
        type: "Full Time",
        salary: "₹7L - ₹12L",
        experience: "2 - 4 Years",
        posted: "1 day ago",
        skills: ["Node.js", "Express", "MySQL"],
        description:
            "Join our backend team to develop secure and scalable APIs and services.",
    },

    {
        id: 3,
        title: "Full Stack Developer",
        company: "InnovateTech",
        category: "Software Development",
        location: "Hyderabad, India",
        type: "Full Time",
        salary: "₹9L - ₹16L",
        experience: "3 - 6 Years",
        posted: "3 days ago",
        skills: ["React", "Node.js", "MySQL"],
        description:
            "Work on end-to-end web applications using modern frontend and backend technologies.",
    },

    {
        id: 4,
        title: "Junior Software Developer",
        company: "CodeWorks",
        category: "Software Development",
        location: "Pune, India",
        type: "Full Time",
        salary: "₹4L - ₹7L",
        experience: "0 - 2 Years",
        posted: "4 days ago",
        skills: ["JavaScript", "React", "Git"],
        description:
            "Great opportunity for developers starting their professional software development career.",
    },

    // =========================================================
    // DESIGN
    // =========================================================

    {
        id: 5,
        title: "UI/UX Designer",
        company: "Creative Labs",
        category: "Design",
        location: "Remote",
        type: "Full Time",
        salary: "₹5L - ₹9L",
        experience: "2 - 4 Years",
        posted: "3 days ago",
        skills: ["Figma", "UI Design", "UX"],
        description:
            "Design intuitive and engaging digital experiences for web and mobile products.",
    },

    {
        id: 6,
        title: "Product Designer",
        company: "PixelWorks",
        category: "Design",
        location: "Mumbai, India",
        type: "Full Time",
        salary: "₹7L - ₹11L",
        experience: "3 - 5 Years",
        posted: "2 days ago",
        skills: ["Figma", "Prototyping", "Design Systems"],
        description:
            "Create user-centered product experiences and scalable design systems.",
    },

    {
        id: 7,
        title: "Graphic Designer",
        company: "BrandStudio",
        category: "Design",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹4L - ₹7L",
        experience: "1 - 3 Years",
        posted: "5 days ago",
        skills: ["Photoshop", "Illustrator", "Canva"],
        description:
            "Create creative visual content for digital marketing campaigns and brand communication.",
    },

    // =========================================================
    // MARKETING
    // =========================================================

    {
        id: 8,
        title: "Digital Marketing Executive",
        company: "GrowthHub",
        category: "Marketing",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹4L - ₹7L",
        experience: "1 - 3 Years",
        posted: "1 day ago",
        skills: ["SEO", "Google Ads", "Social Media"],
        description:
            "Plan and execute digital marketing campaigns to increase brand awareness and growth.",
    },

    {
        id: 9,
        title: "SEO Specialist",
        company: "MarketPro",
        category: "Marketing",
        location: "Remote",
        type: "Full Time",
        salary: "₹5L - ₹8L",
        experience: "2 - 4 Years",
        posted: "3 days ago",
        skills: ["SEO", "Analytics", "Keyword Research"],
        description:
            "Improve search visibility and organic traffic through effective SEO strategies.",
    },

    {
        id: 10,
        title: "Content Marketing Manager",
        company: "BrandConnect",
        category: "Marketing",
        location: "Bangalore, India",
        type: "Full Time",
        salary: "₹7L - ₹12L",
        experience: "3 - 5 Years",
        posted: "4 days ago",
        skills: ["Content Strategy", "SEO", "Copywriting"],
        description:
            "Lead content strategies that drive engagement, traffic, and business growth.",
    },

    // =========================================================
    // FINANCE
    // =========================================================

    {
        id: 11,
        title: "Financial Analyst",
        company: "FinCore",
        category: "Finance",
        location: "Mumbai, India",
        type: "Full Time",
        salary: "₹6L - ₹10L",
        experience: "2 - 4 Years",
        posted: "2 days ago",
        skills: ["Excel", "Financial Analysis", "Reporting"],
        description:
            "Analyze financial data and provide insights to support business decisions.",
    },

    {
        id: 12,
        title: "Accountant",
        company: "Prime Finance",
        category: "Finance",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹4L - ₹7L",
        experience: "1 - 3 Years",
        posted: "5 days ago",
        skills: ["Accounting", "Tally", "Excel"],
        description:
            "Manage financial records, accounts, and day-to-day accounting activities.",
    },

    // =========================================================
    // HUMAN RESOURCES
    // =========================================================

    {
        id: 13,
        title: "HR Executive",
        company: "PeopleFirst",
        category: "Human Resources",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹4L - ₹7L",
        experience: "1 - 3 Years",
        posted: "2 days ago",
        skills: ["Recruitment", "HR Operations", "Communication"],
        description:
            "Manage recruitment activities and support employees throughout their journey.",
    },

    {
        id: 14,
        title: "Talent Acquisition Specialist",
        company: "TalentBridge",
        category: "Human Resources",
        location: "Bangalore, India",
        type: "Full Time",
        salary: "₹6L - ₹10L",
        experience: "2 - 5 Years",
        posted: "4 days ago",
        skills: ["Recruitment", "Hiring", "Interviewing"],
        description:
            "Identify, attract, and hire talented professionals for growing teams.",
    },

    // =========================================================
    // SALES
    // =========================================================

    {
        id: 15,
        title: "Sales Executive",
        company: "SalesPro",
        category: "Sales",
        location: "Delhi, India",
        type: "Full Time",
        salary: "₹4L - ₹8L",
        experience: "1 - 3 Years",
        posted: "1 day ago",
        skills: ["Sales", "Communication", "CRM"],
        description:
            "Build customer relationships and drive sales through effective communication.",
    },

    {
        id: 16,
        title: "Business Development Executive",
        company: "GrowthWorks",
        category: "Sales",
        location: "Noida, India",
        type: "Full Time",
        salary: "₹5L - ₹9L",
        experience: "1 - 4 Years",
        posted: "3 days ago",
        skills: ["Business Development", "Sales", "Negotiation"],
        description:
            "Identify new business opportunities and build strong client relationships.",
    },
];

export default jobsData;

