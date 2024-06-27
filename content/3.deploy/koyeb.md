---
title: Koyeb
description: '将你的 Nuxt 应用部署到 Koyeb 基础设施上。'
logoIcon: 'i-simple-icons-koyeb'
category: Hosting
nitroPreset: 'koyeb'
website: 'https://www.koyeb.com/'
---

Nuxt 支持在 [Koyeb 无服务器平台](https://www.koyeb.com/docs) 上进行部署，只需进行最小配置即可。

## 设置

1. 按照 [指南](https://www.koyeb.com/docs/deploy/nuxt) 为 Nuxt 创建一个新的 Koyeb 应用。

2. 在项目的 `package.json` 文件中设置 `engines.node` 字段为 [Koyeb 支持的 Node.js 版本](https://www.koyeb.com/docs/build-and-deploy/build-from-git/nodejs#runtime)：

    ```json [package.json]
    {
      "engines": {
          "node": "20.x"
      }
    }
    ```

3. 确保项目的 `package.json` 文件中定义了 `build` 和 `start` 脚本，以定义如何构建和运行应用程序：

    ```json [package.json]
    {
      "scripts": {
          "build": "nuxt build",
          "start": "node .output/server/index.mjs"
      }
    }
    ```

4. 在部署过程中，您需要配置环境变量。在您的服务设置中，设置以下 [环境变量](https://www.koyeb.com/docs/build-and-deploy/environment-variables)：

    ```bash
    SERVER_PRESET=koyeb
    ```

5. 点击 "部署" 来构建和部署您的 Nuxt 应用。

## 了解更多

::read-more{to="https://nitro.unjs.io/deploy/providers/koyeb" target="_blank"}
前往 **Nitro 文档** 了解更多关于 Koyeb 部署预设的信息。
::
