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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateData;
function validateData(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = yield Promise.all(msg.data.map((e) => __awaiter(this, void 0, void 0, function* () {
            const { status, latency } = yield checkWebsiteStatus(e.url);
            return {
                websiteId: e.id,
                status,
                latency
            };
        })));
        return returnData;
    });
}
;
// Function to check website status and measure latency
const checkWebsiteStatus = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = performance.now();
    let status = 1; // Default to down (1)
    try {
        // Add protocol if missing
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        const response = yield fetch(fullUrl, {
            method: "GET",
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        // Status 0 means website is up (HTTP 200)
        status = response.status == 200 ? 0 : 1;
    }
    catch (error) {
        // Any error means the website is down
        status = 1;
        // console.error(`Error checking ${url}:`, error)
    }
    finally {
        // Calculate latency
        const latency = Math.round(performance.now() - startTime);
        return { status, latency };
    }
});
