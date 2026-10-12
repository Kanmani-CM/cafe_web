"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactMessage = exports.markMessageAsRead = exports.getContactMessages = exports.createContactMessage = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createContactMessage = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const contact = await prisma_1.default.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Thank you for reaching out! Your message has been received.',
            data: contact,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createContactMessage = createContactMessage;
const getContactMessages = async (_req, res, next) => {
    try {
        const messages = await prisma_1.default.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getContactMessages = getContactMessages;
const markMessageAsRead = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { isRead } = req.body;
        const updated = await prisma_1.default.contactMessage.update({
            where: { id },
            data: { isRead: isRead !== undefined ? isRead : true },
        });
        res.status(200).json({
            success: true,
            message: 'Message status updated.',
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markMessageAsRead = markMessageAsRead;
const deleteContactMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma_1.default.contactMessage.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteContactMessage = deleteContactMessage;
//# sourceMappingURL=contactController.js.map