
import extractResumeText from "./utils/resumeParserService.js";

const testResume = async () => {
    try {
        const resumePath = process.argv[2];

        if (!resumePath) {
            console.log(
                'Usage: node testResumeParser.js "your-resume.pdf"'
            );
            return;
        }

        const result = await extractResumeText(resumePath);

        console.log("\nResume parsing successful!");
        console.log("File name:", result.fileName);
        console.log("File type:", result.fileType);
        console.log("Character count:", result.characterCount);
        console.log("\nExtracted resume text:\n");
        console.log(result.text);
    } catch (error) {
        console.error("Resume parsing failed:", error.message);
    }
};

testResume();
