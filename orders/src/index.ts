import express, { Express } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import router from "./routes";
import mongoose from "mongoose";
import morgan from "morgan";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { NotFoundError, DBConnectError, handleErrors, getCurrentUser } from "@sivam96/tickethub-common";
import { initiateNats } from "./nats-wrapper";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

(async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO URI is not defined");
    }

    if (!process.env.COOKIE_KEY) {
        throw new Error("COOKIE_KEY is not defined.......");
    }

    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined.......");
    }

    if (!process.env.NATS_URL) {
        throw new Error("NATS URL is not defined.......");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected........");
    } catch (err) {
        throw new DBConnectError();
    }

    await initiateNats();

    app.use(morgan("dev"));
    app.use(json());
    app.use(cookieParser(process.env.COOKIE_KEY));
    app.use(methodOverride());

    app.use(getCurrentUser);
    app.use(router);
    app.all("*", () => {
        throw new NotFoundError();
    });

    app.use(handleErrors);

    app.listen(port, () => console.log(`Order Server running in the port ${port}`));
})();
