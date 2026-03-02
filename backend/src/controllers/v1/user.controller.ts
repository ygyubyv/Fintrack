import { toUserResponse } from "../../dto/user/user.response.dto";
import { AppError } from "../../errors/AppError";
import { UserService } from "../../services/user/user.service";
import type { Request, Response, NextFunction } from "express";

export const UserController = () => {
  const getById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;

      const data = await UserService().findById(user!.id);

      if (!data) {
        throw new AppError("USER_NOT_FOUND");
      }

      const formattedUser = toUserResponse(data);

      return response.status(200).json(formattedUser);
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
      const { firstName, lastName, email, password } = request.body;

      const data = await UserService().update(user!.id, {
        firstName,
        lastName,
        email,
        password,
      });

      const formattedUser = toUserResponse(data);

      return response.status(200).json(formattedUser);
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

      await UserService().remove(user!.id);

      return response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  return {
    update,
    remove,
    getById,
  };
};
