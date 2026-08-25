import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CandidateSkill = sequelize.define(
    "CandidateSkill",
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

        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "skill_id",
        },
    },
    {
        tableName: "candidate_skills",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["candidate_id", "skill_id"],
            },
        ],
    }
);

export default CandidateSkill;