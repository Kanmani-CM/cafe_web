"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const menuValidator_1 = require("../validators/menuValidator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', menuController_1.getMenuItems);
router.get('/:id', menuController_1.getMenuItemById);
// Protected Admin routes
router.post('/', auth_1.requireAuth, auth_1.requireAdmin, (0, validate_1.validate)(menuValidator_1.menuItemSchema), menuController_1.createMenuItem);
router.put('/:id', auth_1.requireAuth, auth_1.requireAdmin, (0, validate_1.validate)(menuValidator_1.updateMenuItemSchema), menuController_1.updateMenuItem);
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, menuController_1.deleteMenuItem);
exports.default = router;
//# sourceMappingURL=menuRoutes.js.map