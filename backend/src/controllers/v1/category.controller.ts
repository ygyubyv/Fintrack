import { CategoryService } from "../../services/category/category.service";
import type { Request, Response, NextFunction } from "express";
import { TSortDirection } from "../../types/v1";

export const CategoryController = () => {
  const getById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;

      const category = await CategoryService().findById(user!.id, {
        id: Number(id),
      });

      return response.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  const getAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        title,
        page,
        perPage,
        orderByCreatedAt,
        orderByCreatedAtDirection,
      } = request.query;
      const { user } = request;

      const categories = await CategoryService().findAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        title: title as string,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
      });

      return response.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  const create = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { title } = request.body;

      const category = await CategoryService().create(user!.id, {
        title,
      });

      return response.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  const update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;
      const { title } = request.body;

      const category = await CategoryService().update(user!.id, Number(id), {
        title,
      });

      return response.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  const remove = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;

      await CategoryService().remove(user!.id, Number(id));

      return response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  return {
    create,
    update,
    remove,
    getById,
    getAll,
  };
};
