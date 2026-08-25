import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const JobCategory = sequelize.define(
    "JobCategory",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "job_categories",
        timestamps: true,
        underscored: true,
    }
);

export default JobCategory;