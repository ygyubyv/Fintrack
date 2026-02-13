import swaggerJSDoc from "swagger-jsdoc";
import { openapiDefinitionV1 } from "./openapi/v1/index";

export const openapiV1Spec = swaggerJSDoc({
  definition: openapiDefinitionV1,
  apis: [],
});
