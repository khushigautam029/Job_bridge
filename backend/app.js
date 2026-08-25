import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middleware/errorMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
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

// Error Handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;