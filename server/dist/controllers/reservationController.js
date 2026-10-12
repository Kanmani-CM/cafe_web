"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = exports.deleteReservation = exports.updateReservationStatus = exports.getReservationById = exports.getReservations = exports.getAvailableSlots = exports.createReservation = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const reservationService_1 = require("../services/reservationService");
const createReservation = async (req, res, next) => {
    try {
        const reservation = await reservationService_1.ReservationService.bookTable(req.body);
        res.status(201).json({
            success: true,
            message: 'Your table reservation has been successfully booked!',
            data: reservation,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Unable to complete reservation.',
        });
    }
};
exports.createReservation = createReservation;
const getAvailableSlots = async (req, res, next) => {
    try {
        const { date, guests } = req.query;
        if (!date || typeof date !== 'string') {
            res.status(400).json({
                success: false,
                message: 'A valid date parameter (YYYY-MM-DD) is required.',
            });
            return;
        }
        const guestCount = guests ? parseInt(String(guests), 10) : 2;
        const slots = await reservationService_1.ReservationService.getAvailableSlots(date, isNaN(guestCount) ? 2 : guestCount);
        res.status(200).json({
            success: true,
            data: slots,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailableSlots = getAvailableSlots;
const getReservations = async (req, res, next) => {
    try {
        const { status, date, search } = req.query;
        const whereClause = {};
        if (status && status !== 'ALL') {
            whereClause.status = status;
        }
        if (date) {
            whereClause.date = String(date);
        }
        if (search && String(search).trim() !== '') {
            const q = String(search).trim();
            whereClause.OR = [
                { referenceNumber: { contains: q, mode: 'insensitive' } },
                { customerName: { contains: q, mode: 'insensitive' } },
                { customerEmail: { contains: q, mode: 'insensitive' } },
                { customerPhone: { contains: q, mode: 'insensitive' } },
            ];
        }
        const reservations = await prisma_1.default.reservation.findMany({
            where: whereClause,
            include: {
                table: true,
            },
            orderBy: [
                { date: 'asc' },
                { timeSlot: 'asc' },
            ],
        });
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReservations = getReservations;
const getReservationById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const reservation = await prisma_1.default.reservation.findUnique({
            where: { id },
            include: { table: true },
        });
        if (!reservation) {
            res.status(404).json({
                success: false,
                message: 'Reservation not found.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: reservation,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReservationById = getReservationById;
const updateReservationStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status, tableId } = req.body;
        const updateData = { status };
        if (tableId !== undefined) {
            updateData.tableId = tableId;
        }
        const updated = await prisma_1.default.reservation.update({
            where: { id },
            data: updateData,
            include: { table: true },
        });
        res.status(200).json({
            success: true,
            message: `Reservation status updated to ${status}.`,
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReservationStatus = updateReservationStatus;
const deleteReservation = async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma_1.default.reservation.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Reservation deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReservation = deleteReservation;
const getTables = async (_req, res, next) => {
    try {
        const tables = await prisma_1.default.table.findMany({
            orderBy: { tableNumber: 'asc' },
        });
        res.status(200).json({
            success: true,
            data: tables,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTables = getTables;
//# sourceMappingURL=reservationController.js.map