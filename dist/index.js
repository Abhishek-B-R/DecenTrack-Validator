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
const validateData_1 = __importDefault(require("./validateData"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function waitForWebSocket(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            ws.onopen = () => {
                console.log("WebSocket Connected 🎉");
                resolve(ws);
            };
            ws.onerror = (error) => {
                console.error("WebSocket Error", error);
                reject(error);
            };
            ws.onclose = () => {
                console.log("WebSocket Closed");
            };
            ws.onmessage = (e) => __awaiter(this, void 0, void 0, function* () {
                const msg = JSON.parse(e.data);
                const returnData = yield (0, validateData_1.default)(msg);
                console.log(returnData);
                yield axios_1.default.post(process.env.BACKEND_URL, returnData).then((response) => {
                    console.log("Response recieved: ");
                    console.log(response.data.error);
                }).catch(err => {
                    console.log(err);
                });
            });
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield waitForWebSocket(process.env.WS_URL);
}))();
