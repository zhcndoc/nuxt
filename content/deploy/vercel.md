---
title: Vercel
description: '将你的 Nuxt 应用部署到 Vercel 基础设施。'
componentImg: Vercel
logoSrc: '/assets/integrations/vercel.svg'
category: Hosting
nitroPreset: 'vercel'
website: 'https://vercel.com/'
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

## Vercel 边缘函数

可以直接在[Vercel 边缘函数](https://vercel.com/docs/concepts/functions/edge-functions)上部署你的 Nuxt 应用程序。

> Vercel 边缘函数可以让你以高速和个性化服务，向站点的访问者提供内容。
> 它们默认在 Vercel 的边缘网络上全球部署，并且可以将服务器端逻辑移至边缘，靠近访问者的源。
> 边缘函数使用的是 Vercel 边缘运行时，它构建在与 Chrome 浏览器使用相同高性能的 V8 JavaScript 和 WebAssembly 引擎上。
> 通过利用这个小型运行时，边缘函数可以具有更快的冷启动和更高的可扩展性，优于无服务器函数。
> 边缘函数在缓存后运行，可以缓存并返回响应。[了解更多](https://vercel.com/docs/concepts/functions/edge-functions)。

为了启用此目标，请设置以下环境变量：

```bash
SERVER_PRESET=vercel_edge
```

或将构建命令更新为 `nuxt build --preset=vercel_edge`。

## Vercel KV 存储

你可以轻松使用[Vercel KV 存储](https://vercel.com/docs/storage/vercel-kv)与[Nuxt 服务器存储](/docs/guide/directory-structure/server#server-storage)结合使用。

::read-more{to="https://unstorage.unjs.io/drivers/vercel-kv" target="_blank"}
在 Unstorage 文档中阅读有关 Vercel KV 驱动的更多信息。
::

1. 安装 `@vercel/kv` 依赖：

    ```bash [终端]
    npm i @vercel/kv
    ```

2. 更新 `nuxt.config.ts` 文件：

    ```ts [nuxt.config.ts]
    export default defineNuxtConfig({
      nitro: {
        storage: {
          data: {
            driver: 'vercelKV'
            /* Vercel KV 驱动选项 */
          }
        }
      }
    })
    ```

::caution
你需要设置 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 环境变量，或者将 `url` 和 `token` 传递给驱动选项。请查阅[驱动文档](https://unstorage.unjs.io/drivers/vercel-kv)以了解更多有关使用方法的信息。
::

现在你可以在 `server/` 目录的任何地方访问你的数据存储：

```ts [server/routes/hello.ts]
export default defineEventHandler(async (event) => {
  const dataStorage = useStorage('data');
  await dataStorage.setItem('hello', 'world');

  return {
    hello: await dataStorage.getItem("hello"),
  }
})
```

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
