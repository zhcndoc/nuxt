FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install --global pnpm serve \
  && pnpm install \
  && npx nuxi build --prerender=true --preset=node-server

EXPOSE 3000

CMD ["npx", "serve", "/app/dist"]
