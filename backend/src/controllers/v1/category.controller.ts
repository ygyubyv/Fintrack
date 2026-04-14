import { CategoryService } from "../../services/category/category.service";
import type { Request, Response, NextFunction } from "express";
import type { TSortDirection } from "../../types/v1";
import { AppError } from "../../errors/AppError";
import { toCategoryResponse } from "../../dto/category/category.response.dto";
import { toArray } from "../../utils";

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

      if (!category) {
        throw new AppError("CATEGORY_NOT_FOUND");
      }

      const formattedCategory = toCategoryResponse(category);

      return response.status(200).json(formattedCategory);
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

      const categoryIds = toArray(request.query["categoryIds[]"])?.map(
        (categoryId) => Number(categoryId),
      );

      const { user } = request;

      const categories = await CategoryService().findAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        title: title as string,
        categoryIds,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
      });

      const formattedCategories = {
        data: categories.data.map((category) => {
          return toCategoryResponse(category);
        }),
        meta: categories.meta,
      };

      return response.status(200).json(formattedCategories);
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

      const formattedCategory = toCategoryResponse(category);

      return response.status(201).json(formattedCategory);
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

      const formattedCategory = toCategoryResponse(category);

      return response.status(200).json(formattedCategory);
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

  const exportAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;

      const {
        title,
        page,
        perPage,
        orderByCreatedAt,
        orderByCreatedAtDirection,
      } = request.query;

      const categoryIds = toArray(request.query["categoryIds[]"])?.map(
        (categoryId) => Number(categoryId),
      );

      const csv = await CategoryService().exportAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        title: title as string,
        categoryIds,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
      });

      response.header("Content-Type", "text/csv");
      response.attachment("Categories");

      return response.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  };

  const importAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { file } = request;

      await CategoryService().importAll(user!.id, file!);

      return response.sendStatus(200);
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
    exportAll,
    importAll,
  };
};
