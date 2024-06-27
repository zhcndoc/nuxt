---
title: Digital Ocean
description: '在 Digital Ocean 基础设施上部署您的 Nuxt 应用程序。'
logoSrc: '/assets/integrations/digitalocean.svg'
category: Hosting
nitroPreset: 'digitalocean'
website: 'https://www.digitalocean.com/'
---

Nuxt 支持在 [Digital Ocean App 平台](https://docs.digitalocean.com/products/app-platform/) 上进行最小化配置的部署。

## 设置

1. 按照[指南](https://docs.digitalocean.com/products/app-platform/how-to/create-apps/)创建一个新的 Digital Ocean 应用。

2. 接下来，您需要配置环境变量。在您的应用程序设置中，确保以下[应用程序级环境变量](https://docs.digitalocean.com/products/app-platform/how-to/use-environment-variables/)已经配置好：

    ```bash
    SERVER_PRESET=digital-ocean
    ```

3. 您需要确保在应用程序的 `package.json` 中设置一个 `engines.node` 字段，以确保 Digital Ocean 使用支持的 Node.js 版本：

    ```json [package.json]
    {
      "engines": {
          "node": "20.x"
      }
    }
    ```

4. 您还需要添加一个运行命令，以便 Digital Ocean 知道在构建后运行什么命令。您可以通过向 `package.json` 添加一个启动脚本来实现：

    ```json [package.json]
    {
      "scripts": {
          "start": "node .output/server/index.mjs"
      }
    }
    ```

5. 最后，您需要将此启动脚本添加到您的 Digital Ocean 应用的运行命令中。转到 `Components > Settings > Commands`，点击“Edit”，然后添加 `npm run start`。

::tip
您的 Nuxt 应用程序应该在由 Digital Ocean 生成的 URL 上运行，现在您可以按照[Digital Ocean 部署指南的其余部分](https://docs.digitalocean.com/products/app-platform/how-to/manage-deployments/)进行操作了。
::

## 了解更多

::read-more{to="https://nitro.unjs.io/deploy/providers/digitalocean" target="_blank"}
请访问**Nitro 文档**以了解有关 digitalocean 部署预设的更多信息。
::
