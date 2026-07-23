FROM oven/bun:1.3.14-slim
WORKDIR /app
RUN groupadd -r app && useradd -r -g app app

COPY . .
RUN chown -R app:app /app
USER app

RUN bun install --frozen-lockfile --production --ignore-scripts

WORKDIR /app/packages/server

RUN DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder" \
    bunx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3000
CMD  ["bun", "run", "index.ts"]