import { logger } from "../config/winston.js";
import { startJobs } from "./scheduler.js";

export const initializeCrons = async () => {
    try {
        const jobs = startJobs();
        logger.info(`⏰ ${jobs.length} cron jobs intialized`);
        return jobs;
    } catch (error) {
        logger.error("CRON INIT ERROR:", error);
        return [];
    }
};