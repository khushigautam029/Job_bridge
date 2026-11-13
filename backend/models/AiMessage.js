import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AiMessage = sequelize.define(
    "AiMessage",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "ai_conversations",
                key: "id",
            },
        },
        sender: {
            type: DataTypes.ENUM("USER", "AI"),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "ai_messages",
        timestamps: true,
        underscored: true,
    }
);

export default AiMessage;