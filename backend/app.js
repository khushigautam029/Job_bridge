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
import dashboardRoutes from "./routes/dashboardRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobSkillRoutes from "./routes/jobSkillRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {
    authLimiter,
    generalLimiter,
    loginLimiter,
} from "./utils/rateLimiter.js";

dotenv.config();

const app = express();
app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

// Authentication
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
// Users
app.use("/api/users", userRoutes);
// Recruiters
app.use("/api/recruiters", recruiterRoutes);
// Companies
app.use("/api/companies", companyRoutes);
// Candidates
app.use("/api/candidates", candidateRoutes);
// Skills
app.use("/api/skills", skillRoutes);
// Candidate Skills
app.use("/api/candidates/skills", candidateSkillRoutes);
// Jobs
app.use("/api/jobs", jobRoutes);
// Job Skills
app.use("/api", jobSkillRoutes);
// Applications
app.use("/api", applicationRoutes);
// Saved Jobs
app.use("/api", savedJobRoutes);
// Interviews
app.use("/api", interviewRoutes);
// Notifications
app.use("/api/notifications", notificationRoutes);
// Dashboard
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
