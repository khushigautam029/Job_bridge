import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AtsAnalysis = sequelize.define(
    "AtsAnalysis",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "applications",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 100,
            },
        },
        matchedSkills:{
            type:DataTypes.JSON,
            allowNull: false,
            default:[]
        },
        missingSkills:{
            type:DataTypes.JSON,
            allowNull:false,
            default:[]
        },
        matchedKeywords:{
            type:DataTypes.JSON,
            allowNull:false,
            default:[]
        },
        missingKeywords:{
            type:DataTypes.JSON,
            allowNull:false,
            default:[]
        },
        breakDown:{
            type:DataTypes.JSON,
            allowNull:false,
            default:[]
        },
        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "PROCESSING",
                "COMPLETED",
                "FAILED"
            ),
            allowNull: false,
            defaultValue: "PENDING",
        },

        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        analyzedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "ats_analyses",
        timestamps: true,
        underscored: true,
    }
);

export default AtsAnalysis;