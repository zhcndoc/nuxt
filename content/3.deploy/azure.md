---
title: Azure
description: '将您的 Nuxt 应用程序部署到 Azure 基础结构。'
logoIcon: 'i-logos-azure-icon'
category: Hosting
nitroPreset: 'azure'
website: 'https://azure.microsoft.com/en-us/services/app-service/static/'
---

## Azure 静态网站

::tip
**零配置 ✨**
:br
与 Azure 静态网站供应商的集成可实现零配置，[了解更多](https://nitro.unjs.io/deploy#zero-config-providers)。
::

Azure 静态网站的设计初衷是在 [GitHub Actions 工作流程](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow) 中连续部署。默认情况下，Nuxt 会检测此部署环境以启用 `azure` 预设。

### 本地预览

如果您要进行本地测试，请安装 [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)。

您可以在部署之前调用一个开发环境进行预览。

```bash [Terminal]
npx nuxi build --preset=azure
npx @azure/static-web-apps-cli start .output/public --api-location .output/server
```

### 配置

Azure 静态网站使用 `staticwebapp.config.json` 文件进行[配置](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)。

当使用 `azure` 预设构建应用程序时，Nuxt 会自动生成此配置文件。

它会根据以下标准添加以下属性：

| 属性 | 标准 | 默认值 |
| --- | --- | --- |
| **[platform.apiRuntime](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration#platform)** | 根据包的配置自动设置为 `node:16` 或 `node:14`。 | `node:16` |
| **[navigationFallback.rewrite](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration#fallback-routes)** | 始终为 `/api/server` | `/api/server` |
| **[routes](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration#routes)** | 添加所有预渲染路由。此外，如果没有 `index.html` 文件，将为您创建一个空白文件以实现兼容性，还会重定向到 `/index.html` 的请求将重定向到由 `/api/server` 处理的根目录。  | `[]` |

### 自定义配置

您可以使用 `azure.config` 选项更改生成的配置。例如，如果您想为 Azure Functions 指定一个 Node 运行时，请编辑您的 `nuxt.config.ts` 文件如下：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  nitro: {
    azure: {
      config: {
        // ...
        platform: {
          apiRuntime: 'node:18'
        }
      }
    }
  }
})
```

自定义路由将首先添加并匹配。在冲突的情况下（如果对象具有相同的路由属性），自定义路由将覆盖生成的路由。

### 通过 GitHub Actions 部署 CI/CD

当将您的 GitHub 存储库连接到 Azure 静态网站时，会向存储库添加一个工作流文件。

当要求选择框架时，请选择自定义并提供以下信息：

| 输入 | 值 |
| --- | --- |
| **app_location** | '/' |
| **api_location** | '.output/server' |
| **output_location** | '.output/public' |

如果您错过了这一步，您可以随时在工作流程中找到构建配置部分并更新构建配置：

```yaml [.github/workflows/azure-static-web-apps-<RANDOM_NAME>.yml]
###### 存储库/构建配置 ######
app_location: '/'
api_location: '.output/server'
output_location: '.output/public'
###### 存储库/构建配置结尾 ######
```

::alert
就是这样！现在，Azure 静态网站将在推送时自动部署您的 Nitro 强化应用程序。
::

如果您使用 `runtimeConfig`，您可能想要在 Azure 上配置相应的[环境变量](https://docs.microsoft.com/en-us/azure/static-web-apps/application-settings)。

## 更多选项

::read-more{to="https://nitro.unjs.io/deploy/providers/azure" target="_blank"}
在 Nitro 文档中了解其他 Azure 部署预设的信息。
::
