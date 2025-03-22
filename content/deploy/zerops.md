---
title: Zerops
description: "将您的 Nuxt 应用部署到 Zerops 基础设施上。"
componentImg: Zerops
logoSrc: "/assets/integrations/zerops.svg"
category: Hosting
NuxtPreset: "zerops"
website: "https://zerops.io"
---

**Nodejs 预设**: `SERVER_PRESET: zerops`
**静态预设**: `SERVER_PRESET: zerops-static`

:read-more{title="Zerops" to="https://zerops.io"}

::tip
**Nuxt x Zerops 快速运行 ✨**
:br
想要测试在 Zerops 上运行 Nuxt，而不需要安装或设置任何东西？使用仓库 [Zerops x Nuxt - Static](https://github.com/zeropsio/recipe-nuxt-static) 或 [Zerops x Nuxt - SSR on Node.js](https://github.com/zeropsio/recipe-nuxt-nodejs)，您可以一键部署示例 Nuxt 应用。
::


Zerops 支持使用项目根目录中的简单配置文件部署静态和服务器端渲染的应用。

## 静态

项目和服务可以通过 [项目添加向导](https://app.zerops.io/dashboard/project-add) 添加，或者使用 YAML 结构导入：

### 创建项目

```yml [zerops-project-import.yml]
project:
  name: recipe-nuxt

services:
  - hostname: app
    type: static
```
这将创建一个名为 `recipe-nuxt` 的项目，配有一个名为 `app` 的 Zerops 静态服务。

### 设置 Zerops YAML

为了告诉 Zerops 如何构建和运行您的应用，请在根目录下添加一个 `zerops.yml`：

```yml [zerops.yml]
zerops:
  - setup: app
    build:
      base: nodejs@20
      buildCommands:
        - yarn
        - yarn nuxi generate
      deployFiles:
        - .output/public/~
    run:
      base: static
```

现在您可以通过 Zerops CLI 触发 [构建与部署管道](#building-deploying-your-app)，或者通过在服务详细信息中将应用服务连接到您的 [GitHub](https://docs.zerops.io/references/github-integration/) / [GitLab](https://docs.zerops.io/references/gitlab-integration) 仓库来实现。

## SSR Node.js

项目和服务可以通过 [项目添加向导](https://app.zerops.io/dashboard/project-add) 添加，或者使用 YAML 结构导入：

```yml [zerops-project-import.yml]
project:
  name: recipe-nuxt

services:
  - hostname: app
    type: nodejs@20
```

这将创建一个名为 `recipe-nuxt` 的项目，配有一个名为 `app` 的 Zerops Node.js 服务。

### 设置 Zerops YAML

为了告诉 Zerops 如何构建和运行您的应用，请在根目录下添加一个 `zerops.yml`：

```yml [zerops.yml]
zerops:
  - setup: nuxt
    build:
      base: nodejs@20
      buildCommands:
        - yarn
        - yarn build
      deployFiles:
        - .output/~
    run:
      base: nodejs@20
      ports:
        - port: 3000
          httpSupport: true
      start: node server/index.mjs
```

现在您可以通过 Zerops CLI 触发 [构建与部署管道](#building-deploying-your-app)，或者通过在服务详细信息中将应用服务连接到您的 [GitHub](https://docs.zerops.io/references/github-integration/) / [GitLab](https://docs.zerops.io/references/gitlab-integration) 仓库来实现。


## 构建与部署您的应用

- 安装 [Zerops CLI](https://github.com/zeropsio/zcli)。
```sh
npm i -g @zerops/zcli
```

- 在 Zerops 应用中打开 [设置 > 访问令牌管理](https://app.zerops.io/settings/token-management) 并生成一个新的访问令牌。

- 使用以下命令通过您的访问令牌进行登录：

```sh
zcli login <token>
```

- 导航到您的应用根目录（即 `zerops.yml` 所在位置），并运行以下命令以触发部署：

```sh
zcli push
```

通过将服务连接到您的 [GitHub](https://docs.zerops.io/references/gitlab-integration) / [GitLab](https://docs.zerops.io/references/gitlab-integration) 仓库，您可以在每次提交或创建新标签时自动部署代码。此连接可以在服务详细信息中进行设置。


:read-more{title="Zerops 文档" to="https://docs.zerops.io/"}
