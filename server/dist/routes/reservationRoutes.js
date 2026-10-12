"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservationController_1 = require("../controllers/reservationController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const reservationValidator_1 = require("../validators/reservationValidator");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Public routes
router.post('/', rateLimiter_1.reservationLimiter, (0, validate_1.validate)(reservationValidator_1.createReservationSchema), reservationController_1.createReservation);
router.get('/available-slots', reservationController_1.getAvailableSlots);
// Protected Admin routes
router.get('/', auth_1.requireAuth, auth_1.requireAdmin, reservationController_1.getReservations);
router.get('/tables', auth_1.requireAuth, auth_1.requireAdmin, reservationController_1.getTables);
router.get('/:id', auth_1.requireAuth, auth_1.requireAdmin, reservationController_1.getReservationById);
router.patch('/:id/status', auth_1.requireAuth, auth_1.requireAdmin, (0, validate_1.validate)(reservationValidator_1.updateReservationStatusSchema), reservationController_1.updateReservationStatus);
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, reservationController_1.deleteReservation);
exports.default = router;
//# sourceMappingURL=reservationRoutes.js.map