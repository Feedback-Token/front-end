function throwEnv(envVar) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
  return process.env[envVar];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PRIVATE_PGHOST: throwEnv("NEXT_PRIVATE_PGHOST"),
    NEXT_PRIVATE_PGUSER: throwEnv("NEXT_PRIVATE_PGUSER"),
    NEXT_PRIVATE_PGPASSWORD: throwEnv("NEXT_PRIVATE_PGPASSWORD"),
    NEXT_PRIVATE_PGDATABASE: throwEnv("NEXT_PRIVATE_PGDATABASE"),
    NEXT_PRIVATE_PORT: throwEnv("NEXT_PRIVATE_PORT"),
  },
};

module.exports = nextConfig;
