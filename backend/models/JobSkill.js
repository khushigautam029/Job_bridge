import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const JobSkill = sequelize.define(
    "JobSkill",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "job_id",
        },

        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "skill_id",
        },
    },
    {
        tableName: "job_skills",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["job_id", "skill_id"],
            },
        ],
    }
);

export default JobSkill;