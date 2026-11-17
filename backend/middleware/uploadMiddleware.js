
import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDirectory = path.join(
    process.env.AWS_LAMBDA_FUNCTION_NAME
        ? "/tmp"
        : process.cwd(),
    "uploads",
    "resumes"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const fileName = `resume-${req.user.id}-${Date.now()}${extension}`;

        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".pdf",
        ".docx",
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        return cb(
            new Error(
                "Only PDF and DOCX resume files are allowed"
            ),
            false
        );
    }

    cb(null, true);
};

const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).single("resume");

export default uploadResume;
