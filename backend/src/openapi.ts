import swaggerJSDoc from "swagger-jsdoc";
import { openapiDefinition } from "./openapi/index";

export const openapiSpec = swaggerJSDoc({
  definition: openapiDefinition,
  apis: [],
});
