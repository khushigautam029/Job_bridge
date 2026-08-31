import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
            },
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Please provide a valid email",
                },
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(
                "CANDIDATE",
                "RECRUITER",
                "ADMIN"
            ),
            allowNull: false,
            defaultValue: "CANDIDATE",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    },
    {
        tableName: "users",
        timestamps: true,
        underscored: true,
    }
);

export default User;