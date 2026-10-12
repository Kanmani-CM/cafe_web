import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'body';
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(issue.message);
        }

        res.status(400).json({
          success: false,
          message: 'Validation failed. Please verify your submitted information.',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
};
