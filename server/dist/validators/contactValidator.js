"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessageSchema = void 0;
const zod_1 = require("zod");
exports.contactMessageSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
    email: zod_1.z.string().trim().email('Please enter a valid email address'),
    phone: zod_1.z.string().trim().max(20).optional().or(zod_1.z.literal('')),
    subject: zod_1.z.string().trim().min(2, 'Subject must have at least 2 characters').max(150),
    message: zod_1.z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});
//# sourceMappingURL=contactValidator.js.map