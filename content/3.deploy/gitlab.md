---
title: GitLab Pages
description: '将你的 Nuxt 应用部署到 GitLab Pages。'
logoSrc: '/assets/integrations/gitlab.svg'
category: Hosting
website: 'https://docs.gitlab.com/ee/user/project/pages'
---

Nuxt 支持在 [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages) 上进行部署，配置最低。

::caution
GitLab Pages 只支持静态网站，Nuxt 将会将你的应用预渲染为静态 HTML 文件。
::

::caution
如果你**没有**使用自定义域名，你需要在构建步骤中设置 `NUXT_APP_BASE_URL` 为你的仓库标识。

**示例**: `https://<group/user>.gitlab.io/<repository>/`: `NUXT_APP_BASE_URL=/<repository>/ npm run generate`
::

## 部署

1. 下面是一个部署你的站点到 GitLab Pages 的示例 GitLab Pages 工作流:

```yaml [.gitlab-ci.yml]
# 作业名称必须为 ‘pages’。参见 https://docs.gitlab.com/ee/user/project/pages/#how-it-works
pages:
   image: node
   before_script:
      - npm ci --cache .npm --prefer-offline
   script:
      # 在这里指定构建应用的步骤
      - npm run generate
   cache: # https://docs.gitlab.com/ee/ci/caching/#cache-nodejs-dependencies
      key:
         files:
         - package-lock.json
      paths:
         - .npm/
   artifacts:
      paths:
         # 包含需要发布的构建文件的目录
         - .output/public
   # 包含需要发布的构建文件的目录
   publish: .output/public
   rules:
      # 这里确保只有推送到默认分支时才会触发 pages 部署
      - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
```

## 了解更多

::read-more{to="https://docs.gitlab.com/ee/user/project/pages/getting_started_part_one.html#project-website-examples" target="_blank"}
请参阅 **GitLab Pages 默认域名和 URL** 了解更多关于 GitLab Pages 默认域名的信息。
::
