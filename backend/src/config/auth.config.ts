export const AUTH_CONFIG = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: "15m",

  idTokenSecret: process.env.ID_TOKEN_SECRET,
  idTokenExpiresIn: "1h",

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: "1w",

  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudienceApi: process.env.JWT_AUDIENCE_API,
  jwtAudienceClient: process.env.JWT_AUDIENCE_CLIENT,
};
