---
title: NuxtHub
description: '在您的 Cloudflare 帐户上全球部署您的全栈 Nuxt 应用程序。'
componentImg: NuxtHub
logoSrc: '/assets/integrations/nuxthub.svg'
category: Hosting
featured: true
nitroPreset: 'cloudflare-pages'
website: 'https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page'
---

::tip
**零配置 ✨**
:br
与 NuxtHub 的集成可以零配置完成，[了解更多](https://nitro.unjs.io/deploy#zero-config-providers)。
::

::note
NuxtHub 是一个由 Cloudflare 提供支持的 Nuxt 部署和管理平台。 :br 与 [Cloudflare](/deploy/cloudflare) 部署的主要区别在于 NuxtHub 提供了零配置的部署体验（配置、部署和管理）。 :br 它还提供了一个强大的管理界面，用于管理您的 Nuxt 项目（数据库、blob、KV 等）以及 [远程存储](https://hub.nuxt.com/docs/getting-started/remote-storage?utm_source=nuxt-website&utm_medium=deploy-page)。
::

## 快速入门

- 登录到 [admin.hub.nuxt.com](https://admin.hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page)
- 点击 `Create a new token with required permissions` 按键连接您的 Cloudflare 帐户，并按照说明操作
- 现在您已经准备好将您的 Nuxt 项目部署到您的 Cloudflare 帐户了！

## 使用 Git 进行部署

1. 将代码推送到您的 Git 存储库（GitHub 或 GitLab）
2. 点击 `New Project`，然后选择 `Import a Git repository`
3. 选择您的仓库，然后点击 `Import repository`
4. NuxtHub 将在 Cloudflare Pages 上配置您的项目并进行部署
5. 您的应用程序将通过 `.nuxt.dev` 域名部署

在您的项目被导入并部署后，以后对分支的所有推送将生成预览部署，并且对生产分支（通常为“main”）所做的所有更改都将导致生产部署。

### NuxtHub CLI

::warning
如果您使用 NuxtHub CLI 进行第一次部署，由于 Cloudflare 的限制，您将无法在以后附加您的 GitHub/GitLab 存储库。
::

您可以使用单个命令部署您的本地项目:

```bash [Terminal]
npx nuxthub deploy
```

该命令将执行以下操作：
1. 确保您已登录到 [admin.hub.nuxt.com](https://admin.hub.nuxt.com/?utm_source=nuxt-website&utm_medium=deploy-page)
2. 将您的本地项目与 NuxtHub 项目关联或帮助您创建一个新的项目
3. 使用正确的预设构建您的 Nuxt 项目
4. 将其部署到您的 Cloudflare 帐户，并提供所有必要的资源
5. 提供一个链接以访问您的项目

::note
您还可以通过 `npm i -g nuxthub` 在全局安装 [NuxtHub CLI](https://github.com/nuxt-hub/cli)。
::

## 模板

::card-group
  ::card
  ---
  icon: i-simple-icons-github
  title: NuxtHub Starter
  to: https://github.com/nuxt-hub/starter
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个用于开始使用 NuxtHub 存储和功能的最小化起始模板。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Todos
  to: https://github.com/atinux/nuxt-todos-edge
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个带有身份验证和数据库以管理您的待办事项的全栈应用程序。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Image Gallery
  to: https://github.com/flosciante/nuxt-image-gallery
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个图片图库，可以上传、编辑和分享您的图像给世界。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atinotes
  to: https://github.com/atinux/atinotes
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  一个由 Markdown 和 Vue 组件提供支持的可编辑网站，具有动态 OG 图片生成功能。
  ::
::

::callout
查看完整的模板列表，请访问 https://hub.nuxt.com/templates
::
