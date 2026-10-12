"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required. Please log in.',
        });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required. Please log in.',
        });
        return;
    }
    if (req.session.user.role !== 'ADMIN') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Administrator privileges required.',
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map