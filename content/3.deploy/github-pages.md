---
title: GitHub Pages
description: '将你的 Nuxt 应用部署到 GitHub Pages 基础设施。'
logoIcon: 'i-simple-icons-github'
category: Hosting
nitroPreset: 'github-pages'
website: 'https://pages.github.com/'
---

Nuxt 支持通过最小化配置部署到 [GitHub Pages](https://pages.github.com/)。

::caution
GitHub Pages 仅支持静态站点，Nuxt 将会将您的应用预渲染为静态 HTML 文件。
::

::caution
如果您**没有**使用自定义域名，您需要将 `NUXT_APP_BASE_URL` 设置为您的存储库标识以进行构建步骤。

**示例**: `https://<user>.github.io/<repository>/`: `NUXT_APP_BASE_URL=/<repository>/ npx nuxt build --preset github_pages`
::

## 设置

按照以下步骤来[创建一个 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 部署

下面是一个示例的 GitHub Actions 工作流程，使用 `github_pages` 预设将您的网站部署到 GitHub Pages：

```yaml [.github/workflows/deploy.yml]
# https://github.com/actions/deploy-pages#usage
name: 部署到 GitHub Pages
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      # 选择您自己的包管理器和构建脚本
      - run: npm install
      - run: npx nuxt build --preset github_pages
      - name: 上传构建产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public
  # 部署任务
  deploy:
    # 添加对构建任务的依赖
    needs: build
    # 授予 GITHUB_TOKEN 所需的权限以进行部署到 Pages
    permissions:
      pages: write      # 部署到 Pages
      id-token: write   # 验证部署源是否合适
    # 部署到 github_pages 环境
    environment:
      name: github_pages
      url: ${{ steps.deployment.outputs.page_url }}
    # 指定运行环境和部署步骤
    runs-on: ubuntu-latest
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

::read-more{to="https://nitro.unjs.io/deploy/providers/github-pages" target="_blank"}
请访问 **Nitro 文档** 了解更多关于 github-pages 部署预设的信息。
::
