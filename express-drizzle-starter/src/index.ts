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



const app = express();
const server = http.createServer(app);


app.set("trust proxy", 1);


const allowedOrigins = (Env.FRONTEND_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json());
app.use(globalLimiter); //Rate Limiter
app.use("/api/v1", routes);


// Error Handler
app.use(errorHandler);



server.listen(Env.PORT, async () => {
    if (Env.NODE_ENV === "development") {
        await initializeCrons();
    }
    console.log(`Server is listening on PORT ${Env.PORT}`);
});
