"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemSchema = exports.menuItemSchema = void 0;
const zod_1 = require("zod");
exports.menuItemSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Item name must have at least 2 characters').max(100),
    description: zod_1.z.string().trim().min(5, 'Description must have at least 5 characters').max(500),
    price: zod_1.z.coerce.number().positive('Price must be greater than 0'),
    imageUrl: zod_1.z.string().trim().url('Image URL must be a valid URL'),
    category: zod_1.z.string().trim().min(2, 'Category is required'),
    isVegetarian: zod_1.z.boolean().default(false),
    isVegan: zod_1.z.boolean().default(false),
    isGlutenFree: zod_1.z.boolean().default(false),
    isPopular: zod_1.z.boolean().default(false),
    isAvailable: zod_1.z.boolean().default(true),
});
exports.updateMenuItemSchema = exports.menuItemSchema.partial();
//# sourceMappingURL=menuValidator.js.map