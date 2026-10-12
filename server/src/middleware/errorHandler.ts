import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled application error:', err);

  // Prisma unique constraint violation (e.g. duplicate reference or email)
  if (err.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`,
    });
    return;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'The requested record could not be found.',
    });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
