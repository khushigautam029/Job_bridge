import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SavedJob = sequelize.define(
    "SavedJob",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "candidate_id",
        },

        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "job_id",
        },
    },
    {
        tableName: "saved_jobs",
        timestamps: true,
        updatedAt: false,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["candidate_id", "job_id"],
            },
        ],
    }
);

export default SavedJob;