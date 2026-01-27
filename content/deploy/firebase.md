---
title: Firebase
description: '在 Firebase 基础设施上部署您的 Nuxt 应用程序。'
logoIcon: 'i-logos-firebase'
category: Hosting
nitroPreset: 'firebase'
website: 'https://firebase.google.com/'
---

## Firebase 应用托管（推荐）

::note
您需要在 [**Blaze 计划**](https://firebase.google.com/pricing)（按需付费）上才能开始。
::

:read-more{title="Firebase 应用托管" to="https://firebase.google.com/docs/app-hosting"}

### 项目设置

1. 访问 Firebase [控制台](https://console.firebase.google.com/) 并设置一个新项目。
2. 从侧边栏选择 **Build > App Hosting**。
    - 您可能需要在此步骤中升级您的计费计划。
3. 点击 **开始**。
    - 选择一个区域。
    - 导入一个 GitHub 仓库（您需要链接您的 GitHub 账户）。
    - 配置部署设置（项目根目录和分支），并启用自动发布。
    - 为您的后端选择一个唯一的 ID。
4. 点击完成 & 部署以创建您的第一次发布。

当您使用 Firebase 应用托管进行部署时，应用托管预设将在构建时自动运行。

## Firebase 函数（已弃用）

::important
这种部署方法已弃用，不推荐使用。Firebase 应用托管是将 Nuxt 应用部署到 Firebase 的推荐方式。
::

要使用更近且推荐的 Firebase 函数版本，将 `firebase.gen` 选项设置为 `2`：

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

如果您已经部署了网站的旧版本并希望升级到第二代，请参见[在 Firebase 文档中的迁移过程](https://firebase.google.com/docs/functions/2nd-gen-upgrade)。具体而言，CLI 将要求您在部署新函数之前删除现有函数。

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

通过运行 Nuxt 构建，然后运行 `firebase deploy` 命令将其部署到 Firebase 托管。

```bash
npm run build -- --preset=firebase
firebase deploy
```

## 选项

您可以在 `nuxt.config.ts` 文件中设置 Firebase 函数的选项：

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

## 其他云函数

您可能会收到警告，指在您部署 Nuxt 项目时其他云函数将被删除。这是因为 Nitro 将把您的整个项目部署到 Firebase 函数。如果您只想部署您的 Nuxt 项目，可以使用 `--only` 标志：

```bash
firebase deploy --only functions:server,hosting
```

::read-more{to="https://nitro.unjs.io/deploy/providers/firebase" target="_blank"}
前往 **Nitro 文档** 以了解有关 Firebase 部署预设的更多信息。
::

## 在生产中使用 Cookies

在使用 Firebase 托管与 Cloud Functions 或 Cloud Run 一起时，为了实现高效的 CDN 缓存行为，通常会从传入请求中删除 cookie。只有名为 `__session` 的特别命名 cookie 可以传递到您的应用程序。

::阅读更多{to="https://firebase.google.com/docs/hosting/manage-cache#using_cookies" target="\_blank"}
有关更多信息，请参阅 **Firebase 文档**。
::

## 使用环境变量

要为您的 Firebase 函数设置环境变量，您需要将 `.env` 文件复制到 `.output/server` 目录。
您可以通过在 `package.json` 中添加一个 `postbuild` 脚本来实现，这个脚本将在构建命令后自动运行：

```json [package.json]
{
  "scripts": {
    "postbuild": "cp .env .output/server/.env"
  }
}
```

::read-more{to="https://firebase.google.com/docs/functions/config-env?gen=2nd#env-variables" target="_blank"}
有关更多信息，请参阅 **Firebase 文档**。
::
