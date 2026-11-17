
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import { Sequelize } from "sequelize";

dotenv.config();

const caCertificate = readFileSync(
    new URL("../certs/ca.pem", import.meta.url)
);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",

        logging: false,

        dialectOptions: {
            ssl: {
                ca: caCertificate,
                rejectUnauthorized: true,
            },
        },

        pool: {
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export default sequelize;
