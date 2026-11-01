import cron from "node-cron";
import Todo from "../models/Todo.js";

const initCronJobs = () => {
    // Run daily at midnight to purge items from trash older than 30 days
    cron.schedule("0 0 * * *", async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await Todo.deleteMany({
                isDeleted: true,
                deletedAt: { $lte: thirtyDaysAgo },
            });

            if (result.deletedCount > 0) {
                console.log(`[CRON] Cleaned up ${result.deletedCount} expired trash items.`);
            }
        } catch (err) {
            console.error("[CRON ERROR] Failed to clean up trash items:", err.message);
        }
    });

    console.log("🕒 Scheduled cron jobs initialized (Trash auto-purge daily at midnight)");
};

export default initCronJobs;
