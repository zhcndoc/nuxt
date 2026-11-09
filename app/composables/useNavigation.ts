import type { CommandPaletteGroup } from '@nuxt/ui'
import type { NuxterSummary } from '#shared/types'
import { createSharedComposable } from '@vueuse/core'

function _useHeaderLinks() {
  const route = useRoute()
  const { meta: docsMeta } = useDocsVersion()

  const headerLinks = computed(() => {
    const to = docsMeta.value.path
    const archived = docsMeta.value.status === 'archived'

    return [{
      label: '文档',
      icon: 'i-lucide-book-marked',
      to,
      search: false,
      active: route.path.startsWith(to) || route.path.startsWith(`/deploy`),
      children: [{
        label: '开始使用',
        description: '了解如何使用 Nuxt 构建您的第一个应用。',
        icon: 'i-lucide-rocket',
        to: `${to}/getting-started/installation`,
        active: route.path.startsWith(`${to}/getting-started`)
      }, {
        label: '目录结构',
        description: '了解 Nuxt 项目的目录结构。',
        icon: 'i-lucide-folder-open',
        to: `${to}/directory-structure`,
        active: route.path.startsWith(`${to}/directory-structure`)
      }, {
        label: '指南',
        description: '了解核心概念、目录结构和最佳实践。',
        icon: 'i-lucide-book-open',
        to: `${to}/guide`,
        active: route.path.startsWith(`${to}/guide`) && !route.path.startsWith(`${to}/guide/directory-structure`)
      }, {
        label: 'API',
        description: '探索 Nuxt 组件、组合式函数、工具等内容。',
        icon: 'i-lucide-code-xml',
        to: `${to}/api`,
        active: route.path.startsWith(`${to}/api`)
      },
      // Archived versions have no deploy guides, examples or community section.
      ...(archived
        ? []
        : [{
            label: '部署',
            description: '将 Nuxt 项目部署到任意平台。',
            icon: 'i-lucide-cloud',
            to: '/deploy',
            active: route.path.startsWith('/deploy')
          }, {
            label: '示例',
            description: '探索官方和社区提供的示例。',
            icon: 'i-lucide-app-window-mac',
            to: '/docs/examples',
            active: route.path.startsWith('/docs/examples')
          }, {
            label: '社区',
            description: '在社区中寻找问题的答案和支持。',
            icon: 'i-lucide-messages-square',
            to: `${to}/community`,
            active: route.path.startsWith(`${to}/community`)
          }])]
    }, {
      label: '模块',
      icon: 'i-lucide-puzzle',
      to: '/modules',
      description: '使用模块扩展 Nuxt 项目。'
    }, {
      label: '模板',
      icon: 'i-lucide-app-window',
      to: '/templates',
      description: '使用 Nuxt 模板启动下一个项目。',
      active: route.path.startsWith('/templates')
    }, {
      label: '案例展示',
      icon: 'i-lucide-presentation',
      description: '探索使用 Nuxt 构建的项目。',
      to: '/showcase'
    }, {
      label: 'Nuxters',
      icon: 'i-lucide-award',
      description: '认识 Nuxt 生态的贡献者，并分享您的 Nuxter 个人资料。',
      to: '/nuxters',
      active: route.path.startsWith('/nuxters')
    }, {
      label: '动态',
      icon: 'i-lucide-newspaper',
      to: '/updates',
      description: 'Nuxt 团队的版本发布和博客文章。',
      active: route.path.startsWith('/updates') || route.path.startsWith('/blog') || route.path.startsWith('/changelog')
    }, {
      label: '更多',
      icon: 'i-lucide-library',
      to: '/video-courses',
      search: false,
      active: ['/video-courses', '/enterprise', '/sponsors'].some(path => route.path.startsWith(path)),
      children: [{
        label: '视频课程',
        description: '通过视频课程学习 Nuxt。',
        icon: 'i-lucide-graduation-cap',
        to: '/video-courses'
      }, {
        label: '合作机构',
        description: '专注于 Nuxt 开发的机构。',
        icon: 'i-lucide-handshake',
        to: '/enterprise/agencies'
      }, {
        label: '赞助商',
        description: '支持 Nuxt 持续发展。',
        icon: 'i-lucide-hand-heart',
        to: '/sponsors'
      }, {
        label: 'Nuxt 认证',
        description: '获取 Nuxt 能力认证。',
        icon: 'i-lucide-medal',
        to: 'https://certification.nuxt.com',
        target: '_blank'
      }]
    }]
  })

  return { headerLinks }
}

export const useHeaderLinks = import.meta.client ? createSharedComposable(_useHeaderLinks) : _useHeaderLinks

const footerLinks = [{
  label: '社区',
  children: [{
    label: 'Nuxters',
    to: '/nuxters'
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
    label: '模板',
    to: '/templates'
  }, {
    label: '案例展示',
    to: '/showcase'
  }, {
    label: 'AI 评测',
    to: '/evals'
  }]
}, {
  label: '企业服务',
  children: [{
    label: '合作机构',
    to: '/enterprise/agencies'
  }, {
    label: '赞助商',
    to: '/sponsors'
  }]
}]

