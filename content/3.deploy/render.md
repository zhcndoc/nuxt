---
title: Render
description: '部署您的 Nuxt 应用到 Render 基础设施。'
logoSrc: '/assets/integrations/render.png'
category: Hosting
nitroPreset: 'render'
website: 'https://render.com/'
---

Nuxt 支持在 [Render](https://render.com/) 上进行部署，并且配置最小。

## 设置应用程序

1. [创建一个新的 Web 服务](https://dashboard.render.com/select-repo?type=web) 并选择包含您代码的仓库。
2. 确保选择了 Node 环境。
3. 根据您的包管理器，将构建命令设置为 `yarn && yarn build`、`npm install && npm run build` 或者 `pnpm i --shamefully-hoist && pnpm build`。
4. 将启动命令更新为 `node .output/server/index.mjs`。
5. 点击 '高级' 并添加以下环境变量
    ```bash
    SERVER_PRESET=render_com
    NODE_VERSION=20
    ```
6. 点击 `创建 Web 服务`。

## 更多选项

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/render" target="_blank"}
请前往 **Nitro 文档** 了解有关 Render 部署预设的更多信息。
::
