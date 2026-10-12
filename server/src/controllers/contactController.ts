import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const createContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await prisma.contactMessage.create({
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
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isRead } = req.body;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: isRead !== undefined ? isRead : true },
    });

    res.status(200).json({
      success: true,
      message: 'Message status updated.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
