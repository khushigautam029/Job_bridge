import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("---------------------------------------------");
        console.log("MySQL database connected successfully");
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`JobBridge server running on port ${PORT}`);
            console.log("---------------------------------------------");
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();