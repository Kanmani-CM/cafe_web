"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validate_1 = require("../middleware/validate");
const authValidator_1 = require("../validators/authValidator");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post('/login', rateLimiter_1.loginLimiter, (0, validate_1.validate)(authValidator_1.loginSchema), authController_1.login);
router.post('/logout', authController_1.logout);
router.get('/me', authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map