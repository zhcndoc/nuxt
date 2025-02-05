---
title: Edgio
description: '在 Edgio 基础设施上部署你的 Nuxt 应用程序。'
logoIcon: 'i-logos-edgio-icon'
category: Hosting
nitroPreset: 'edgio'
website: https://edgio.app
---

Nuxt 提供了一个内置预设，用于生成与 [Edgio (以前是 Layer0)](https://edg.io/) 兼容的输出格式。

Edgio（以前是 Layer0）通过不仅托管您的静态内容，还为渐进式Web应用程序提供服务器端渲染以及在网络边缘缓存 API 和 HTML，以提供最快的浏览体验，扩展了传统CDN的功能。

如果这是您第一次部署到 Edgio，请使用 `deploy` 命令的交互式 CLI 提示您使用浏览器进行身份验证。您也可以在部署前 [注册](https://edgio.app/signup)。

## 安装 Edgio CLI

```bash
npm i -g @edgio/cli
```

## 使用 Edgio 在本地测试生产构建

您可以使用 Nitropack 在本地测试您应用的开发体验：

```bash
npx nuxi build --preset=edgio
```

要在本地模拟应用在使用 Edgio 的生产环境中运行的情况，请运行以下命令：

```bash
edgio build && edgio run --production
```

## 从本地机器部署

在本地测试应用程序后，您可以使用以下命令部署：

```bash
edgio deploy
```

## 使用 CI/CD 部署

如果要从非交互式环境部署，您需要首先在 [Edgio Developer Console](https://app.layer0.co) 上创建一个帐户，并设置一个 [部署令牌](https://docs.edg.io/guides/basics/deploy#deploy-from-ci)。创建部署令牌后，将其保存为环境的秘密。您可以通过运行以下命令开始部署：

```bash
edgio deploy --token=XXX
```

## 了解更多

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/edgio" target="_blank"}
前往 **Nitro 文档** 了解更多关于 Edgio 部署预设的信息。
::
