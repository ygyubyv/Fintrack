import express from "express";
import { TagController } from "../../controllers/v1/tag.controller";
import { ValidateMiddleware } from "../../middlewares/validate.middleware";
import {
  GetAllSchema,
  GetByIdSchema,
  CreateSchema,
  UpdateSchema,
} from "../../validation/schemas/v1/tag.schema";

const router = express.Router();
const { getById, getAll, create, update, remove } = TagController();

router.get("/:id", ValidateMiddleware({ params: GetByIdSchema }), getById);
router.get("/", ValidateMiddleware({ query: GetAllSchema }), getAll);
router.post("/", ValidateMiddleware({ body: CreateSchema }), create);
router.patch(
  "/:id",
  ValidateMiddleware({ params: GetByIdSchema, body: UpdateSchema }),
  update,
);
router.delete("/:id", ValidateMiddleware({ params: GetByIdSchema }), remove);

export default router;
