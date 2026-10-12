"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationStatusSchema = exports.createReservationSchema = exports.VALID_TIME_SLOTS = void 0;
const zod_1 = require("zod");
exports.VALID_TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30'
];
exports.createReservationSchema = zod_1.z.object({
    customerName: zod_1.z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
    customerEmail: zod_1.z.string().trim().email('Please enter a valid email address'),
    customerPhone: zod_1.z
        .string()
        .trim()
        .min(7, 'Phone number must have at least 7 characters')
        .max(20, 'Phone number cannot exceed 20 characters'),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
        .refine((val) => {
        const selected = new Date(val + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    }, { message: 'Reservation date cannot be in the past' }),
    timeSlot: zod_1.z.string().refine((val) => exports.VALID_TIME_SLOTS.includes(val), {
        message: 'Please choose an available café time slot (08:00 to 20:30)',
    }),
    guestCount: zod_1.z.coerce
        .number()
        .int('Guest count must be a whole number')
        .min(1, 'At least 1 guest is required')
        .max(12, 'For parties larger than 12, please contact us directly for event booking'),
    specialNotes: zod_1.z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});
exports.updateReservationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
    tableId: zod_1.z.coerce.number().int().positive().optional().nullable(),
});
//# sourceMappingURL=reservationValidator.js.map