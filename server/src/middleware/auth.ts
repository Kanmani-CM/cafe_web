import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
    return;
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
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
