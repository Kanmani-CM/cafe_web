import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { ReservationStatus } from '@prisma/client';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalMenuItems,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      todayReservations,
      totalMessages,
      unreadMessages,
      recentReservations,
    ] = await Promise.all([
      prisma.menuItem.count(),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
      prisma.reservation.count({ where: { status: ReservationStatus.CONFIRMED } }),
      prisma.reservation.count({ where: { date: todayStr } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { table: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMenuItems,
        totalReservations,
        pendingReservations,
        confirmedReservations,
        todayReservations,
        totalMessages,
        unreadMessages,
        recentReservations,
      },
    });
  } catch (error) {
    next(error);
  }
};
