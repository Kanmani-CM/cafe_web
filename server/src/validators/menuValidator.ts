import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, 'Item name must have at least 2 characters').max(100),
  description: z.string().trim().min(5, 'Description must have at least 5 characters').max(500),
  price: z.coerce.number().positive('Price must be greater than 0'),
  imageUrl: z.string().trim().url('Image URL must be a valid URL'),
  category: z.string().trim().min(2, 'Category is required'),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

export const updateMenuItemSchema = menuItemSchema.partial();

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
