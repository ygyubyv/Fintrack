export const FRONTEND_URL = process.env.FRONTEND_URL;
export const API_URL = process.env.API_URL;
export const PORT = process.env.PORT;

export const JWT_CONFIG = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  idTokenSecret: process.env.ID_TOKEN_SECRET,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudienceApi: process.env.JWT_AUDIENCE_API,
  jwtAudienceClient: process.env.JWT_AUDIENCE_CLIENT,
};
