"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
const getDashboardStats = async (_req, res, next) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [totalMenuItems, totalReservations, pendingReservations, confirmedReservations, todayReservations, totalMessages, unreadMessages, recentReservations,] = await Promise.all([
            prisma_1.default.menuItem.count(),
            prisma_1.default.reservation.count(),
            prisma_1.default.reservation.count({ where: { status: client_1.ReservationStatus.PENDING } }),
            prisma_1.default.reservation.count({ where: { status: client_1.ReservationStatus.CONFIRMED } }),
            prisma_1.default.reservation.count({ where: { date: todayStr } }),
            prisma_1.default.contactMessage.count(),
            prisma_1.default.contactMessage.count({ where: { isRead: false } }),
            prisma_1.default.reservation.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { table: true },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalMenuItems,
                totalReservations,
                pendingReservations,
                confirmedReservations,
                todayReservations,
                totalMessages,
                unreadMessages,
                recentReservations,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=statsController.js.map