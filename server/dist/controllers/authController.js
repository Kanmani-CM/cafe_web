"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../prisma"));
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        // Set user in session
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    });
};
exports.logout = logout;
const getMe = (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({
            success: true,
            data: req.session.user,
        });
        return;
    }
    res.status(401).json({
        success: false,
        message: 'Not authenticated',
    });
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map