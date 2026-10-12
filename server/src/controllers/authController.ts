import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
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
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
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

export const getMe = (req: Request, res: Response): void => {
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
