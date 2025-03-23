import { createSharedComposable } from '@vueuse/core'

const _useNavigation = () => {
  const nuxtApp = useNuxtApp()
  const searchTerm = ref<string>('')

  const headerLinks = computed(() => {
    const route = useRoute()

    return [{
      label: '开发文档',
      icon: 'i-lucide-book-marked',
      to: '/docs',
      search: false,
      children: [{
        label: '开始使用',
        description: '学习如何开始使用 Nuxt 构建您的第一个应用程序。',
        icon: 'i-lucide-rocket',
        to: '/docs/getting-started',
        active: route.path.startsWith('/docs/getting-started')
      }, {
        label: '指南',
        description: '获取关键概念、目录结构和最佳实践。',
        icon: 'i-lucide-book-open',
        to: '/docs/guide',
        active: route.path.startsWith('/docs/guide')
      }, {
        label: 'API',
        description: '探索 Nuxt 组件、组合函数、工具及其他内容。',
        icon: 'i-lucide-code-xml',
        to: '/docs/api',
        active: route.path.startsWith('/docs/api')
      }, {
        label: '示例',
        description: '发现更多有趣的官方示例和社区示例。',
        icon: 'i-lucide-app-window-mac',
        to: '/docs/examples',
        active: route.path.startsWith('/docs/examples')
      }, {
        label: '社区',
        description: '从热情的开源社区中寻找问题答案和支持帮助。',
        icon: 'i-lucide-messages-square',
        to: '/docs/community',
        active: route.path.startsWith('/docs/community')
      }]
    }, {
      label: '集成',
      to: '/modules',
      icon: 'i-lucide-unplug',
      search: false,
      active: route.path.startsWith('/modules') || route.path.startsWith('/deploy'),
      children: [{
        label: '模块',
        description: '通过 Nuxt 模块为您的 Nuxt 项目添加更多功能。',
        icon: 'i-lucide-puzzle',
        to: '/modules'
      }, {
        label: '托管',
        description: '将您的 Nuxt 项目部署到互联网的任何地方。',
        icon: 'i-lucide-rocket',
        to: '/deploy'
      }]
    }, {
      label: '学习资源',
      icon: 'i-lucide-library',
      to: '/templates',
      search: false,
      active: route.path.startsWith('/templates') || route.path.startsWith('/video-courses') || route.path.startsWith('/showcase'),
      children: [{
        label: '模板',
        icon: 'i-lucide-app-window',
        description: '使用 Nuxt 模板开始您的下一个项目。',
        to: '/templates'
      }, {
        label: '视频课程',
        description: '通过观看视频课程来学习使用 Nuxt 框架。',
        icon: 'i-lucide-graduation-cap',
        to: '/video-courses'
      }, {
        label: '展示柜',
        description: '发现并探索更多使用 Nuxt 构建的项目。',
        icon: 'i-lucide-presentation',
        to: '/showcase'
      }, {
        label: 'Nuxt 认证',
        description: '通过 Nuxt 认证来获取您的编程水平证明。',
        icon: 'i-lucide-medal',
        to: 'https://certification.nuxt.com',
        target: '_blank'
      }]
    }, {
      label: '产品',
      icon: 'i-lucide-sparkle',
      search: false,
      children: [{
        label: 'Nuxt UI Pro',
        to: 'https://ui.nuxt.com/pro?utm_source=nuxt-website&utm_medium=header',
        description: '使用高级组件为 Vue 或 Nuxt 更快构建。',
        icon: 'i-lucide-panels-top-left',
        target: '_blank'
      }, {
        label: 'Nuxt Studio',
        to: 'https://content.nuxt.com/studio/?utm_source=nuxt-website&utm_medium=header',
        description: '使用可视化编辑器编辑您的 Nuxt Content 网站。',
        icon: 'i-lucide-pen',
        target: '_blank'
      }, {
        label: 'NuxtHub',
        to: 'https://hub.nuxt.com/?utm_source=nuxt-website&utm_medium=header',
        description: '部署和管理可扩展的全栈 Nuxt 应用程序。',
        icon: 'i-lucide-rocket',
        target: '_blank'
      }]
    }, {
      label: '企业支持',
      icon: 'i-lucide-building-2',
      to: '/enterprise',
      search: false,
      children: [{
        label: '支持',
        to: '/enterprise/support',
        description: 'Nuxt 专家提供的专业支持。',
        icon: 'i-lucide-life-buoy'
      }, {
        label: '机构',
        to: '/enterprise/agencies',
        description: '专注于 Nuxt 开发的机构。',
        icon: 'i-lucide-handshake'
      }, {
        label: '赞助商',
        to: '/enterprise/sponsors',
        description: '帮助我们维持 Nuxt 的开发。',
        icon: 'i-lucide-hand-heart'
      }]
    }, {
      label: 'Nuxt 博客',
      icon: 'i-lucide-newspaper',
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
      to: 'https://content.nuxt.com/studio/?utm_source=nuxt-website&utm_medium=footer',
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

  const searchLinks = computed(() => [
    {
      label: 'Ask AI',
      icon: 'i-lucide-wand',
      to: 'javascript:void(0);',
      onSelect: () => nuxtApp.$kapa?.openModal()
    },
    ...headerLinks.value.map((link) => {
      // Remove `/docs` and `/enterprise` links from command palette
      if (link.search === false) {
        return {
          label: link.label,
          icon: link.icon,
          children: link.children
        }
      }
      return link
    }).filter((link): link is NonNullable<typeof link> => Boolean(link)), {
      label: 'Team',
      icon: 'i-lucide-users',
      to: '/team'
    }, {
      label: 'Design Kit',
      icon: 'i-lucide-palette',
      to: '/design-kit'
    }, {
      label: 'Newsletter',
      icon: 'i-lucide-mail',
      to: '/newsletter'
    }])

  type SearchGroup = {
    id: string
    label: string
    icon?: string
    items: Array<{
      id: string
      label: string
      suffix?: string
      icon?: string
      avatar?: {
        src?: string
        ui?: {
          root: string
        }
      }
      to: string
      onSelect?: () => Promise<void>
    }>
  }

  const searchGroups = computed<SearchGroup[]>(() => {
    const aiGroup: SearchGroup = {
      id: 'ask-ai-search',
      label: 'AI',
      icon: 'i-lucide-wand',
      items: []
    }

    const modulesGroup: SearchGroup = {
      id: 'modules-search',
      label: 'Modules',
      items: []
    }

    const hostingGroup: SearchGroup = {
      id: 'hosting-search',
      label: 'Hosting',
      items: []
    }

    const groups = [aiGroup, modulesGroup, hostingGroup]

    if (!searchTerm.value) {
      return groups
    }

    aiGroup.items = [{
      id: `ask-ai-${searchTerm.value}`,
      label: `Ask AI about "${searchTerm.value}"`,
      icon: 'i-lucide-wand',
      to: 'javascript:void(0);',
      onSelect() {
        return nuxtApp.$kapa.openModal(searchTerm.value)
      }
    }]

    const loadModules = async () => {
      const { modules, fetchList } = useModules()
      if (!modules.value.length) {
        await fetchList()
      }

      modulesGroup.items = modules.value
        .filter(module => ['name', 'npm', 'repo'].map(field => module[field as keyof typeof module]).filter(Boolean).some(value => typeof value === 'string' && value.search(searchTextRegExp(searchTerm.value)) !== -1))
        .map(module => ({
          id: `module-${module.name}`,
          label: module.npm,
          suffix: module.description,
          avatar: {
            src: moduleImage(module.icon),
            ui: {
              root: 'rounded-none bg-transparent'
            }
          },
          to: `/modules/${module.name}`
        }))
    }

    const loadHosting = async () => {
      const { providers, fetchList } = useHostingProviders()
      if (!providers.value.length) {
        await fetchList()
      }

      hostingGroup.items = providers.value
        .filter(hosting => ['title'].map(field => hosting[field as keyof typeof hosting]).filter(Boolean).some(value => typeof value === 'string' && value.search(searchTextRegExp(searchTerm.value)) !== -1))
        .map(hosting => ({
          id: `hosting-${hosting.path}`,
          label: hosting.title,
          suffix: hosting.description,
          icon: hosting.logoIcon,
          avatar: hosting.logoSrc
            ? {
                src: hosting.logoSrc,
                ui: {
                  root: 'rounded-none bg-transparent'
                }
              }
            : undefined,
          to: hosting.path
        }))
    }

    Promise.all([
      loadModules(),
      loadHosting()
    ]).catch(error => console.error('Error loading search results:', error))

    return groups
  })

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups
  }
}

export const useNavigation = createSharedComposable(_useNavigation)
