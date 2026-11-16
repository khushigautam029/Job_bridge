
import {
    CandidateProfile,
    Job,
    MockInterview,
    MockInterviewQuestion,
    MockInterviewReport,
} from "../models/index.js";

import {
    evaluateMockInterviewAnswer,
    generateMockInterviewQuestions,
    generateMockInterviewReport,
} from "../utils/mockInterviewService.js";

// Helper: Get the logged-in candidate's profile
const getCandidateProfile = async (userId) => {
    return await CandidateProfile.findOne({
        where: { userId },
    });
};

// Helper: Find an interview belonging to the logged-in candidate
const getCandidateInterview = async (interviewId, candidateId) => {
    return await MockInterview.findOne({
        where: {
            id: interviewId,
            candidateId,
        },
    });
};

// 1. CREATE MOCK INTERVIEW
export const createMockInterview = async (req, res) => {
    try {
        const {
            jobId,
            jobRole,
            interviewType,
            difficulty = "MEDIUM",
            totalQuestions = 5,
        } = req.body;

        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const allowedTypes = ["TECHNICAL", "HR", "MIXED"];
        const allowedDifficulties = ["EASY", "MEDIUM", "HARD"];
        const allowedQuestionCounts = [5, 10, 15];

        if (!allowedTypes.includes(interviewType)) {
            return res.status(400).json({
                message: "Invalid interview type",
            });
        }

        if (!allowedDifficulties.includes(difficulty)) {
            return res.status(400).json({
                message: "Invalid interview difficulty",
            });
        }

        if (!allowedQuestionCounts.includes(Number(totalQuestions))) {
            return res.status(400).json({
                message: "Total questions must be 5, 10 or 15",
            });
        }

        let selectedJob = null;
        let finalJobRole = jobRole?.trim();

        // If the candidate selects an existing JobBridge job
        if (jobId) {
            selectedJob = await Job.findByPk(jobId);

            if (!selectedJob) {
                return res.status(404).json({
                    message: "Selected job not found",
                });
            }

            if (selectedJob.status !== "OPEN") {
                return res.status(400).json({
                    message: "This job is not currently open",
                });
            }

            // Use the actual job title instead of trusting user input
            finalJobRole = selectedJob.title;
        }

        if (!finalJobRole) {
            return res.status(400).json({
                message: "Please provide a job role",
            });
        }

        const mockInterview = await MockInterview.create({
            candidateId: candidate.id,
            jobId: selectedJob ? selectedJob.id : null,
            jobRole: finalJobRole,
            interviewType,
            difficulty,
            totalQuestions: Number(totalQuestions),
        });

        return res.status(201).json({
            message: "Mock interview created successfully",
            interview: mockInterview,
        });

    } catch (error) {
        console.error("Create mock interview error:", error);

        return res.status(500).json({
            message: "Failed to create mock interview",
        });
    }
};

// 2. GET CANDIDATE'S MOCK INTERVIEW HISTORY
export const getMockInterviews = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interviews = await MockInterview.findAll({
            where: {
                candidateId: candidate.id,
            },
            include: [
                {
                    model: MockInterviewReport,
                    as: "report",
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Mock interview history fetched successfully",
            interviews,
        });

    } catch (error) {
        console.error("Get mock interviews error:", error);

        return res.status(500).json({
            message: "Failed to fetch mock interview history",
        });
    }
};

// 3. GET MOCK INTERVIEW DETAILS
export const getMockInterviewById = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interview = await MockInterview.findOne({
            where: {
                id: req.params.id,
                candidateId: candidate.id,
            },
            include: [
                {
                    model: MockInterviewQuestion,
                    as: "questions",
                },
                {
                    model: MockInterviewReport,
                    as: "report",
                },
                {
                    model: Job,
                    as: "job",
                    attributes: ["id", "title", "location", "jobType"],
                },
            ],
        });

        if (!interview) {
            return res.status(404).json({
                message: "Mock interview not found",
            });
        }

        return res.status(200).json({
            message: "Mock interview details fetched successfully",
            interview,
        });

    } catch (error) {
        console.error("Get mock interview details error:", error);

        return res.status(500).json({
            message: "Failed to fetch mock interview details",
        });
    }
};

// 4. START MOCK INTERVIEW AND GENERATE QUESTIONS
export const startMockInterview = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Mock interview not found",
            });
        }

        if (interview.status !== "IN_PROGRESS") {
            return res.status(400).json({
                message: "This interview cannot be started",
            });
        }

        // Prevent generating duplicate questions
        const existingQuestions = await MockInterviewQuestion.count({
            where: {
                mockInterviewId: interview.id,
            },
        });

        if (existingQuestions > 0) {
            return res.status(400).json({
                message: "Interview questions have already been generated",
            });
        }

        let jobDescription = "";

        if (interview.jobId) {
            const job = await Job.findByPk(interview.jobId);

            if (job) {
                jobDescription = job.description || "";
            }
        }

        // Generate questions using Gemini
        const questions = await generateMockInterviewQuestions({
            jobRole: interview.jobRole,
            interviewType: interview.interviewType,
            difficulty: interview.difficulty,
            totalQuestions: interview.totalQuestions,
            jobDescription,
        });

        // Save generated questions in MySQL
        const questionRecords = await MockInterviewQuestion.bulkCreate(
            questions.map((item, index) => ({
                mockInterviewId: interview.id,
                question: item.question,
                questionType: item.questionType,
                questionOrder: index + 1,
            }))
        );

        interview.startedAt = new Date();
        await interview.save();

        return res.status(200).json({
            message: "Mock interview started successfully",
            questions: questionRecords,
        });

    } catch (error) {
        console.error("Start mock interview error:", error);

        return res.status(500).json({
            message: "Failed to start mock interview",
        });
    }
};

