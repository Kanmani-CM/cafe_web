"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const reservationValidator_1 = require("../validators/reservationValidator");
const client_1 = require("@prisma/client");
class ReservationService {
    /**
     * Generates a unique readable reference number like RES-A7B2-AURORA
     */
    static generateReference() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const timestamp = Date.now().toString().slice(-4);
        return `AUR-${code}-${timestamp}`;
    }
    /**
     * Check for duplicate bookings and find an available table for date, timeSlot, and party size.
     */
    static async bookTable(data) {
        const { customerName, customerEmail, customerPhone, date, timeSlot, guestCount, specialNotes } = data;
        // 1. Prevent duplicate booking by the same customer on the same date and time slot
        const existingCustomerBooking = await prisma_1.default.reservation.findFirst({
            where: {
                date,
                timeSlot,
                customerEmail: { equals: customerEmail, mode: 'insensitive' },
                status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
            },
        });
        if (existingCustomerBooking) {
            throw new Error(`A reservation for ${customerEmail} already exists on ${date} at ${timeSlot} (Ref: ${existingCustomerBooking.referenceNumber}).`);
        }
        // 2. Fetch all tables capable of seating this party size (capacity >= guestCount)
        const eligibleTables = await prisma_1.default.table.findMany({
            where: {
                capacity: { gte: guestCount },
            },
            orderBy: {
                capacity: 'asc', // Best fit first
            },
        });
        if (eligibleTables.length === 0) {
            throw new Error(`We do not have a single table large enough for ${guestCount} guests. Please reach out to us for private party arrangements.`);
        }
        // 3. Find which tables are already occupied for this date and timeSlot
        const activeReservations = await prisma_1.default.reservation.findMany({
            where: {
                date,
                timeSlot,
                status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
                tableId: { not: null },
            },
            select: {
                tableId: true,
            },
        });
        const bookedTableIds = new Set(activeReservations.map((r) => r.tableId));
        // 4. Find the first available eligible table
        const freeTable = eligibleTables.find((table) => !bookedTableIds.has(table.id));
        if (!freeTable) {
            throw new Error(`All tables for ${guestCount} guests are currently fully booked on ${date} at ${timeSlot}. Please select an alternative time slot.`);
        }
        // 5. Generate unique reference and create reservation
        let referenceNumber = this.generateReference();
        // Safety check for unique reference
        let isRefUnique = false;
        while (!isRefUnique) {
            const existing = await prisma_1.default.reservation.findUnique({ where: { referenceNumber } });
            if (!existing) {
                isRefUnique = true;
            }
            else {
                referenceNumber = this.generateReference();
            }
        }
        const reservation = await prisma_1.default.reservation.create({
            data: {
                referenceNumber,
                customerName,
                customerEmail,
                customerPhone,
                date,
                timeSlot,
                guestCount,
                specialNotes,
                status: client_1.ReservationStatus.CONFIRMED,
                tableId: freeTable.id,
            },
            include: {
                table: true,
            },
        });
        return reservation;
    }
    /**
     * Return availability breakdown for each time slot on a given date and guest count.
     */
    static async getAvailableSlots(date, guestCount) {
        const eligibleTables = await prisma_1.default.table.findMany({
            where: {
                capacity: { gte: guestCount },
            },
        });
        if (eligibleTables.length === 0) {
            return reservationValidator_1.VALID_TIME_SLOTS.map((slot) => ({
                timeSlot: slot,
                available: false,
                remainingTables: 0,
                reason: 'Party size exceeds table capacity',
            }));
        }
        const eligibleTableIds = new Set(eligibleTables.map((t) => t.id));
        const activeReservations = await prisma_1.default.reservation.findMany({
            where: {
                date,
                status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
                tableId: { in: Array.from(eligibleTableIds) },
            },
            select: {
                timeSlot: true,
                tableId: true,
            },
        });
        const bookedCountsBySlot = {};
        for (const res of activeReservations) {
            bookedCountsBySlot[res.timeSlot] = (bookedCountsBySlot[res.timeSlot] || 0) + 1;
        }
        const totalEligible = eligibleTables.length;
        return reservationValidator_1.VALID_TIME_SLOTS.map((slot) => {
            const booked = bookedCountsBySlot[slot] || 0;
            const remaining = Math.max(0, totalEligible - booked);
            return {
                timeSlot: slot,
                available: remaining > 0,
                remainingTables: remaining,
            };
        });
    }
}
exports.ReservationService = ReservationService;
//# sourceMappingURL=reservationService.js.map