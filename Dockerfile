FROM node:lts-alpine as builder

ARG NUXT_GITHUB_TOKEN
ARG NUXT_UI_PRO_LICENSE

WORKDIR /app

COPY . .

RUN npm install --global pnpm && pnpm install && pnpm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/.output .output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
