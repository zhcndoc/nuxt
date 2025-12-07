---
title: Vercel
description: '将你的 Nuxt 应用部署到 Vercel 基础设施。'
componentImg: Vercel
logoSrc: '/assets/integrations/vercel.svg'
category: Hosting
nitroPreset: 'vercel'
website: 'https://vercel.com/'
sponsor: true
---

::tip
**无需配置 ✨**
:br
与 Vercel 的集成可以零配置完成，[了解更多](https://nitro.zhcndoc.com/deploy#zero-config-providers)。
::

## 使用 Git 进行部署

1. 将你的代码推送到 Git 代码仓库（GitHub、GitLab、Bitbucket）。
2. [将你的项目导入](https://vercel.com/new) 到 Vercel。
3. Vercel 将会检测到你正在使用 Nitro 并为你的部署启用正确的设置。
4. 你的应用将被部署！

在导入和部署你的项目之后，对分支的后续推送将会生成[预览部署](https://vercel.com/docs/concepts/deploy/environments#preview)，而对生产分支（通常为“main”）所做的所有更改都将导致[生产部署](https://vercel.com/docs/concepts/deploy/environments#production)。

了解更多关于 Vercel 的[Git 集成](https://vercel.com/docs/concepts/git)的内容。

## 自定义构建输出配置

您可以通过在 `nuxt.config.ts` 中使用 `nitro.vercel.config` 键提供额外的 [构建输出配置](https://vercel.com/docs/build-output-api/v3)。它将与内置的自动生成配置合并。

## 模板

::card-group
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Vercel ISR
  to: https://github.com/danielroe/nuxt-vercel-isr
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  在 Vercel 上部署的 Nuxt 应用程序的示例，使用混合渲染。
  ::
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt on the Edge on Vercel
  to: https://github.com/pi0/nuxt-on-the-edge
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  在 Vercel Edge Functions 上运行的 Nuxt 应用程序的示例。
  ::
::

## 了解更多

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/vercel" target="_blank"}
请前往**Nitro 文档**，了解更多关于按需增量静态再生（On-Demand Incremental Static Regeneration）或更高级选项的内容。
::
