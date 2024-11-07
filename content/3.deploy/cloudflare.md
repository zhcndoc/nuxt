---
title: Cloudflare
description: '在 Cloudflare 基础设施上部署你的 Nuxt 应用。'
logoSrc: '/assets/integrations/cloudflare.svg'
category: Hosting
nitroPreset: 'cloudflare'
website: 'https://pages.cloudflare.com/'
---

## Cloudflare Pages

::tip
**零配置 ✨**
:br
与 Cloudflare Pages 的集成可以零配置完成，[了解更多](https://nitro.zhcndoc.com/deploy#zero-config-providers)。
::

::important
查看 [@nuxthub/core](/modules/hub) 模块以使用 Cloudflare 构建全栈 Nuxt 应用程序，详细信息请查看 [hub.nuxt.com](https://hub.nuxt.com)。
::

### Git 集成

如果你在 Cloudflare Pages 上使用 GitHub/GitLab 集成，**无需配置**。推送到你的仓库会自动构建项目并部署。

::note
Nuxt 会检测环境并自动设置正确的 [服务器/Nitro 预设](https://nitro.zhcndoc.com/deploy/providers/cloudflare)。
::

为了在边缘服务器上进行服务器端渲染，请将构建命令设置为：`nuxt build`

为了静态生成你的网站，请将构建命令设置为：`nuxt generate`

### 路由匹配

在 Cloudflare Pages 上，如果找到与当前请求路径相匹配的 HTML 文件，将会提供它。同时，它还会将 HTML 页面重定向至没有扩展名的对应页面：例如，`/contact.html` 会被重定向至 `/contact`，`/about/index.html` 会被重定向至 `/about/`。

为了匹配 Cloudflare 的 [路由匹配](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching) 规则，请将 nitro 选项 `autoSubfolderIndex` 设置为 `false`。

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  }
})
```

### 直接上传

或者，你可以使用 [wrangler](https://github.com/cloudflare/workers-sdk) 将你的项目上传至 Cloudflare。

在这种情况下，你需要手动设置预设。

1. 为 Cloudflare Pages 构建你的项目：

    ```bash [终端]
    npx nuxi build --preset=cloudflare_pages
    ```

2. 部署，首次部署时会要求你创建一个项目：

    ```bash [终端]
    wrangler pages deploy dist/
    ```

## 禁用自动缩小

确保在 **CloudFlare -> 速度 -> 优化 -> 自动缩小** 中禁用 HTML、CSS 和 JavaScript 的缩小，以避免任何 Vue 的 hydration。

![禁用 Cloudflare 自动缩小](/assets/deploy/cloudflare-auto-minify.png)

## 了解更多

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/cloudflare" target="_blank"}
请参阅 **Nitro 文档** 以了解更多关于 Cloudflare 部署预设的信息。
::

::read-more{to="https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/#use-bindings-in-your-nuxt-application" target="_blank"}
请参阅 **CloudFlare Pages 文档** 以了解更多信息。
::

## 模板

::card-group
  ::card
  ---
  icon: i-simple-icons-github
  title: Atidone
  to: https://github.com/atinux/atidone
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  包含用户认证、SSR 和 Cloudflare D1 的待办事项应用。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atinotes
  to: https://github.com/atinux/atinotes
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  基于 Cloudflare KV 的可编辑网站，具有通用渲染。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Atidraw
  to: https://github.com/atinux/atidraw
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  通过 Cloudflare R2 和人工智能，让您可以绘制并与世界分享您的绘画的网络应用程序。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Image Gallery
  to: https://github.com/flosciante/nuxt-image-gallery
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  使用 Cloudflare R2 上传、编辑和共享图像的图像库。
  ::
::

## 了解更多

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/cloudflare" target="_blank"}
请参阅 **Nitro 文档** 以了解更多关于 cloudflare 部署预设的信息。
::
