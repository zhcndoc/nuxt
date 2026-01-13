---
title: Northflank
description: '将您的 Nuxt 应用部署到 Northflank 基础设施。'
logoSrc: '/assets/integrations/northflank.svg'
category: Hosting
nitroPreset: 'node'
website: 'https://www.northflank.com/'
---

Nuxt 支持以最小配置部署到 [Northflank](https://www.northflank.com)。

## 设置

1. 在 Northflank 中链接您的 [Git 提供商](https://northflank.com/docs/v1/application/getting-started/link-your-git-account) 并 [创建一个新项目](https://northflank.com/docs/v1/application/getting-started/create-a-project)。
   
2. 在您的项目中，创建一个 [服务](https://northflank.com/docs/v1/application/getting-started/build-and-deploy-your-code)，并将其连接到您的 Nuxt 仓库。

3. 确保您的 package.json 中包含一个启动脚本，用于运行 Nuxt 生产服务器。
  ```json [package.json]
  {
    "scripts": {
      "start": "node .output/server/index.mjs"
    }
  }
  ```

4. 点击“创建服务”以构建并部署您的 Nuxt 应用。

::read-more{to="https://northflank.com/docs" target="_blank"}
更多信息，请参阅 **Northflank 文档**。
::