import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

dotenv.config();

import { FRONTEND_URL } from "./config";

import { openapiV1Spec } from "./openapi";

import apiRoutes from "./routes/index";
import { ErrorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api", apiRoutes);

app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);

app.get("/openapi/v1.json", (request, response) => {
  response.json(openapiV1Spec);
});

app.get("/docs/v1", (request, response) => {
  response.sendFile(path.join(process.cwd(), "public/docs-v1.html"));
});

app.use(ErrorMiddleware);

export default app;
