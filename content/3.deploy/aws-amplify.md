---
title: AWS Amplify
description: '在 AWS Amplify 基础设施中部署你的 Nuxt 应用。'
componentImg: Amplify
logoIcon: 'i-logos-aws-amplify'
category: Hosting
nitroPreset: 'aws-amplify'
website: 'https://aws.amazon.com/amplify/?trk=bed847b4-6e9f-4e09-ba09-0d4680a0447b&sc_channel=el'
---

::tip
**零配置 ✨**
:br
可以零配置地集成 AWS Amplify，[了解更多](https://nitro.unjs.io/deploy#zero-config-providers)。
::

## 安装设置

1. 登录 [AWS Amplify Hosting 控制台](https://console.aws.amazon.com/amplify/?trk=01c5a476-5997-4e6a-88b9-fd0a0a5bbe34&sc_channel=el)
2. 点击 "开始" > Amplify Hosting（主机你的 Web 应用）
3. 选择并授权访问你的 Git 仓库提供商，并选择主分支
4. 为你的应用选择一个名称，确保构建设置被自动检测，并可选择在高级部分下设置所需的环境变量
5. 可选地，选择启用 SSR 日志记录以启用服务器端日志记录到你的 Amazon CloudWatch 账户
6. 确认配置并点击 "保存并部署"

## 了解更多

::read-more{to="https://www.youtube.com/watch?v=CAk5_XGkOG4" target="_blank"}
观看一个关于 Nuxt 的 Amplify Hosting 教程
::

::read-more{to="https://nitro.unjs.io/deploy/providers/aws-amplify" target="_blank"}
前往 **Nitro 文档** 了解更多关于 aws-amplify 部署预设的信息。
::
