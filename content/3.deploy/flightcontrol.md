---
title: Flightcontrol
description: '在 Flightcontrol 基础设施中部署你的 Nuxt 应用程序。'
logoSrc: '/assets/integrations/flightcontrol.webp'
category: Hosting
nitroPreset: 'flightcontrol'
website: 'https://www.flightcontrol.dev'
---

Nitro 可以在[通过 Flightcontrol](https://flightcontrol.dev?ref=nuxt)进行部署，只需进行最少的配置。

::tip
**零配置 ✨**
:br
与 Flightcontrol 的集成可以实现零配置。
::

## 设置你的 Flightcontrol 账户

在高层次上，首次部署项目需要按如下步骤进行：

1. 在 [Flightcontrol](https://app.flightcontrol.dev/signup?ref=nuxt) 上创建一个账户。
2. 在 [AWS](https://portal.aws.amazon.com/billing/signup) 上创建一个账户（如果你还没有）。
3. 将你的 AWS 账户链接到 Flightcontrol。
4. 授权 Flightcontrol GitHub App 访问你选择的仓库，可以是公开的或私有的。
5. 通过面板或 `flightcontrol.json` 的配置创建一个 Flightcontrol 项目。

## 通过面板创建带有配置的项目

1. 从面板创建一个 Flightcontrol 项目。选择一个仓库作为源。
2. 选择 `GUI` 配置类型。
3. 选择 Nuxt 预设。
4. 选择你首选的 AWS 服务器大小。
5. 提交新项目表单。

## 通过 `flightcontrol.json` 创建带有配置的项目

1. 从你的面板创建一个 Flightcontrol 项目。选择一个仓库作为源。
2. 选择 `flightcontrol.json` 配置类型。
3. 在你的仓库根目录下新建一个名为 `flightcontrol.json` 的文件。以下是一个示例配置，它会为你的应用程序创建一个 AWS fargate 服务：

```json [flightcontrol.json]
{
  "$schema": "https://app.flightcontrol.dev/schema.json",
  "environments": [
    {
      "id": "production",
      "name": "Production",
      "region": "us-west-2",
      "source": {
        "branch": "main"
      },
      "services": [
        {
          "id": "nitro",
          "buildType": "nixpacks",
          "name": "My Nitro site",
          "type": "fargate",
          "domain": "www.yourdomain.com",
          "outputDirectory": ".output",
          "startCommand": "node .output/server/index.mjs",
          "cpu": 0.25,
          "memory": 0.5
        }
      ]
    }
  ]
}
```

4. 提交新项目表单。

::read-more{to="https://www.flightcontrol.dev/docs?ref=nuxt" target="_blank"}
了解更多关于 Flightcontrol 的配置信息。
::

::read-more{to="https://nitro.zhcndoc.com/deploy/providers/flightcontrol" target="_blank"}
请前往**Nitro 文档**了解有关 flightcontrol 部署预设的详细信息。
::
