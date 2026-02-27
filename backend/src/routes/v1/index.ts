import { AuthMiddleware } from "../../middlewares/auth.middleware";

import AuthRoutes from "./auth.routes";
import TagRoutes from "./tag.routes";
import CategoryRoutes from "./category.routes";
import ExpenseRoutes from "./expense.routes";

import express from "express";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/tags", AuthMiddleware, TagRoutes);
router.use("/categories", AuthMiddleware, CategoryRoutes);
router.use("/expenses", AuthMiddleware, ExpenseRoutes);

export default router;
