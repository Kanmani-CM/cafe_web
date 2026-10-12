"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = exports.getMenuItemById = exports.getMenuItems = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getMenuItems = async (req, res, next) => {
    try {
        const { category, search, vegetarian, vegan, glutenFree, popular, availableOnly } = req.query;
        const whereClause = {};
        // By default, public menu shows available items unless requested otherwise (admin)
        if (availableOnly !== 'false') {
            whereClause.isAvailable = true;
        }
        if (category && category !== 'All') {
            whereClause.category = { equals: String(category), mode: 'insensitive' };
        }
        if (vegetarian === 'true') {
            whereClause.isVegetarian = true;
        }
        if (vegan === 'true') {
            whereClause.isVegan = true;
        }
        if (glutenFree === 'true') {
            whereClause.isGlutenFree = true;
        }
        if (popular === 'true') {
            whereClause.isPopular = true;
        }
        if (search && String(search).trim() !== '') {
            const searchTerm = String(search).trim();
            whereClause.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        const items = await prisma_1.default.menuItem.findMany({
            where: whereClause,
            orderBy: [
                { isPopular: 'desc' },
                { category: 'asc' },
                { name: 'asc' },
            ],
        });
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMenuItems = getMenuItems;
const getMenuItemById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await prisma_1.default.menuItem.findUnique({
            where: { id },
        });
        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Menu item not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMenuItemById = getMenuItemById;
const createMenuItem = async (req, res, next) => {
    try {
        const item = await prisma_1.default.menuItem.create({
            data: req.body,
        });
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully.',
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createMenuItem = createMenuItem;
const updateMenuItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await prisma_1.default.menuItem.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully.',
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma_1.default.menuItem.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMenuItem = deleteMenuItem;
//# sourceMappingURL=menuController.js.map