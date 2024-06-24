FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN npm i -g pnpm \
  && pnpm install \
  && npx nuxi build --preset=node-server

FROM node:18-alpine

COPY --from=builder /app/.output /app/.output

WORKDIR /app

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
