import { createSharedComposable } from '@vueuse/core'

const _useNavigation = () => {
  const headerLinks = computed(() => {
    const route = useRoute()

    return [{
      label: '文档',
      icon: 'i-ph-book-bookmark',
      to: '/docs',
      search: false,
      children: [{
        label: '开始使用',
        description: '学习如何开始使用 Nuxt。',
        icon: 'i-ph-rocket-launch',
        to: '/docs/getting-started',
        active: route.path.startsWith('/docs/getting-started')
      }, {
        label: '指南',
        description: '学习如何构建和部署 Nuxt 应用程序。',
        icon: 'i-ph-book-open',
        to: '/docs/guide',
        active: route.path.startsWith('/docs/guide')
      }, {
        label: 'API',
        description: '探索 Nuxt API。',
        icon: 'i-ph-code',
        to: '/docs/api',
        active: route.path.startsWith('/docs/api')
      }, {
        label: '示例',
        description: '发现并探索官方和社区示例。',
        icon: 'i-ph-app-window',
        to: '/docs/examples',
        active: route.path.startsWith('/docs/examples')
      }, {
        label: '社区',
        description: '从社区中寻找答案和支持。',
        icon: 'i-ph-chats-teardrop',
        to: '/docs/community',
        active: route.path.startsWith('/docs/community')
      }]
    }, {
      label: '集成',
      to: '/modules',
      icon: 'i-ph-plugs-connected',
      search: false,
      active: route.path.startsWith('/modules') || route.path.startsWith('/deploy'),
      children: [{
        label: '模块',
        description: '使用集成模块增强您的 Nuxt 项目。',
        icon: 'i-ph-puzzle-piece',
        to: '/modules'
      }, {
        label: '托管',
        description: '将您的 Nuxt 项目部署到任何地方。',
        icon: 'i-ph-rocket-launch',
        to: '/deploy'
      }]
    }, {
      label: '资源',
      icon: 'i-ph-books',
      to: '/templates',
      search: false,
      active: route.path.startsWith('/templates') || route.path.startsWith('/video-courses'),
      children: [{
        label: '模板',
        icon: 'i-ph-browsers',
        description: '使用 Nuxt 模板开始您的下一个项目。',
        to: '/templates'
      }, {
        label: '视频课程',
        description: '通过观看视频课程学习 Nuxt。',
        icon: 'i-ph-graduation-cap',
        to: '/video-courses'
      }, {
        label: '展示',
        description: '发现并探索使用 Nuxt 构建的项目。',
        icon: 'i-ph-projector-screen',
        to: '/showcase'
      }, {
        label: 'Nuxt 认证',
        description: '获得您的能力认证。',
        icon: 'i-ph-medal',
        to: 'https://certification.nuxt.com',
        target: '_blank'
      }]
    }, {
      label: '产品',
      icon: 'i-ph-sparkle',
      search: false,
      children: [{
        label: 'Nuxt UI Pro',
        to: 'https://ui.nuxt.com/pro?utm_source=nuxt-website&utm_medium=header',
        description: 'Nuxt 的高级 Vue 组件。',
        icon: 'i-ph-layout',
        target: '_blank'
      }, {
        label: 'Nuxt Studio',
        to: 'https://nuxt.studio/?utm_source=nuxt-website&utm_medium=header',
        description: '基于 Git 的 Nuxt CMS。',
        icon: 'i-ph-pen',
        target: '_blank'
      }, {
        label: 'NuxtHub',
        to: 'https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=header',
        description: '构建、部署和管理可扩展的 Nuxt 应用程序。',
        icon: 'i-ph-rocket-launch',
        target: '_blank'
      }]
    }, {
      label: '服务',
      icon: 'i-ph-buildings',
      to: '/enterprise',
      search: false,
      children: [{
        label: '支持',
        to: '/enterprise/support',
        description: 'Nuxt 专家提供的专业支持。',
        icon: 'i-ph-lifebuoy'
      }, {
        label: '机构',
        to: '/enterprise/agencies',
        description: '专门从事 Nux t开发的机构。',
        icon: 'i-ph-handshake'
      }, {
        label: '赞助商',
        to: '/enterprise/sponsors',
        description: '帮助我们支持 Nuxt 的开发。',
        icon: 'i-ph-hand-heart'
      }]
    }, {
      label: '博客',
      icon: 'i-ph-newspaper',
      to: '/blog'
    }]
  })

  const footerLinks = [{
    label: '社区',
    children: [{
      label: 'Nuxters',
      to: 'https://nuxters.nuxt.com',
      target: '_blank'
    }, {
      label: '团队',
      to: '/team'
    }, {
      label: '设计套件',
      to: '/design-kit'
    }]
  }, {
    label: '产品',
    children: [{
      label: 'Nuxt UI Pro',
      to: 'https://ui.nuxt.com/pro?utm_source=nuxt-website&utm_medium=footer',
      target: '_blank'
    }, {
      label: 'Nuxt Studio',
      to: 'https://nuxt.studio/?utm_source=nuxt-website&utm_medium=footer',
      target: '_blank'
    }, {
      label: 'NuxtHub',
      to: 'https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=footer',
      target: '_blank'
    }]
  }, {
    label: '企业',
    children: [{
      label: '支持',
      to: '/enterprise/support'
    }, {
      label: '机构',
      to: '/enterprise/agencies'
    }, {
      label: '赞助商',
      to: '/enterprise/sponsors'
    }]
  }]

  const searchLinks = computed(() => [...headerLinks.value.map((link) => {
    // Remove `/docs` and `/enterprise` links from command palette
    if (link.search === false) {
      return {
        label: link.label,
        icon: link.icon,
        children: link.children
      }
    }

    return link
  }).filter(Boolean), {
    label: 'Team',
    icon: 'i-ph-users',
    to: '/team'
  }, {
    label: 'Design Kit',
    icon: 'i-ph-palette',
    to: '/design-kit'
  }, {
    label: 'Newsletter',
    icon: 'i-ph-envelope-simple',
    to: '/newsletter'
  }])

  const searchGroups = [{
    key: 'modules-search',
    label: 'Modules',
    search: async (q) => {
      if (!q) {
        return []
      }

      const { modules, fetchList } = useModules()
      if (!modules.value.length) {
        await fetchList()
      }

      return modules.value
        .filter(module => ['name', 'npm', 'repo'].map(field => module[field]).filter(Boolean).some(value => value.search(searchTextRegExp(q)) !== -1))
        .map(module => ({
          id: `module-${module.name}`,
          label: module.npm,
          suffix: module.description,
          avatar: {
            src: moduleImage(module.icon),
            ui: {
              rounded: 'rounded-md'
            }
          },
          to: `/modules/${module.name}`
        }))
    }
  }, {
    key: 'hosting-search',
    label: 'Hosting',
    search: async (q) => {
      if (!q) {
        return []
      }

      const { providers, fetchList } = useHostingProviders()
      if (!providers.value.length) {
        await fetchList()
      }

      return providers.value
        .filter(hosting => ['title'].map(field => hosting[field]).filter(Boolean).some(value => value.search(searchTextRegExp(q)) !== -1))
        .map(hosting => ({
          id: `hosting-${hosting._path}`,
          label: hosting.title,
          suffix: hosting.description,
          icon: hosting.logoIcon,
          avatar: hosting.logoSrc
            ? {
                src: hosting.logoSrc
              }
            : undefined,
          to: hosting._path
        }))
    }
  }, {
    key: 'articles-search',
    label: 'Articles',
    search: async (q) => {
      if (!q) {
        return []
      }

      const { articles, fetchList } = useBlog()
      if (!articles.value.length) {
        await fetchList()
      }

      return articles.value
        .filter(article => article.title.search(searchTextRegExp(q)) !== -1)
        .map(article => ({
          id: `article-${article._path}`,
          label: article.title,
          suffix: article.description,
          icon: 'i-ph-newspaper',
          to: article._path
        }))
    }
  }]

  return {
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