export const useFooterLinks = () => ({ footerLinks })

const _useNavigation = () => {
  const searchTerm = ref<string>('')
  const { track } = useAnalytics()
  const { open: openAgent } = useNuxtAgent()

  const { headerLinks } = useHeaderLinks()
  const { footerLinks } = useFooterLinks()
  const { modules, fetchList: fetchModules } = useModules()
  const { providers, fetchList: fetchHosting } = useHostingProviders()
  const { articles: blogArticles, fetchList: fetchBlog } = useBlog()

  const searchLinks = computed(() => [{
    label: 'Ask Nuxi',
    icon: 'i-custom-nuxi',
    to: 'javascript:void(0);',
    onSelect: () => {
      track('Nuxi Opened', { source: 'search-links' })
      openAgent()
    }
  }, ...headerLinks.value.flatMap((link) => {
    if (link.search === false) {
      return (link.children || []).map(child => ({
        ...child,
        label: `${link.label} > ${child.label}`
      }))
    }
    return [link]
  }), {
    label: '更新日志',
    icon: 'i-lucide-history',
    to: '/changelog'
  }, {
    label: '团队',
    icon: 'i-lucide-users',
    to: '/team'
  }, {
    label: '设计套件',
    icon: 'i-lucide-palette',
    to: '/design-kit'
  }, {
    label: 'AI 评测',
    icon: 'i-lucide-brain',
    to: '/evals'
  }, {
    label: '新闻通讯',
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
    downloads: module.stats?.downloads ?? 0,
    avatar: {
      src: moduleImage(module.icon),
      ui: {
        root: 'rounded-none bg-transparent'
      }
    },
    to: `/modules/${module.name}`
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
    to: hosting.path
  })))

  const blogItems = computed(() => blogArticles.value.map(article => ({
    id: `blog-${article.path}`,
    label: article.title,
    suffix: article.description,
    icon: 'i-lucide-newspaper',
    to: article.path
  })))

  // Nuxters: 27k usernames, so the server searches them (lazy, one request per pause in typing).
  const nuxterResults = ref<NuxterSummary[]>([])
  let nuxtersRequest = 0
  watchDebounced(searchTerm, async (term) => {
    const query = term.trim()
    const current = ++nuxtersRequest
    if (query.length < 2) {
      nuxterResults.value = []
      return
    }
    const items = await $fetch<NuxterSummary[]>('/api/search/nuxters', { query: { q: query, limit: 5 } }).catch(() => [])
    // A slower, older request must not replace newer results.
    if (current === nuxtersRequest) nuxterResults.value = items
  }, { debounce: 200 })

  const { format } = new Intl.NumberFormat('en-US')
  const nuxterItems = computed(() => nuxterResults.value.map(nuxter => ({
    id: `nuxter-${nuxter.githubId}`,
    label: nuxter.username,
    suffix: `第 ${format(nuxter.rank)} 名 · ${format(nuxter.score)} 分`,
    // UAvatar renders with <NuxtImg> (IPX): pass the source path, not an IPX URL.
    avatar: {
      src: `/gh_avatar/${nuxter.username}`,
      alt: nuxter.username,
      densities: 'x1 x2',
      ui: { root: 'rounded-md' }
    },
    to: `/nuxters/${nuxter.username}`
  })))

  const postFilter = (searchTerm: string, items: any[]) => {
    if (!searchTerm) {
      return []
    }
    return items
  }

  const searchGroups = computed<CommandPaletteGroup[]>(() => [{
    id: 'modules-search',
    label: '模块',
    items: modulesItems.value,
    postFilter
  }, {
    id: 'hosting-search',
    label: '托管服务',
    items: hostingItems.value,
    postFilter
  }, {
    id: 'blog-search',
    label: '博客',
    items: blogItems.value,
    postFilter
  }, {
    id: 'nuxters-search',
    label: 'Nuxters',
    items: nuxterItems.value,
    // Already filtered and ranked by the server
    ignoreFilter: true,
    postFilter
  }, {
    id: 'ask-ai-search',
    label: 'AI',
    ignoreFilter: true,
    postFilter,
    items: [{
      label: 'Ask Nuxi',
      icon: 'i-custom-nuxi',
      onSelect() {
        track('Nuxi Opened', { source: 'search-palette', query: searchTerm.value })
        openAgent(searchTerm.value)
      }
    }]
  }])

  const { open: searchOpen } = useContentSearch()
  watch(searchOpen, (value) => {
    if (value) {
      fetchModules()
      fetchHosting()
      fetchBlog()
    }
  })

  return {
    searchTerm,
    headerLinks,
    footerLinks,
    searchLinks,
    searchGroups
  }
}

export const useNavigation = import.meta.client ? createSharedComposable(_useNavigation) : _useNavigation
