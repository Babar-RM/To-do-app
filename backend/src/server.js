import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import initCronJobs from "./config/cron.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    initCronJobs();
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});