import fs from "fs/promises";
import mammoth from "mammoth";
import path from "path";
import { PDFParse } from "pdf-parse";

const RESUME_DIRECTORY = path.resolve(
    process.cwd(),
    "uploads",
    "resumes"
);

const extractResumeText = async(resumePath) => {
    if (!resumePath || typeof resumePath !== "string"){
        throw new error("Resume path is required.");
    }

    const fileName = path.basename(resumePath);
    const extension = path.extname(fileName).toLowerCase();

    if (![".pdf" , ".docx"].includes(extension)){
        throw new Error(
            "ATS currently supports PDF and DOCX resumes only."
        );
    }
    
    const filePath = path.join(
        RESUME_DIRECTORY,
        fileName
    );

    const fileBuffer = await fs.readFile(filePath);

    if (fileBuffer.length === 0){
        throw new Error("The resume file is empty.");
    }

    let extractedText = "";

    if (extension === ".pdf"){
        const parser = new PDFParse({
            data: new Uint8Array(fileBuffer),
        });
        try{
            const result = await parser.getText();
            extractedText = result.text || "";
        }finally{
            await parser.destroy();
        }
    }

    if (extension === ".docx"){
        const result = await mammoth.extractRawText({
            buffer: fileBuffer,
        });
        extractedText = result.value || "";
    }

    extractedText = extractedText
        .replace(/\u0000/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!extractedText) {
        throw new Error(
            "No readable text was found in the resume. " +
            "The file may be scanned or contain no extractable text."
        );
    }

    return {
        fileName,
        fileType: extension.slice(1),
        text: extractedText,
        characterCount: extractedText.length,
    };
};

export default extractResumeText;