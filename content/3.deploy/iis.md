---
title: IIS
description: '将您的 Nuxt 应用程序部署到 IIS 基础架构。'
logoSrc: '/assets/integrations/microsoft.webp'
category: Hosting
nitroPreset: 'iis'
website: 'https://www.iis.net/'
---

## 使用 IISnode

1. 在您的 Windows Server 上安装最新的 LTS 版本 [Node.js](https://nodejs.org/en/)。
2. 安装 [IISnode](https://github.com/azure/iisnode/releases)。
3. 安装 [IIS `URLRewrite` 模块](https://www.iis.net/downloads/microsoft/url-rewrite)。
4. 在 IIS 中，将 `.mjs` 添加为新的 mime 类型，并将其内容类型设置为 `application/javascript`。
5. 使用以下命令构建您的应用程序：
    ```bash [Terminal]
    npx nuxi build --preset=iis_node
    ```
5. 将 `.output` 文件夹的内容部署到您在 IIS 中的网站上。


## 更多选项

::read-more{to="https://nitro.unjs.io/deploy/providers/iis" target="_blank"}
查阅 **Nitro 文档** 以了解有关 IIS 部署预设的更多信息。
::
