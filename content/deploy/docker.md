---
title: Docker
description: '使用 Docker 部署 Nuxt 应用。'
logoIcon: 'i-simple-icons-docker'
category: Hosting
website: 'https://www.docker.com/'
---

Nuxt 默认构建为独立的 Node.js 服务器，因此很适合打包为容器镜像。运行 `nuxt build` 会生成自包含的 `.output` 目录，只需 Node.js 运行时即可启动。最终镜像无需包含源代码、`node_modules` 或包管理器。

::note
无需额外配置。除非检测到或指定了其他预设，`nuxt build` 会使用 `node-server` 预设。
::

## Dockerfile

请使用多阶段构建：在第一阶段安装依赖并构建应用，然后只将 `.output` 复制到干净的运行阶段。

::code-group{sync="pm"}

```dockerfile [pnpm]
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --link --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```dockerfile [yarn]
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --link package.json yarn.lock ./
RUN yarn install --immutable
COPY --link . .
RUN yarn build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --link --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```dockerfile [npm]
FROM node:24-alpine AS build
WORKDIR /app
COPY --link package.json package-lock.json ./
RUN npm ci
COPY --link . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --link --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```dockerfile [bun]
FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY --link package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY --link . .
RUN bun run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --link --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

::

::tip
选择符合当前 Nuxt 版本 `engines.node` 范围的基础镜像。构建产物本身是普通 JavaScript，因此即使使用其他包管理器或运行时进行构建，运行阶段仍可使用 Node.js。
::

::note
`pnpm` 示例会复制 `pnpm-workspace.yaml`，因为 pnpm 会从该文件读取 `allowBuilds` 设置。如果缺少此文件，近期版本的 pnpm 遇到 `esbuild` 等依赖包含构建脚本时会停止安装。如果项目中没有 `pnpm-workspace.yaml`，请从 `COPY` 行中移除它。`yarn` 示例适用于 Yarn 2 或更高版本；使用 Yarn Classic 时请改用 `--frozen-lockfile`。`bun` 示例要求使用 Bun 1.2 引入的文本格式 `bun.lock`；如果项目仍使用二进制锁文件，请复制 `bun.lockb`。
::

## 忽略文件

请在 `Dockerfile` 旁添加 `.dockerignore` 文件，避免本地文件进入构建上下文。将主机上的 `node_modules` 复制进镜像，常会导致原生模块错误；过期的 `.nuxt` 或 `.output` 也可能悄悄覆盖刚生成的构建产物。

```bash [.dockerignore]
.git
.gitignore
.nuxt
.output
.data
node_modules
dist
Dockerfile
.dockerignore
.env
.env.*
*.log
```

`COPY . .` 会发送此列表中未排除的所有文件，因此请将其他包含凭据的文件也加入排除列表。例如，除非构建需要，否则应排除包含注册表令牌的 `.npmrc`。

## 构建和运行

```bash [Terminal]
docker build -t my-nuxt-app .
docker run --rm -p 3000:3000 my-nuxt-app
```

现在可以通过 `http://localhost:3000` 访问应用。

## 环境变量

服务器启动时会读取以下变量：

- `NITRO_PORT` 或 `PORT`（默认值为 `3000`）
- `NITRO_HOST` 或 `HOST`（默认值为 `0.0.0.0`）

[`runtimeConfig`](/docs/api/nuxt-config#runtimeconfig) 下的值可以由对应的 `NUXT_` 前缀变量覆盖，因此同一镜像可以部署到多个环境。以下配置：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    public: {
      siteUrl: ''
    }
  }
})
```

启动时，`NUXT_API_SECRET` 和 `NUXT_PUBLIC_SITE_URL` 会分别覆盖这两个配置项：

```bash [Terminal]
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e NUXT_API_SECRET=your-secret \
  -e NUXT_PUBLIC_SITE_URL=https://example.com \
  my-nuxt-app
```

::important
上面的服务器变量以及通过 `NUXT_*` 对应项传入的 `runtimeConfig` 值，都会在容器启动时读取，因此一个镜像即可用于所有环境。构建时解析的值之后无法更改，例如客户端代码中的 `import.meta.env`。如果需要针对不同环境设置这类值，请在构建阶段声明 `ARG`，通过 `--build-arg` 传入，并重新构建镜像。

上面的 `.dockerignore` 会将 `.env` 文件排除在构建上下文之外，因此其中的值必须在运行时提供。
::

## Docker Compose

```yaml [compose.yml]
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      NUXT_PUBLIC_SITE_URL: https://example.com
    restart: unless-stopped
```

```bash [Terminal]
docker compose up --build
```

## 静态站点

如果应用已完全预渲染，请使用 `nuxt generate` 构建，并通过任意静态 Web 服务器提供 `.output/public`。以下示例使用 nginx，并将生成的 `404.html` 配置为未知 URL 的响应页面：

```dockerfile [Dockerfile]
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm generate

FROM nginx:alpine AS runtime
COPY --link --from=build /app/.output/public /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  root /usr/share/nginx/html;

  location / {
    try_files $uri $uri/index.html =404;
  }

  error_page 404 /404.html;
}
EOF
EXPOSE 80
```

::tip
若要让客户端路由处理未预渲染的 URL，请将 `=404` 替换为 `/200.html`。这些 URL 随后会返回 `200` 状态码，而不是 `404`。
::

::read-more{to="/docs/getting-started/deployment#static-hosting"}
了解更多关于**静态托管**和回退页面的信息。
::

## 了解更多

::read-more{to="https://nitro.build/deploy/runtimes/node" target="_blank"}
请前往 **Nitro 文档**了解 Node.js 运行时的更多信息。
::
