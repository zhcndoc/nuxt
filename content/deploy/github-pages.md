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
如果您部署的是**项目站点**且没有自定义域名，需要在构建时将 `NUXT_APP_BASE_URL` 设置为仓库名称。
:br
**项目站点示例**：`https://<user>.github.io/<repository>/`：`NUXT_APP_BASE_URL=/<repository>/ npx nuxt build --preset github_pages`
::

::tip
**通用 GitHub Actions 配置 ✨**
:br
对于没有自定义域名的项目站点，可以将 GitHub Actions 上下文变量 `github.event.repository.name` 传入 `NUXT_APP_BASE_URL: /${{ github.event.repository.name }}/`。请参阅下方的[部署](/deploy/github-pages#deployment)步骤。
:br
对于名为 `<owner>.github.io` 的用户或组织站点，或使用了自定义域名的站点，请省略 `NUXT_APP_BASE_URL` 或将其设为 `/`。
::

::read-more{to="https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs#github-context" target="_blank"}
请查看 **GitHub Actions 上下文**，了解更多上下文变量。
::

## 设置

按照以下步骤来[创建一个 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 部署

下面是一个示例 GitHub Actions 工作流程，使用 `github_pages` 预设将网站部署到 GitHub Pages：

```yaml [.github/workflows/deploy.yml]
# https://github.com/actions/deploy-pages#usage
name: Deploy Nuxt App to GitHub Pages
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - run: corepack enable
      - uses: actions/setup-node@v7
        with:
          node-version: "24"
      # Pick your own package manager and build script
      - run: npm install
      # Drop the env var below if your GitHub Pages is configured for a custom domain
      - run: npx nuxt build --preset github_pages
        env:
          NUXT_APP_BASE_URL: /${{ github.event.repository.name }}/
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./.output/public
  # Deployment job
  deploy:
    # Add a dependency to the build job
    needs: build
    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
      pages: write      # to deploy to Pages
      id-token: write   # to verify the deployment originates from an appropriate source
    # Deploy to the github_pages environment
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    # Specify runner + deployment step
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

::read-more{to="https://nitro.unjs.io/deploy/providers/github-pages" target="_blank"}
请访问 **Nitro 文档** 了解更多关于 github-pages 部署预设的信息。
::

## 网站图标

网站图标通常需要放在托管域名的根目录。部署到 GitHub Pages 时，这种方式无法正常工作。
因此，页面头部的网站图标 URL 应以 GitHub Pages 的 base URL 作为绝对路径。这样，无论是单页应用还是多路由应用都能正常显示图标。

::note
网站图标文件应放在项目的 `public/` 文件夹中，并且需要按照[SEO 与元数据](/docs/getting-started/seo-meta#nuxt-config)中的说明配置 `app/app.vue`，以使用 `NUXT_APP_BASE_URL` 定义的基础 URL。
::
