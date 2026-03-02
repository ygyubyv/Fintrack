import { z } from "zod";
import type { IUpdateUser } from "../../../services/user/types/user.types";

export const UpdateSchema: z.ZodType<IUpdateUser> = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().max(254).optional(),
  password: z.string().min(6).max(128).optional(),
});
