---
title: Heroku
description: '将你的 Nuxt 应用部署到 Heroku 基础设施上。'
logoSrc: '/assets/integrations/heroku.svg'
category: Hosting
nitroPreset: 'heroku'
website: 'https://www.heroku.com/'
---

Nuxt 支持在 [Heroku](https://heroku.com/) 上进行部署，只需进行最少的配置。

## 使用 Heroku CLI

1. 创建一个新的 Heroku 应用。

    ```bash [Terminal]
    heroku create myapp
    ```

2. 配置 Heroku 使用 nodejs buildpack。

    ```bash [Terinal]
    heroku buildpacks:set heroku/nodejs
    ```

3. 配置你的应用。

    ```bash [Terminal]
    heroku config:set SERVER_PRESET=heroku
    ```

4. 确保你的 `package.json` 文件中有 `start` 和 `build` 命令。

    ```json [package.json]
    {
      "scripts": {
        "build": "nuxt build",
        "start": "node .output/server/index.mjs"
      }
    }
    ```

## 了解更多

::read-more{to="https://nitro.unjs.io/deploy/providers/heroku" target="_blank"}
请访问 **Nitro 文档** 以了解更多关于 Heroku 部署预设的信息。
::
