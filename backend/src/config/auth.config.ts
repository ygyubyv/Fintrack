export const AUTH_CONFIG = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: "15m",

  idTokenSecret: process.env.ID_TOKEN_SECRET,
  idTokenExpiresIn: "1h",

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: "1w",

  resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
  resetPasswordTokenExpiresIn: 10 * 60 * 1000,

  verifyEmailSecret: process.env.VERIFY_EMAIL_SECRET,
  verifyEmailTokenExpiresIn: 10 * 60 * 1000,

  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,

  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudienceApi: process.env.JWT_AUDIENCE_API,
  jwtAudienceClient: process.env.JWT_AUDIENCE_CLIENT,
};
