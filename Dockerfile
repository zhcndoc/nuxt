FROM node:lts-alpine as builder

ARG NUXT_GITHUB_TOKEN
ARG NUXT_UI_PRO_LICENSE

WORKDIR /app

COPY . .

RUN npm install --global pnpm && pnpm install && pnpm run build

FROM node:lts-alpine

COPY --from=builder /app/.output /app/.output

WORKDIR /app

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
