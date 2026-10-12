import { z } from 'zod';

export const VALID_TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30'
] as const;

export const createReservationSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  customerEmail: z.string().trim().email('Please enter a valid email address'),
  customerPhone: z
    .string()
    .trim()
    .min(7, 'Phone number must have at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine((val) => {
      const selected = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, { message: 'Reservation date cannot be in the past' }),
  timeSlot: z.string().refine((val) => VALID_TIME_SLOTS.includes(val as any), {
    message: 'Please choose an available café time slot (08:00 to 20:30)',
  }),
  guestCount: z.coerce
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'At least 1 guest is required')
    .max(12, 'For parties larger than 12, please contact us directly for event booking'),
  specialNotes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  tableId: z.coerce.number().int().positive().optional().nullable(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
