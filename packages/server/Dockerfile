FROM oven/bun:1.3.14-alpine
WORKDIR /app
RUN addgroup app && adduser -S -G app app

COPY . .

RUN chown -R app:app /app

USER app

RUN bun install --frozen-lockfile --omit=dev --ignore-scripts

WORKDIR /app/packages/server

RUN DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder" bunx prisma generate

EXPOSE 3000
CMD  ["bun", "run", "index.ts"]