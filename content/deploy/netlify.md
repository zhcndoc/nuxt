---
title: Netlify
description: '将您的 Nuxt 应用部署到 Netlify 基础设施。'
componentImg: Netlify
logoIcon: 'i-logos-netlify-icon'
category: Hosting
featured: true
nitroPreset: 'netlify'
website: https://www.netlify.com/
---

::tip
**零配置 ✨**
:br
与 Netlify 的集成无需任何配置，[了解更多](https://nitro.zhcndoc.com/deploy#zero-config-providers)。
::

## 设置

Nuxt 会自动检测您是否在 [Netlify](https://www.netlify.com) 构建环境中，并构建优化版本的服务器端。

对于新站点，Netlify 将检测您是否使用的是 Nuxt 3，并将发布目录设置为 `dist`，构建命令设置为 `npm run build`。

::note
如果您正在从 Nuxt 2 升级现有站点，请检查这些设置并根据需要进行更新。
::

如果您想添加自定义重定向，可以使用 [`routeRules`](/docs/guide/concepts/rendering#hybrid-rendering) 或向 `public` 目录添加一个 [`_redirects`](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file) 文件来实现。

::tip{color="green" icon="i-lucide-check-circle"}
对于部署，只需像往常一样将其推送到您的 git 仓库 [就像您通常为 Netlify 所做的那样](https://docs.netlify.com/configure-builds/get-started/)。
::

## Netlify Edge Functions

::read-more{to="https://www.netlify.com/blog/announcing-serverless-compute-with-edge-functions" target="_blank"}
Netlify Edge Functions 使用 Deno 和强大的 V8 JavaScript 运行时，在全球范围内运行分布式函数，以实现最快的响应时间。
::

设置以下环境变量来在 Edge Functions 上运行 Nuxt：

```bash
SERVER_PRESET=netlify_edge
```

## 按需生成器

按需生成器是用于根据需要生成网页内容的无服务器函数，自动缓存在 Netlify 的 Edge CDN 上。

它们使您能够在用户首次访问页面时为站点生成页面，然后将其缓存在边缘位置，直到下次部署。

::read-more{to="https://docs.netlify.com/configure-builds/on-demand-builders/" target="_blank"}
了解更多关于 Netlify 按需生成器的内容
::

设置以下环境变量以启用按需生成器：

```bash
SERVER_PRESET=netlify_builder
```

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/netlify" target="_blank"}
请查阅 **Nitro 文档** 以了解有关 netlify 部署预设的更多信息。
::
