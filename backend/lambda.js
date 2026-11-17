import serverless from "serverless-http";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

let dbConnectionPromise;

const connectToDatabase = async () => {
    if (!dbConnectionPromise) {
        dbConnectionPromise = sequelize.authenticate().catch((error) => {
            dbConnectionPromise = null;
            throw error;
        });
    }

    return dbConnectionPromise;
};

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectToDatabase();

    return serverlessHandler(event, context);
};