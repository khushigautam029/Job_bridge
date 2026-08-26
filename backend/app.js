import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import candidateSkillRoutes from "./routes/candidateSkillRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobSkillRoutes from "./routes/jobSkillRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Global Middleware
app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/candidates",candidateRoutes);
app.use("/api/skills",skillRoutes);
app.use( "/api/candidates/skills", candidateSkillRoutes );
app.use( "/api/jobs", jobRoutes);
app.use("/api", jobSkillRoutes);
app.use("/api", applicationRoutes);
app.use( "/api", savedJobRoutes);
app.use( "/api",interviewRoutes);

// Error Handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;