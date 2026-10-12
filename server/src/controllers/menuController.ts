import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const getMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, vegetarian, vegan, glutenFree, popular, availableOnly } = req.query;

    const whereClause: any = {};

    // By default, public menu shows available items unless requested otherwise (admin)
    if (availableOnly !== 'false') {
      whereClause.isAvailable = true;
    }

    if (category && category !== 'All') {
      whereClause.category = { equals: String(category), mode: 'insensitive' };
    }

    if (vegetarian === 'true') {
      whereClause.isVegetarian = true;
    }

    if (vegan === 'true') {
      whereClause.isVegan = true;
    }

    if (glutenFree === 'true') {
      whereClause.isGlutenFree = true;
    }

    if (popular === 'true') {
      whereClause.isPopular = true;
    }

    if (search && String(search).trim() !== '') {
      const searchTerm = String(search).trim();
      whereClause.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: [
        { isPopular: 'desc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await prisma.menuItem.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await prisma.menuItem.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.menuItem.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
