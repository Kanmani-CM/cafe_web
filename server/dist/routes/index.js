"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const menuRoutes_1 = __importDefault(require("./menuRoutes"));
const reservationRoutes_1 = __importDefault(require("./reservationRoutes"));
const contactRoutes_1 = __importDefault(require("./contactRoutes"));
const statsRoutes_1 = __importDefault(require("./statsRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/menu', menuRoutes_1.default);
router.use('/reservations', reservationRoutes_1.default);
router.use('/contact', contactRoutes_1.default);
router.use('/admin/stats', statsRoutes_1.default);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=index.js.map