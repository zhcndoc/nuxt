---
title: NuxtHub
description: '部署 Nuxt 应用到您的 Cloudflare 账户，完全无需配置。'
componentImg: NuxtHub
logoSrc: '/assets/integrations/nuxthub-logo.svg'
category: Hosting
featured: true
nitroPreset: 'cloudflare-pages'
website: 'https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page'
---

::tip
**零配置 ✨**
:br
与 NuxtHub 的集成完全无需配置，[了解更多](https://nitro.zhcndoc.com/deploy#zero-config-providers)。
::

## 介绍

NuxtHub 是一个为 Nuxt 设计的部署和管理工作平台，由 Cloudflare 提供支持。

与 [Cloudflare](/deploy/cloudflare) 部署的主要区别在于，NuxtHub 提供了零配置的部署体验（资源配置、部署和管理）。

它还提供了一个强大的管理界面，用于管理您的 Nuxt 项目（数据库、Blob、KV 等），以及 [远程存储](https://hub.nuxt.com/docs/getting-started/remote-storage?utm_source=nuxt-website&utm_medium=deploy-page)。

在 [hub.nuxt.com](https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page) 上阅读更多信息。

## NuxtHub CLI

您可以使用一个命令部署您的本地项目：

```bash [Terminal]
npx nuxthub deploy
```

该命令将：
1. 确保您在 [admin.hub.nuxt.com](https://admin.hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page) 上登录
2. 将您的本地项目与 NuxtHub 项目关联，或帮助您创建一个新的项目
3. 使用正确的预设构建您的 Nuxt 项目
4. 将它部署到您的 Cloudflare 账户，并部署所有必要的资源
5. 提供一个访问您的项目的 URL

观看示例视频：

::video{poster="https://res.cloudinary.com/nuxt/video/upload/v1723569534/nuxthub/nuxthub-deploy_xxs5s8.jpg" controls class="rounded dark:border dark:border-gray-700 md:w-2/3"}
  :source{src="https://res.cloudinary.com/nuxt/video/upload/v1723569534/nuxthub/nuxthub-deploy_xxs5s8.webm" type="video/webm"}
  :source{src="https://res.cloudinary.com/nuxt/video/upload/v1723569534/nuxthub/nuxthub-deploy_xxs5s8.mp4" type="video/mp4"}
  :source{src="https://res.cloudinary.com/nuxt/video/upload/v1723569534/nuxthub/nuxthub-deploy_xxs5s8.ogg" type="video/ogg"}
::

::note
您还可以使用以下命令全局安装 [NuxtHub CLI](https://github.com/nuxt-hub/cli)：`npm i -g nuxthub`。
::

## 使用 Git 部署

1. 将您的代码推送到您的 git 仓库（GitHub）
2. 点击 `新项目` 然后 `导入 Git 仓库`
3. 选择您的仓库并点击 `导入仓库`
4. NuxtHub 将配置一个 GitHub Action 工作流来部署您的项目
5. 您的应用程序已部署在 `.nuxt.dev` 域名上

在您的项目被导入和部署后，所有后续推送到分支将生成预览部署，对生产分支（通常为“main”）所做的所有更改将导致生产部署。

## 模板

::card-group
  ::card
  ---
  icon: i-simple-icons-github
  title: Hello Edge
  to: https://github.com/nuxt-hub/hello-edge
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个在边缘运行的 Nuxt 最小启动器。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: NuxtHub Starter
  to: https://github.com/nuxt-hub/starter
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个启动器，用于开始使用 NuxtHub 功能（数据库、Blob、KV 等）。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atidone
  to: https://github.com/atinux/atidone
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个带有身份验证和数据库的全栈应用，用于管理您的待办事项。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Image Gallery
  to: https://github.com/flosciante/nuxt-image-gallery
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个图像画廊，用于上传、编辑和与世界分享您的图像。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atinotes
  to: https://github.com/atinux/atinotes
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个由 Markdown 和 Vue 组件驱动的可编辑网站，具有动态 OG 图像生成功能。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atidraw
  to: https://github.com/atinux/atidraw
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个让您能够在世界各地绘制和分享您画作的应用，使用 Cloudflare R2 & AI。
  ::
::

::callout
在 https://hub.nuxt.com/templates 查看完整的模板列表。
::
