import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDirectory = "uploads/profile-images";

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
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const fileName = `profile-${req.user.id}-${Date.now()}${extension}`;

        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        return cb(
            new Error(
                "Only JPG, JPEG, PNG, and WEBP image files are allowed"
            ),
            false
        );
    }

    cb(null, true);
};

const uploadProfileImage = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 2 * 1024 * 1024,
    },
}).single("profileImage");

export default uploadProfileImage;
