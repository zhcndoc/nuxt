---
title: Firebase
description: '在 Firebase 基础设施上部署您的 Nuxt 应用程序。'
logoIcon: 'i-logos-firebase'
category: Hosting
nitroPreset: 'firebase'
website: 'https://firebase.google.com/'
---

## Firebase Functions

要使用最新的和推荐的生成的 Firebase 函数，请将 `firebase.gen` 选项设置为 `2`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    firebase: {
      gen: 2
    }
  }
})
```

::注意
如果由于任何原因您不能使用配置的方式，您可以使用 `NITRO_FIREBASE_GEN=2` 环境变量。
::

如果您已经部署了网站的旧版本并希望升级到第二代，请参阅[在 Firebase 文档中的迁移过程](https://firebase.google.com/docs/functions/2nd-gen-upgrade)。具体而言，CLI 将要求您在部署新函数之前删除现有函数。

::提示{to="https://firebase.google.com/docs/functions/version-comparison" target="_blank"}
第一代和第二代函数之间的比较
::

## 项目设置

您可以选择使用 Firebase CLI 设置项目，它将为您提取项目 ID，添加所需的依赖项（参见上文），甚至通过 GitHub Actions 设置自动部署（仅适用于托管）。[了解如何安装 Firebase CLI](https://firebase.google.com/docs/cli#windows-npm)。

1. 安装最新版本的 Firebase CLI。

    ```bash [命令行]
    npm install -g firebase-tools@latest
    ```

2. 初始化 Firebase 项目

    ```bash [命令行]
    firebase login
    firebase init hosting
    ```

::注意
当提示时，您可以将 `.output/public` 输入为公共目录。在下一步中，**不要**将您的项目配置为单页面应用程序。
::

完成后，将以下内容添加到您的 `firebase.json` 文件中，以在 Cloud Functions 中启用服务器端呈现：

```json [firebase.json]
{
  "functions": { "source": ".output/server" },
  "hosting": [
    {
      "site": "<your_project_id>",
      "public": ".output/public",
      "cleanUrls": true,
      "rewrites": [{ "source": "**", "function": "server" }]
    }
  ]
}
```

## 本地预览

如果您需要在不部署的情况下测试，请预览您网站的本地版本。

```bash
npm run build -- --preset=firebase
firebase emulators:start
```

## 构建和部署

通过运行 Nitro 构建，然后运行 `firebase deploy` 命令，将项目部署到 Firebase 托管。

```bash
npm run build -- --preset=firebase
firebase deploy
```

## 选项

您可以在 `nuxt.config.ts` 文件中为 Firebase 函数设置选项：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    firebase: {
      gen: 2,
      httpsOptions: {
        region: 'europe-west1',
        maxInstances: 3,
      },
    },
  },
});
```

### 运行时 Node.js 版本

您可以在配置中设置自定义 Node.js 版本：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    firebase: {
      nodeVersion: '18' // 可以是 '16' 或 '18' 或 '20'
    },
  },
});
```

Firebase 工具使用 `package.json` 中的 `engines.node` 版本来确定要为函数使用哪个 Node.js 版本。Nuxt 会自动将配置的 Node.js 版本写入 `.output/server/package.json` 中。

您可能还需要向您的 `firebase.json` 文件中添加一个运行时键：

```json [firebase.json]
{
  "functions": {
    "source": ".output/server",
    "runtime": "nodejs20"
  }
}
```

::阅读更多{to="https://firebase.google.com/docs/functions/manage-functions?gen=2nd#set_nodejs_version" target="_blank"}
您可以在 **Firebase 文档** 中了解更多信息。
::

## 如果您的 Firebase 项目有其他云函数

在部署您的 Nuxt 项目时，您可能会收到有关删除其他云函数的警告。这是因为 nitro 会将整个项目部署到 Firebase 函数。如果您只想部署您的 Nuxt 项目，您可以使用 `--only` 标志：

```bash
firebase deploy --only functions:server,hosting
```

::阅读更多{to="https://nitro.unjs.io/deploy/providers/firebase" target="_blank"}
请参阅 **Nitro 文档** 以了解有关 Firebase 部署预设的更多信息。
::

## 在生产环境中使用 Cookies

在使用 Firebase 托管与 Cloud Functions 或 Cloud Run 一起时，为了实现高效的 CDN 缓存行为，通常会从传入请求中删除 cookie。只有名为 `__session` 的特别命名 cookie 可以传递到您的应用程序。

::阅读更多{to="https://firebase.google.com/docs/hosting/manage-cache#using_cookies" target="\_blank"}
有关更多信息，请参阅 **Firebase 文档**。
::
