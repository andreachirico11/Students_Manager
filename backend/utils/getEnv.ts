export interface IEnvVariables {
  MONGO_CONNECTION_STRING?: string;
  SECRET_AUTH_STRING?: string;
  TOKEN_EXPIRATION_DATE?: string;
  ALLOWED_ORIGINS?: string;
  PORT?: string;
  TEST_USER?: string;
  AUTO_PING_URL?: string;
  BLANK_TEMPLATE_FILE_NAME?: string;
}

export function getEnvVariables() {
  return process.env as IEnvVariables;
}
