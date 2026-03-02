import express from "express";
import { UserController } from "../../controllers/v1/user.controller";
import { ValidateMiddleware } from "../../middlewares/validate.middleware";
import { UpdateSchema } from "../../validation/schemas/v1/user.schema";

const router = express.Router();
const { getById, update, remove } = UserController();

router.get("/my-account", getById);
router.patch("/my-account", ValidateMiddleware({ body: UpdateSchema }), update);
router.delete("/my-account", remove);

export default router;
