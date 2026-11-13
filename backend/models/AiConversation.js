import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AiConversation = sequelize.define(
    "AiConversation",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "users",
                key: "id",
            },
        },
    },
    {
        tableName: "ai_conversations",
        timestamps: true,
        underscored: true,
    }
);

export default AiConversation;