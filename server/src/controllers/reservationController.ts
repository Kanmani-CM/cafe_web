import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { ReservationService } from '../services/reservationService';
import { ReservationStatus } from '@prisma/client';

export const createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await ReservationService.bookTable(req.body);

    res.status(201).json({
      success: true,
      message: 'Your table reservation has been successfully booked!',
      data: reservation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to complete reservation.',
    });
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, guests } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({
        success: false,
        message: 'A valid date parameter (YYYY-MM-DD) is required.',
      });
      return;
    }

    const guestCount = guests ? parseInt(String(guests), 10) : 2;
    const slots = await ReservationService.getAvailableSlots(date, isNaN(guestCount) ? 2 : guestCount);

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, date, search } = req.query;

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status as ReservationStatus;
    }

    if (date) {
      whereClause.date = String(date);
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).trim();
      whereClause.OR = [
        { referenceNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerEmail: { contains: q, mode: 'insensitive' } },
        { customerPhone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        table: true,
      },
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { table: true },
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, tableId } = req.body;

    const updateData: any = { status };
    if (tableId !== undefined) {
      updateData.tableId = tableId;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: { table: true },
    });

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.reservation.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getTables = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNumber: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};
