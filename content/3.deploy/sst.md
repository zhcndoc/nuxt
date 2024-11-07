---
title: SST
description: '将您的 Nuxt 应用部署到 AWS，使用 SST。'
logoSrc: '/assets/integrations/sst.svg'
category: Hosting
nitroPreset: 'aws-lambda'
website: 'https://sst.dev/'
---

Nuxt 支持以最小配置在 [SST](https://sst.dev/) 上部署。

## 快速开始

1. 创建一个 Nuxt 项目。
2. 在您的项目中初始化 SST。
   ```bash
   npx sst@latest init
   ```
3. 它应该会检测到您正在使用 Nuxt，并询问您是否更新 `nuxt.config.ts` 文件。
   ```ts
   nitro: {
     preset: 'aws-lambda'
   }
   ```
4. 准备好部署后，运行。
   ```bash
   npx sst deploy --stage production
   ```

您可以在这里 [阅读完整的 Nuxt 在 SST 上的教程](https://sst.dev/docs/start/aws/nuxt)。

## 更多选项

您还可以使用 SST 将 Nuxt 部署到容器中。请前往 [SST 文档以了解更多](https://sst.dev/docs/start/aws/nuxt)。
