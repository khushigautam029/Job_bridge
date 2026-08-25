import Application from "./Application.js";
import ApplicationStatusHistory from "./ApplicationStatusHistory.js";
import CandidateProfile from "./CandidateProfile.js";
import CandidateSkill from "./CandidateSkill.js";
import Company from "./Company.js";
import Interview from "./Interview.js";
import Job from "./Job.js";
import JobCategory from "./JobCategory.js";
import JobSkill from "./JobSkill.js";
import Notification from "./Notification.js";
import RecruiterProfile from "./RecruiterProfile.js";
import SavedJob from "./SavedJob.js";
import Skill from "./Skill.js";
import User from "./User.js";

// User Profile
User.hasOne(CandidateProfile, {
    foreignKey: "userId",
    as: "candidateProfile",
    onDelete: "CASCADE",
});

CandidateProfile.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

User.hasOne(RecruiterProfile, {
    foreignKey: "userId",
    as: "recruiterProfile",
    onDelete: "CASCADE",
});

RecruiterProfile.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});


// COMPANY RELATIONSHIPS
Company.hasMany(RecruiterProfile, {
    foreignKey: "companyId",
    as: "recruiters",
});

RecruiterProfile.belongsTo(Company, {
    foreignKey: "companyId",
    as: "company",
});


// JOB CATEGORY RELATIONSHIPS
JobCategory.hasMany(Job, {
    foreignKey: "categoryId",
    as: "jobs",
});

Job.belongsTo(JobCategory, {
    foreignKey: "categoryId",
    as: "category",
});


// RECRUITER → JOB
RecruiterProfile.hasMany(Job, {
    foreignKey: "recruiterId",
    as: "jobs",
});

Job.belongsTo(RecruiterProfile, {
    foreignKey: "recruiterId",
    as: "recruiter",
});


// COMPANY → JOB
Company.hasMany(Job, {
    foreignKey: "companyId",
    as: "jobs",
});

Job.belongsTo(Company, {
    foreignKey: "companyId",
    as: "company",
});


// CANDIDATE ↔ SKILL
CandidateProfile.belongsToMany(Skill, {
    through: CandidateSkill,
    foreignKey: "candidateId",
    otherKey: "skillId",
    as: "skills",
});

Skill.belongsToMany(CandidateProfile, {
    through: CandidateSkill,
    foreignKey: "skillId",
    otherKey: "candidateId",
    as: "candidates",
});


// JOB ↔ SKILL
Job.belongsToMany(Skill, {
    through: JobSkill,
    foreignKey: "jobId",
    otherKey: "skillId",
    as: "skills",
});

Skill.belongsToMany(Job, {
    through: JobSkill,
    foreignKey: "skillId",
    otherKey: "jobId",
    as: "jobs",
});


// CANDIDATE → APPLICATION
CandidateProfile.hasMany(Application, {
    foreignKey: "candidateId",
    as: "applications",
});

Application.belongsTo(CandidateProfile, {
    foreignKey: "candidateId",
    as: "candidate",
});


// JOB → APPLICATION
Job.hasMany(Application, {
    foreignKey: "jobId",
    as: "applications",
});

Application.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
});


// APPLICATION → STATUS HISTORY
Application.hasMany(ApplicationStatusHistory, {
    foreignKey: "applicationId",
    as: "statusHistory",
    onDelete: "CASCADE",
});

ApplicationStatusHistory.belongsTo(Application, {
    foreignKey: "applicationId",
    as: "application",
});


// USER → STATUS HISTORY
User.hasMany(ApplicationStatusHistory, {
    foreignKey: "changedBy",
    as: "changedApplicationStatuses",
});

ApplicationStatusHistory.belongsTo(User, {
    foreignKey: "changedBy",
    as: "changedByUser",
});


// CANDIDATE → SAVED JOBS
CandidateProfile.hasMany(SavedJob, {
    foreignKey: "candidateId",
    as: "savedJobs",
    onDelete: "CASCADE",
});

SavedJob.belongsTo(CandidateProfile, {
    foreignKey: "candidateId",
    as: "candidate",
});


// JOB → SAVED JOBS
Job.hasMany(SavedJob, {
    foreignKey: "jobId",
    as: "savedBy",
    onDelete: "CASCADE",
});

SavedJob.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
});


// APPLICATION → INTERVIEW
Application.hasMany(Interview, {
    foreignKey: "applicationId",
    as: "interviews",
    onDelete: "CASCADE",
});

Interview.belongsTo(Application, {
    foreignKey: "applicationId",
    as: "application",
});


// USER → INTERVIEW
User.hasMany(Interview, {
    foreignKey: "scheduledBy",
    as: "scheduledInterviews",
});

Interview.belongsTo(User, {
    foreignKey: "scheduledBy",
    as: "scheduler",
});


// USER → NOTIFICATIONS
User.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
    onDelete: "CASCADE",
});

Notification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});


export {
    Application,
    ApplicationStatusHistory, CandidateProfile, CandidateSkill, Company, Interview, Job, JobCategory, JobSkill, Notification, RecruiterProfile, SavedJob, Skill, User
};
