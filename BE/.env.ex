# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

PORT=5000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
SECRET="LLOOOOOOONNNGGGG_SECREEEEEEEET"

STRAPI_URL="http://localhost:1337/api"
STRAPI_TOKEN=""
ASTRO_URL="http://localhost:4321/"

REDIS_URL="redis://localhost:6379"
REDIS_TTL=1800000
