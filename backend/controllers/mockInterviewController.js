
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
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

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
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
            });
        }

        const allowedTypes = ["TECHNICAL", "HR", "MIXED"];
        const allowedDifficulties = ["EASY", "MEDIUM", "HARD"];
        const allowedQuestionCounts = [5, 10, 15];

        if (!allowedTypes.includes(interviewType)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.INVALID_INTERVIEW_TYPE,
            });
        }

        if (!allowedDifficulties.includes(difficulty)) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message:MESSAGES.INVALID_INTERVIEW_DIFFICULTY,
            });
        }

        if (!allowedQuestionCounts.includes(Number(totalQuestions))) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.TOTAL_QUESTIONS,
            });
        }

        let selectedJob = null;
        let finalJobRole = jobRole?.trim();

        // If the candidate selects an existing JobBridge job
        if (jobId) {
            selectedJob = await Job.findByPk(jobId);

            if (!selectedJob) {
                return res.status(STATUS_CODES.NOT_FOUND).json({
                    message: MESSAGES.SELECTED_JOB_NOT_FOUND,
                });
            }

            if (selectedJob.status !== "OPEN") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: MESSAGES.JOB_IS_NOT_CURRENTLY_OPEN,
                });
            }

            // Use the actual job title instead of trusting user input
            finalJobRole = selectedJob.title;
        }

        if (!finalJobRole) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message:MESSAGES.PLEASE_PROVIDE_A_JOB_ROLE,
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

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.MOCK_INTERVIEW_CREATED,
            interview: mockInterview,
        });

    } catch (error) {
        console.error("Create mock interview error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.FAILED_T0_CREATE_MOCK_INTERVIEW,
        });
    }
};

// 2. GET CANDIDATE'S MOCK INTERVIEW HISTORY
export const getMockInterviews = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
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

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.MOCK_INTERVIEW_HISTORY_FETCHED,
            interviews,
        });

    } catch (error) {
        console.error("Get mock interviews error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.FAILED_TO_FETCH_MOCK_INTERVIEW_HISTORY,
        });
    }
};

// 3. GET MOCK INTERVIEW DETAILS
export const getMockInterviewById = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
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
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.MOCK_INTERVIEW_NOT_FOUND,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.MOCK_INTERVIEW_DETAILS_FETCHED,
            interview,
        });

    } catch (error) {
        console.error("Get mock interview details error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.FAILED_T0_FETCH_MOCK_INTERVIEW_DETAILS,
        });
    }
};

// 4. START MOCK INTERVIEW AND GENERATE QUESTIONS
export const startMockInterview = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.MOCK_INTERVIEW_NOT_FOUND,
            });
        }

        if (interview.status !== "IN_PROGRESS") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.THIS_INTERVIEW_CANNOT_BE_STARTED,
            });
        }

        // Prevent generating duplicate questions
        const existingQuestions = await MockInterviewQuestion.count({
            where: {
                mockInterviewId: interview.id,
            },
        });

        if (existingQuestions > 0) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.INTERVIEW_QUESTIONS_HAVE_ALREADY_BEEN_GENERATED,
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

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.MOCK_INTERVIEW_STARTED,
            questions: questionRecords,
        });

    } catch (error) {
        console.error("Start mock interview error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.FAILED_TO_START_MOCK_INTERVIEW,
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
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.ANSWER_REQUIRED_AND_MUST_NOT_EXCEED_LENGTH,
            });
        }

        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.MOCK_INTERVIEW_NOT_FOUND,
            });
        }

        if (interview.status !== "IN_PROGRESS" || !interview.startedAt) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.THIS_INTERVIEW_HAS_NOT_BEEN_STARTED_OR_IS_ALREADY_COMPLETED,
            });
        }

        const question = await MockInterviewQuestion.findOne({
            where: {
                id: questionId,
                mockInterviewId: interview.id,
            },
        });

        if (!question) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.INTERVIEW_QUESTION_NOT_FOUND,
            });
        }

        if (question.candidateAnswer !== null) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.THIS_QUESTION_HAS_ALREADY_BEEN_ANSWERED,
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

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.ANSWER_SUBMITTED_AND_EVALUATED,
            evaluation,
        });

    } catch (error) {
        console.error("Submit mock interview answer error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.FAILED_TO_SUBMIT_AND_EVALUATE_ANSWER,
        });
    }
};

// 6. COMPLETE MOCK INTERVIEW AND GENERATE REPORT
export const completeMockInterview = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.MOCK_INTERVIEW_NOT_FOUND,
            });
        }

        if (interview.status === "COMPLETED") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.THIS_INTERVIEW_HAS_ALREADY_BEEN_COMPLETED,
            });
        }

        if (!interview.startedAt) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.PLEASE_START_THE_INTERVIEW_FIRST,
            });
        }

        const questions = await MockInterviewQuestion.findAll({
            where: {
                mockInterviewId: interview.id,
            },
            order: [["questionOrder", "ASC"]],
        });

        if (questions.length !== interview.totalQuestions) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.INTERVIEW_QUESTIONS_ARE_INCOMPLETE,
            });
        }

        // Check whether every question has been answered
        const unansweredQuestions = questions.filter(
            (question) => question.candidateAnswer === null
        );

        if (unansweredQuestions.length > 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.PLEASE_ANSWER_ALL_INTERVIEW_QUESTIONS_BEFORE_COMPLETING,
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

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.MOCK_INTERVIEW_COMPLETED,
            overallScore: reportData.overallScore,
            report,
        });

    } catch (error) {
        console.error("Complete mock interview error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.FAILED_TO_COMPLETE_MOCK_INTERVIEW,
        });
    }
};

// 7. GET MOCK INTERVIEW PERFORMANCE REPORT
export const getMockInterviewReport = async (req, res) => {
    try {
        const candidate = await getCandidateProfile(req.user.id);

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PROFILE_NOT_FOUND,
            });
        }

        const interview = await getCandidateInterview(
            req.params.id,
            candidate.id
        );

        if (!interview) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.MOCK_INTERVIEW_NOT_FOUND,
            });
        }

        if (interview.status !== "COMPLETED") {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: MESSAGES.PERFORMANCE_REPORT_IS_NOT_AVAILABLE_YET,
            });
        }

        const report = await MockInterviewReport.findOne({
            where: {
                mockInterviewId: interview.id,
            },
        });

        if (!report) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.PERFORMANCE_REPORT_NOT_FOUND,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            message: MESSAGES.PERFORMANCE_REPORT_FETCHED,
            report,
        });

    } catch (error) {
        console.error("Get mock interview report error:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: MESSAGES.FAILED_TO_FETCH_PERFORMANCE_REPORT,
        });
    }
};