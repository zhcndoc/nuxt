---
title: Deno Deploy
description: '将你的 Nuxt 应用部署到 Deno Deploy 基础设施。'
logoIcon: 'i-logos-deno'
category: Hosting
nitroPreset: 'deno-deploy'
website: 'https://deno.com/deploy'
---

::important
Deno deploy 预设是实验性的。
::

## 使用 CLI 进行部署

你可以使用 [deployctl](https://deno.com/deploy/docs/deployctl) 来部署你的应用程序。

登录到 [Deno Deploy](https://dash.deno.com/account#access-tokens) 获取 `DENO_DEPLOY_TOKEN` 访问令牌，并将其设置为环境变量。

```bash
# 使用 deno_deploy 预设进行构建
npm run build --preset=deno_deploy

# 确保从输出目录运行 deployctl 命令
cd .output
deployctl deploy --project=my-project server/index.ts --token=<DENO_DEPLOY_TOKEN>
```

## 使用 GitHub Actions 在 CI/CD 中部署

将你的 GitHub 仓库链接到 Deno Deploy 项目并选择 "GitHub Actions" 部署模式。你可以在 https://dash.deno.com 上的项目设置中完成这个步骤。

在你的仓库中创建一个 GitHub action 文件：

```yaml [.github/workflows/deno_deploy.yml]
name: deno-deploy
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  deploy:
    steps:
      - uses: actions/checkout@v3
      - run: corepack enable
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
        env:
          NITRO_PRESET: deno_deploy
      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: <my-project>
          entrypoint: server/index.ts
          root: .output
```

::important
确保将 `<my-project>` 重命名为你的项目名称。
::

## 模板

::card-group
  ::card
  ---
  icon: i-simple-icons-github
  title: Nuxt Deno KV
  to: https://github.com/Atinux/nuxt-deno-kv
  target: _blank
  ui.icon.base: text-black dark:text-white
  ---
  使用 Deno KV 和 Nuxt 构建的协作待办事项应用。
  ::
::

## 了解更多

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/deno-deploy" target="_blank"}
详细了解 deno-deploy 部署预设，请参阅 **Nitro 文档**。
::
