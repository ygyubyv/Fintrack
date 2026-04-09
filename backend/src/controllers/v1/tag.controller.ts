import { TagService } from "../../services/tag/tag.service";
import type { Request, Response, NextFunction } from "express";
import { TSortDirection } from "../../types/v1";
import { toTagResponse } from "../../dto/tag/tag.response.dto";
import { AppError } from "../../errors/AppError";
import { toArray } from "../../utils";

export const TagController = () => {
  const getById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;

      const tag = await TagService().findById(user!.id, {
        id: Number(id),
      });

      if (!tag) {
        throw new AppError("TAG_NOT_FOUND");
      }

      const formattedTag = toTagResponse(tag);

      return response.status(200).json(formattedTag);
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

      const tagIds = toArray(request.query["tagIds[]"])?.map((tagId) =>
        Number(tagId),
      );

      const { user } = request;

      const tags = await TagService().findAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        title: title as string,
        tagIds,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
      });

      const formattedTags = {
        data: tags.data.map((tag) => {
          return toTagResponse(tag);
        }),
        meta: tags.meta,
      };

      return response.status(200).json(formattedTags);
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
      const { title, color } = request.body;

      const tag = await TagService().create(user!.id, {
        title,
        color,
      });

      const formattedTag = toTagResponse(tag);

      return response.status(201).json(formattedTag);
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
      const { title, color } = request.body;

      const tag = await TagService().update(user!.id, Number(id), {
        title,
        color,
      });

      const formattedTag = toTagResponse(tag);

      return response.status(200).json(formattedTag);
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

      await TagService().remove(user!.id, Number(id));

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

      const tagIds = toArray(request.query["tagIds[]"])?.map((tagId) =>
        Number(tagId),
      );

      const csv = await TagService().exportAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        title: title as string,
        tagIds,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
      });

      response.header("Content-Type", "text/csv");
      response.attachment("Tags");

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

      await TagService().importAll(user!.id, file!);

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