// 5. SUBMIT AND EVALUATE CANDIDATE ANSWER
export const submitMockInterviewAnswer = async (req, res) => {
    try {
        const { questionId, answer } = req.body;

        if (
            typeof answer !== "string" ||
            !answer.trim() ||
            answer.length > 10000
        ) {
            return res.status(400).json({
                message: "Answer is required and must not exceed 10000 characters",
            });
        }

        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Mock interview not found",
            });
        }

        if (interview.status !== "IN_PROGRESS" || !interview.startedAt) {
            return res.status(400).json({
                message: "This interview has not been started or is already completed",
            });
        }

        const question = await MockInterviewQuestion.findOne({
            where: {
                id: questionId,
                mockInterviewId: interview.id,
            },
        });

        if (!question) {
            return res.status(404).json({
                message: "Interview question not found",
            });
        }

        if (question.candidateAnswer !== null) {
            return res.status(400).json({
                message: "This question has already been answered",
            });
        }

        // Evaluate the answer using Gemini
        const evaluation = await evaluateMockInterviewAnswer({
            jobRole: interview.jobRole,
            interviewType: interview.interviewType,
            difficulty: interview.difficulty,
            question: question.question,
            answer: answer.trim(),
        });

        question.candidateAnswer = answer.trim();
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;
        question.strengths = evaluation.strengths;
        question.improvements = evaluation.improvements;

        await question.save();

        return res.status(200).json({
            message: "Answer submitted and evaluated successfully",
            evaluation,
        });

    } catch (error) {
        console.error("Submit mock interview answer error:", error);

        return res.status(500).json({
            message: "Failed to submit and evaluate answer",
        });
    }
};

// 6. COMPLETE MOCK INTERVIEW AND GENERATE REPORT
export const completeMockInterview = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Mock interview not found",
            });
        }

        if (interview.status === "COMPLETED") {
            return res.status(400).json({
                message: "This interview has already been completed",
            });
        }

        if (!interview.startedAt) {
            return res.status(400).json({
                message: "Please start the interview first",
            });
        }

        const questions = await MockInterviewQuestion.findAll({
            where: {
                mockInterviewId: interview.id,
            },
            order: [["questionOrder", "ASC"]],
        });

        if (questions.length !== interview.totalQuestions) {
            return res.status(400).json({
                message: "Interview questions are incomplete",
            });
        }

        // Check whether every question has been answered
        const unansweredQuestions = questions.filter(
            (question) => question.candidateAnswer === null
        );

        if (unansweredQuestions.length > 0) {
            return res.status(400).json({
                message: "Please answer all interview questions before completing",
                unansweredCount: unansweredQuestions.length,
            });
        }

        const evaluations = questions.map((question) => ({
            question: question.question,
            answer: question.candidateAnswer,
            score: Number(question.score),
            feedback: question.feedback,
            strengths: question.strengths,
            improvements: question.improvements,
        }));

        // Generate final performance report using Gemini
        const reportData = await generateMockInterviewReport({
            jobRole: interview.jobRole,
            interviewType: interview.interviewType,
            difficulty: interview.difficulty,
            evaluations,
        });

        // Save final report
        const report = await MockInterviewReport.create({
            mockInterviewId: interview.id,
            technicalScore: reportData.technicalScore,
            communicationScore: reportData.communicationScore,
            relevanceScore: reportData.relevanceScore,
            completenessScore: reportData.completenessScore,
            overallFeedback: reportData.overallFeedback,
            strengths: reportData.strengths,
            weaknesses: reportData.weaknesses,
            improvementSuggestions: reportData.improvementSuggestions,
        });

        // Update interview status and overall score
        interview.status = "COMPLETED";
        interview.overallScore = reportData.overallScore;
        interview.completedAt = new Date();

        await interview.save();

        return res.status(200).json({
            message: "Mock interview completed successfully",
            overallScore: reportData.overallScore,
            report,
        });

    } catch (error) {
        console.error("Complete mock interview error:", error);

        return res.status(500).json({
            message: "Failed to complete mock interview",
        });
    }
};

// 7. GET MOCK INTERVIEW PERFORMANCE REPORT
export const getMockInterviewReport = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Mock interview not found",
            });
        }

        if (interview.status !== "COMPLETED") {
            return res.status(400).json({
                message: "Performance report is not available yet",
            });
        }

        const report = await MockInterviewReport.findOne({
            where: {
                mockInterviewId: interview.id,
            },
        });

        if (!report) {
            return res.status(404).json({
                message: "Performance report not found",
            });
        }

        return res.status(200).json({
            message: "Performance report fetched successfully",
            report,
        });

    } catch (error) {
        console.error("Get mock interview report error:", error);

        return res.status(500).json({
            message: "Failed to fetch performance report",
        });
    }
};