import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  subject: z.string().trim().min(2, 'Subject must have at least 2 characters').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
