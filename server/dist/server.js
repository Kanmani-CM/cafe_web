"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`☕ Aurora Café Backend Server is running at http://localhost:${PORT}`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
//# sourceMappingURL=server.js.map