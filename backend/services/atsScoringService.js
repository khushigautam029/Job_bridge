const normalizeText = (value = "") =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

const containsPhrase = (text, phrase) => {
    const normalizedPhrase = normalizeText(phrase);

    if (!normalizedPhrase) {
        return false;
    }

    const escapedPhrase = normalizedPhrase.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedPhrase}($|[^a-z0-9])`,
        "i"
    );

    return pattern.test(text);
};

const getSkillName = (skill) => {
    if (typeof skill === "string") {
        return skill.trim();
    }

    if (skill && typeof skill === "object") {
        return (
            skill.name ||
            skill.skillName ||
            skill.title ||
            ""
        ).trim();
    }

    return "";
};

const STOP_WORDS = new Set([
    "and", "the", "for", "with", "from", "that",
    "this", "are", "will", "you", "your", "our",
    "have", "has", "had", "using", "use", "used",
    "work", "working", "experience", "years",
    "year", "knowledge", "ability", "strong",
    "good", "required", "requirements", "must",
    "should", "candidate", "developer", "job",
    "role", "responsibilities", "preferred",
    "including", "such", "their", "them", "who",
    "what", "how", "all", "any", "able", "be",
    "in", "on", "at", "to", "of", "a", "an",
    "is", "as", "or", "by", "it"
]);

const extractKeywords = (requirements) => {
    const text = Array.isArray(requirements)
        ? requirements.join(" ")
        : String(requirements || "");

    return [
        ...new Set(
            normalizeText(text)
                .replace(/[^a-z0-9+#.]/g, " ")
                .split(/\s+/)
                .filter(
                    (word) =>
                        word.length > 1 &&
                        !STOP_WORDS.has(word)
                )
        ),
    ];
};

const calculateAtsScore = ({ resumeText, job }) => {
    if (!resumeText || !job) {
        throw new Error(
            "Both resumeText and job are required."
        );
    }

    const resume = normalizeText(resumeText);

    const jobSkills = [
        ...new Set(
            (job.skills || [])
                .map(getSkillName)
                .filter(Boolean)
        ),
    ];

    const matchedSkills = jobSkills.filter((skill) =>
        containsPhrase(resume, skill)
    );

    const missingSkills = jobSkills.filter(
        (skill) => !matchedSkills.includes(skill)
    );

    const requirements = [
        job.requirements || "",
    ];

    const keywords = extractKeywords(requirements);

    const matchedKeywords = keywords.filter((keyword) =>
        containsPhrase(resume, keyword)
    );

    const missingKeywords = keywords.filter(
        (keyword) => !matchedKeywords.includes(keyword)
    );

    const skillScore = jobSkills.length
        ? (matchedSkills.length / jobSkills.length) * 70
        : 0;

    const keywordScore = keywords.length
        ? (matchedKeywords.length / keywords.length) *
        (jobSkills.length ? 30 : 100)
        : jobSkills.length
            ? 30
            : 0;

    const score = Math.round(
        Math.min(100, skillScore + keywordScore)
    );

    return {
        score,
        matchedSkills,
        missingSkills,
        matchedKeywords,
        missingKeywords,
        breakdown: {
            skills: jobSkills.length
                ? Math.round(skillScore)
                : null,
            requirements: keywords.length
                ? Math.round(keywordScore)
                : null,
        },
    };
};

export default calculateAtsScore;
