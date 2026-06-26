import express from "express";
import http from "http"
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { Env } from "./config/env.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";
import { initializeCrons } from "./cron/index.js";
import { connectDB } from "./config/db.js";



const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true
}));

app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json());
app.use(globalLimiter); //Rate Limiter
app.use("/api/v1", routes);


// Error Handler
app.use(errorHandler);



server.listen(Env.PORT, async () => {
    await connectDB();
    if (Env.NODE_ENV === "development") {
        await initializeCrons();
    }
    console.log(`Server is listening on PORT ${Env.PORT}`);
});