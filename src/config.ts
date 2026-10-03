export const SITE_NAME = "Persona.ai";

export const TELEGRAM_URL = "https://t.me/t_aml_ai";

/** Боевой домен берётся из Vercel автоматически, локально — localhost. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
