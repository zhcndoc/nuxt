FROM node:lts-alpine as builder

WORKDIR /app

COPY . .

RUN npm install --global pnpm \
  && pnpm install \
  && npx nuxi build --prerender=true --preset=node-server

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
