import type { CommandPaletteGroup } from '@nuxt/ui'
import { createSharedComposable } from '@vueuse/core'

function _useHeaderLinks() {
  const route = useRoute()
  const { version } = useDocsVersion()

  const headerLinks = computed(() => {
    const to = version.value.path

    return [{
      label: '开发文档',
      icon: 'i-lucide-book-marked',
      to,
      search: false,
      active: route.path.startsWith(to) || route.path.startsWith(`/deploy`),
      children: [{
        label: '开始使用',
        description: '学习如何开始使用 Nuxt 构建您的第一个应用程序。',
        icon: 'i-lucide-rocket',
        to: `${to}/getting-started/installation`,
        active: route.path.startsWith(`${to}/getting-started`)
      }, {
        label: '结构',
        description: '了解 Nuxt 项目的目录结构。',
        icon: 'i-lucide-folder-open',
        to: `${to}/directory-structure`,
        active: route.path.startsWith(`${to}/directory-structure`)
      }, {
        label: '指南',
        description: '获取关键概念、目录结构和最佳实践。',
        icon: 'i-lucide-book-open',
        to: `${to}/guide`,
        active: route.path.startsWith(`${to}/guide`) && !route.path.startsWith(`${to}/guide/directory-structure`)
      }, {
        label: 'API',
        description: '探索 Nuxt 组件、组合函数、工具及其他内容。',
        icon: 'i-lucide-code-xml',
        to: `${to}/api`,
        active: route.path.startsWith(`${to}/api`)
      }, {
        label: '部署',
        description: '将您的 Nuxt 项目部署到任何地方。',
        icon: 'i-lucide-cloud',
        to: '/deploy',
        active: route.path.startsWith('/deploy')
      }, {
        label: '示例',
        description: '发现和探索官方和社区示例。',
        icon: 'i-lucide-app-window-mac',
        to: `${to}/examples`,
        active: route.path.startsWith(`${to}/examples`)
      }, {
        label: '社区',
        description: '从热情的开源社区中寻找问题答案和支持帮助。',
        icon: 'i-lucide-messages-square',
        to: `${to}/community`,
        active: route.path.startsWith(`${to}/community`)
      }]
    }, {
      label: '模块',
      icon: 'i-lucide-puzzle',
      to: '/modules',
      description: '通过模块增强您的 Nuxt 项目。'
    }, {
      label: '模板',
      icon: 'i-lucide-app-window',
      description: '使用 Nuxt 模板开始您的下一个项目。',
      to: '/templates'
    }, {
      label: '学习资源',
      icon: 'i-lucide-library',
      to: '/showcase',
      search: false,
      active: route.path.startsWith('/video-courses') || route.path.startsWith('/showcase'),
      children: [{
        label: '展示',
        description: '发现和探索使用 Nuxt 构建的项目。',
        icon: 'i-lucide-presentation',
        to: '/showcase'
      }, {
        label: '视频课程',
        description: '通过观看视频课程来学习使用 Nuxt 框架。',
        icon: 'i-lucide-graduation-cap',
        to: '/video-courses'
      }, {
        label: 'Nuxt 认证',
        description: '通过 Nuxt 认证来获取您的编程水平证明。',
        icon: 'i-lucide-medal',
        to: 'https://certification.nuxt.com',
        target: '_blank'
      }]
    }, {
      label: '企业支持',
      icon: 'i-lucide-building-2',
      to: '/enterprise',
      search: false,
      children: [{
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

  return { headerLinks }
}

export const useHeaderLinks = import.meta.client ? createSharedComposable(_useHeaderLinks) : _useHeaderLinks

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
  label: '探索',
  children: [{
    label: '模块',
    to: '/modules'
  }, {
    label: '模板',
    to: '/templates'
  }, {
    label: '展示',
    to: '/showcase'
  }]
}, {
  label: '企业',
  children: [{
    label: '机构',
    to: '/enterprise/agencies'
  }, {
    label: '赞助商',
    to: '/enterprise/sponsors'
  }]
}]

export const useFooterLinks = () => ({ footerLinks })

const _useNavigation = () => {
  const nuxtApp = useNuxtApp()
  const searchTerm = ref<string>('')
  const { track } = useAnalytics()

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()
  const { modules } = useModules()
  const { providers } = useHostingProviders()

  const searchLinks = computed(() => [{
    label: 'Ask AI',
    icon: 'i-lucide-wand',
    to: 'javascript:void(0);',
    onSelect: () => {
      track('Ask AI Opened', { source: 'search-links' })
      nuxtApp.$kapa?.openModal()
    }
  }, ...headerLinks.value.map((link) => {
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
    label: '团队',
    icon: 'i-lucide-users',
    to: '/team'
  }, {
    label: '设计套件',
    icon: 'i-lucide-palette',
    to: '/design-kit'
  }, {
    label: '新闻',
    icon: 'i-lucide-mail',
    to: '/newsletter'
  }, {
    label: '源代码',
    icon: 'i-lucide-code',
    to: 'https://github.com/zhcndoc/nuxt',
    target: '_blank'
  }])

  const modulesItems = computed(() => modules.value.map(module => ({
    id: `module-${module.name}`,
    label: module.npm,
    suffix: module.description,
    avatar: {
      src: moduleImage(module.icon),
      ui: {
        root: 'rounded-none bg-transparent'
      }
    },
    to: `/modules/${module.name}`,
    // Store searchable fields for filtering
    _searchFields: [module.name, module.npm, module.repo].filter(Boolean)
  })))

  const hostingItems = computed(() => providers.value.map(hosting => ({
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
    to: hosting.path,
    // Store searchable fields for filtering
    _searchFields: [hosting.title].filter(Boolean)
  })))

  const searchGroups = computed<CommandPaletteGroup[]>(() => [{
    id: 'ask-ai-search',
    label: 'AI',
    ignoreFilter: true,
    postFilter: (searchTerm: string, items: any[]) => {
      if (!searchTerm) {
        return []
      }
      return items
    },
    items: [{
      label: 'Ask AI',
      icon: 'i-lucide-wand',
      to: 'javascript:void(0);',
      onSelect() {
        track('Ask AI Opened', { source: 'search-palette', query: searchTerm.value })
        nuxtApp.$kapa?.openModal(searchTerm.value)
      }
    }]
  }, {
    id: 'modules-search',
    label: 'Modules',
    items: modulesItems.value
  }, {
    id: 'hosting-search',
    label: 'Hosting',
    items: hostingItems.value
  }])

  watchDebounced(searchTerm, (term) => {
    if (term) {
      track('Search Performed', { term })
    }
  }, { debounce: 500 })

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups
  }
}

export const useNavigation = import.meta.client ? createSharedComposable(_useNavigation) : _useNavigation
