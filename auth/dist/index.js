"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const method_override_1 = __importDefault(require("method-override"));
const tickethub_common_1 = require("@sivam96/tickethub-common");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO URI is not defined");
    }
    if (!process.env.COOKIE_KEY) {
        throw new Error("COOKIE_KEY is not defined........");
    }
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined........");
    }
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("mongodb connected........");
    }
    catch (err) {
        throw new tickethub_common_1.DBConnectError();
    }
    app.use((0, morgan_1.default)("dev"));
    app.use((0, body_parser_1.json)());
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_KEY));
    app.use((0, method_override_1.default)());
    app.use(tickethub_common_1.getCurrentUser);
    app.use(routes_1.default);
    app.all("*", () => {
        throw new tickethub_common_1.NotFoundError();
    });
    app.use(tickethub_common_1.handleErrors);
    app.listen(port, () => console.log(`Server running  the port ${port}`));
}))();
