FROM oven/bun:1.3.14-alpine
WORKDIR /app
RUN addgroup app && adduser -S -G app app
COPY . .
RUN chown -R app:app /app
USER app
RUN bun install --frozen-lockfile --omit=dev --ignore-scripts
WORKDIR /app/packages/client
EXPOSE 5173
CMD  ["vite", "--host"]