"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const contactValidator_1 = require("../validators/contactValidator");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Public route
router.post('/', rateLimiter_1.contactLimiter, (0, validate_1.validate)(contactValidator_1.contactMessageSchema), contactController_1.createContactMessage);
// Protected Admin routes
router.get('/', auth_1.requireAuth, auth_1.requireAdmin, contactController_1.getContactMessages);
router.patch('/:id/read', auth_1.requireAuth, auth_1.requireAdmin, contactController_1.markMessageAsRead);
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, contactController_1.deleteContactMessage);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map