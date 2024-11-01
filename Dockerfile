FROM node:lts-alpine as builder

WORKDIR /app

COPY . .

RUN corepack enable \
  && pnpm install --no-frozen-lockfile \
  && pnpm run generate

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
