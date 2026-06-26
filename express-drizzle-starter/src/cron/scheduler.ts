import cron from "node-cron";
import { logger } from "../config/winston.js";
import { sendMeetingEmail } from "./jobs/sendEmail.js";

const scheduleJob = (name: string, time: string, job: Function) => {
    logger.info(`Scheduling ${name} at ${time}`);

    return cron.schedule(
        time,
        async () => {
            try {
                await job();
                logger.info(`${name} completed`);
            } catch (error) {
                logger.error(`${name} failed`, error);
            }
        },
        {
            // scheduled: true,
            timezone: "UTC",
        }
    );
};

export const startJobs = () => {
    return [
        scheduleJob("Transactions", "5 0 * * *", sendMeetingEmail),
    ];
};