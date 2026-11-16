import cron from "node-cron";
import { Op } from "sequelize";
import { AiMessage } from "../models/index.js";
const deleteExpiredAiMessages = async () => {
    try {
        const expirationDate = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
        );

        const deletedCount = await AiMessage.destroy({
            where: {
                createdAt: {
                    [Op.lt]: expirationDate,
                },
            },
        });

        console.log(
            `AI message cleanup completed. Deleted ${deletedCount} expired messages.`
        );
    } catch (error) {
        console.error(
            "AI message cleanup failed:",
            error.message
        );
    }
};

const startAiMessageCleanup = async () => {
    // Run once when the server starts
    await deleteExpiredAiMessages();

    // Run automatically every hour
    cron.schedule("0 * * * *", async () => {
        await deleteExpiredAiMessages();
    });
    console.log("AI message cleanup job scheduled successfully.")

};

export default startAiMessageCleanup;