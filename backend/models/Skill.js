import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Skill = sequelize.define(
    "Skill",
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
        tableName: "skills",
        timestamps: true,
        updatedAt: false,
        underscored: true,
    }
);

export default Skill;