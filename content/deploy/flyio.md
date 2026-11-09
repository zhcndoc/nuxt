---
title: Fly.io
description: '将 Nuxt 应用部署到 Fly.io 基础设施。'
logoIcon: 'i-simple-icons-flydotio'
category: Hosting
nitroPreset: 'node'
website: 'https://fly.io/'
---

Nuxt 支持通过少量配置部署到 [Fly.io](https://fly.io/)。

## 使用 Fly CLI

1. 安装 [flyctl](https://docs.fly.io/flyctl/install) 并登录。

    ```bash [Terminal]
    fly auth login
    ```

2. 在项目根目录创建并部署新的 Fly 应用。`fly launch` 会检测到 Nuxt，并为您生成 `Dockerfile` 和 `fly.toml`。

    ```bash [Terminal]
    fly launch
    ```

3. 部署后续更改。

    ```bash [Terminal]
    fly deploy
    ```

## 了解更多

::read-more{to="https://docs.fly.io/js/frameworks/nuxtjs" target="_blank"}
请前往 **Fly.io 文档**了解在 Fly.io 上运行 Nuxt 的更多信息。
::
