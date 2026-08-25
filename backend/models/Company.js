import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Company = sequelize.define(
    "Company",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        logo: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        website: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
    },
    {
        tableName: "companies",
        timestamps: true,
        underscored: true,
    }
);

export default Company;