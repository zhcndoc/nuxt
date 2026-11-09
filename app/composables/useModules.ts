type ModuleStatsKeys = 'version' | 'downloads' | 'stars' | 'publishedAt' | 'createdAt'
import type { Module } from '#shared/types'
import type { Filter } from '~/types'

// `purpose` completes "Discover N Nuxt modules by the community for …" in a category's meta description.
const categoriesMap: Record<string, { icon: string, purpose: string }> = {
  'Official': { icon: 'i-lucide-medal', purpose: '' },
  'AI': { icon: 'i-lucide-brain', purpose: '为 Nuxt 应用添加 AI 功能' },
  'Analytics': { icon: 'i-lucide-chart-bar', purpose: '为 Nuxt 应用添加数据分析功能' },
  'Animation': { icon: 'i-lucide-sparkles', purpose: '为 Nuxt 应用添加动画效果' },
  'API & Data Fetching': { icon: 'i-lucide-unplug', purpose: '在 Nuxt 应用中获取数据并调用 API' },
  'Authentication': { icon: 'i-lucide-key-round', purpose: '为 Nuxt 应用添加身份验证' },
  'Backend & Database': { icon: 'i-lucide-database', purpose: '将 Nuxt 应用连接到后端或数据库' },
  'Charts & Maps': { icon: 'i-lucide-chart-pie', purpose: '在 Nuxt 应用中展示图表和地图' },
  'CMS & Content': { icon: 'i-lucide-pencil', purpose: '管理 Nuxt 应用的内容' },
  'CSS & Theming': { icon: 'i-lucide-palette', purpose: '为 Nuxt 应用设置样式和主题' },
  'Deployment': { icon: 'i-lucide-rocket', purpose: '安全部署 Nuxt 应用，使用功能开关、托管平台集成和版本偏移保护' },
  'Devtools': { icon: 'i-lucide-wrench', purpose: '改善 Nuxt 应用的开发体验' },
  'Ecommerce & Payments': { icon: 'i-lucide-shopping-cart', purpose: '通过 Nuxt 应用销售商品并收取付款' },
  'Email & Notifications': { icon: 'i-lucide-mail', purpose: '通过 Nuxt 应用发送邮件和通知' },
  'Forms & Validation': { icon: 'i-lucide-text-cursor-input', purpose: '在 Nuxt 应用中构建和验证表单' },
  'i18n': { icon: 'i-lucide-languages', purpose: '翻译并本地化 Nuxt 应用' },
  'Icons & Fonts': { icon: 'i-lucide-shapes', purpose: '为 Nuxt 应用添加图标和字体' },
  'Images & Media': { icon: 'i-lucide-image', purpose: '优化 Nuxt 应用中的图像和媒体' },
  'Mobile & Desktop': { icon: 'i-lucide-smartphone', purpose: '将 Nuxt 应用转换为移动或桌面应用' },
  'Monitoring & Logging': { icon: 'i-lucide-activity', purpose: '监控 Nuxt 应用并记录日志' },
  'Performance': { icon: 'i-lucide-gauge', purpose: '提升 Nuxt 应用的性能' },
  'Realtime': { icon: 'i-lucide-radio', purpose: '为 Nuxt 应用添加实时功能' },
  'Security': { icon: 'i-lucide-shield', purpose: '保护 Nuxt 应用的安全' },
  'SEO': { icon: 'i-lucide-search', purpose: '改善 Nuxt 应用的 SEO' },
  'State Management': { icon: 'i-lucide-layers', purpose: '管理 Nuxt 应用的状态' },
  'UI Components': { icon: 'i-lucide-component', purpose: '为 Nuxt 应用添加 UI 组件' },
  'UI Frameworks': { icon: 'i-lucide-layout-dashboard', purpose: '使用 UI 框架构建 Nuxt 应用界面' },
  'Utilities': { icon: 'i-lucide-puzzle', purpose: '为 Nuxt 应用添加实用工具' },
  'Widgets & Embeds': { icon: 'i-lucide-app-window', purpose: '在 Nuxt 应用中嵌入小组件' }
}

const categoryLabels: Record<string, string> = {
  Official: '官方',
  AI: 'AI',
  Analytics: '数据分析',
  Animation: '动画',
  'API & Data Fetching': 'API 与数据获取',
  Authentication: '身份验证',
  'Backend & Database': '后端与数据库',
  'Charts & Maps': '图表与地图',
  'CMS & Content': 'CMS 与内容',
  'CSS & Theming': 'CSS 与主题',
  Deployment: '部署',
  Devtools: '开发者工具',
  'Ecommerce & Payments': '电商与支付',
  'Email & Notifications': '邮件与通知',
  'Forms & Validation': '表单与验证',
  i18n: '国际化',
  'Icons & Fonts': '图标与字体',
  'Images & Media': '图像与媒体',
  'Mobile & Desktop': '移动端与桌面端',
  'Monitoring & Logging': '监控与日志',
  Performance: '性能',
  Realtime: '实时功能',
  Security: '安全',
  SEO: 'SEO',
  'State Management': '状态管理',
  'UI Components': 'UI 组件',
  'UI Frameworks': 'UI 框架',
  Utilities: '工具',
  'Widgets & Embeds': '小组件与嵌入'
}

export const moduleImage = function (icon: string = '', _size: number = 80) {
  if (!icon) return

  if (/^https?:\/\//.test(icon)) return icon

  return `https://raw.githubusercontent.com/nuxt/modules/main/icons/${icon}`
  // if (/\.svg$/.test(icon)) return `https://raw.githubusercontent.com/nuxt/modules/main/icons/${icon}`

  // return `https://ipx.nuxt.com/s_${size},f_auto/gh/nuxt/modules/main/icons/${icon}`
}

export const moduleIcon = function (category: string) {
  return categoriesMap[category]?.icon || 'i-lucide-box'
}

/** Title and meta description of the modules listing filtered by `category`. */
export function moduleCategorySeo(category: string, count: number) {
  if (category === 'Official') {
    return { title: 'Nuxt 官方模块', description: `浏览 ${count} 个由 Nuxt 团队构建和维护的官方模块。` }
  }
  const label = categoryLabels[category] ?? category
  return { title: `${label} Nuxt 模块`, description: `浏览 ${count} 个由社区构建的 Nuxt 模块，可${categoriesMap[category]!.purpose}。` }
}

export function moduleMatchesSearch(module: Module, query: RegExp) {
  return [module.name, module.npm, module.category, categoryLabels[module.category], module.description, module.repo].some(value => typeof value === 'string' && value.search(query) !== -1)
}

/** First provider whose label matches, so searching "cloudinary" finds Nuxt Image. */
export function findModuleProvider(module: Module, query: RegExp) {
  return module.providers?.find(provider => provider.label.search(query) !== -1)
}

export type ModulePromptInfo = Pick<Module, 'name' | 'npm' | 'description' | 'website' | 'repo'>

export function buildModuleInstallCommand(names: string | string[]): string {
  const moduleNames = Array.isArray(names) ? names.join(' ') : names
  return `npx nuxt@latest module add ${moduleNames}`
}

export function buildModuleAgentPrompt(module: ModulePromptInfo): string {
  const lines = [`Install and configure the Nuxt module ${module.npm || module.name}: ${module.description || ''}`]
  if (module.website) lines.push(`Docs: ${module.website}`)
  if (module.repo) lines.push(`GitHub: https://github.com/${module.repo}`)
  // Avoid the literal `.env` string: Cursor's deeplink handler rejects prompts matching /\.env(\b|\W)/ with "Invalid text for prompt".
  lines.push(`\nSteps:\n1. Run \`${buildModuleInstallCommand(module.name)}\`\n2. Read the module documentation and add recommended configuration in \`nuxt.config.ts\`\n3. List any required environment variables in the example env file without filling in actual values`)
  return lines.join('\n')
}

export function buildBulkModuleAgentPrompt(modules: ModulePromptInfo[]): string {
  const modulesList = modules.map((m) => {
    const lines = [`- ${m.npm || m.name}: ${m.description || ''}`]
    if (m.website) lines.push(`  Docs: ${m.website}`)
    if (m.repo) lines.push(`  GitHub: https://github.com/${m.repo}`)
    return lines.join('\n')
  }).join('\n')
  const moduleNames = modules.map(m => m.name)

  return `Install and configure the following Nuxt modules in my project:

${modulesList}

Steps:
1. Run \`${buildModuleInstallCommand(moduleNames)}\` to install all modules at once
2. For each module, read its documentation and add the recommended configuration in \`nuxt.config.ts\`
3. List any required environment variables in the example env file without filling in actual values
4. Verify the setup is correct by checking that the modules are properly registered`
}

/** Shared copy/open actions for a single module's install command & agent prompt, tagged with an analytics `source`. */
export function useModuleInstallActions(module: () => ModulePromptInfo, source: string) {
  const { copy } = useClipboard()
  const { track } = useAnalytics()
  const { openInCursor, openInClaudeCode, openInVSCode } = useIdeDeeplink()

  const installCommand = computed(() => buildModuleInstallCommand(module().name))
  const agentPrompt = computed(() => buildModuleAgentPrompt(module()))

  function copyInstall() {
    track('Module Install Command Copied', { module: module().name, source })
    copy(installCommand.value, { title: '命令已复制到剪贴板：', description: installCommand.value })
  }

  function copyPrompt() {
    track('Module Agent Prompt Copied', { module: module().name, source })
    copy(agentPrompt.value, {
      title: 'AI 助手提示已复制！',
      description: module().npm || module().name,
      icon: 'i-custom-ai'
    })
  }

  function openCursor() {
    track('Module Prompt Opened', { module: module().name, ide: 'cursor', source })
    openInCursor(agentPrompt.value)
  }

  function openClaude() {
    track('Module Prompt Opened', { module: module().name, ide: 'claude', source })
    openInClaudeCode(agentPrompt.value)
  }

  function openVSCode() {
    track('Module Prompt Opened', { module: module().name, ide: 'vscode', source })
    openInVSCode(agentPrompt.value)
  }

  return { installCommand, agentPrompt, copyInstall, copyPrompt, openCursor, openClaude, openVSCode }
}

export const sorts: Filter[] = [
  { key: 'downloads', label: '下载量' },
  { key: 'stars', label: '星标数' },
  { key: 'publishedAt', label: '最近更新' },
  { key: 'createdAt', label: '创建时间' }
]

const orders: Filter[] = [
  { key: 'desc', label: '降序', icon: 'i-lucide-arrow-down-wide-narrow' },
  { key: 'asc', label: '升序', icon: 'i-lucide-arrow-up-wide-narrow' }
]

export const useModules = () => {
  const { data, execute } = useFetch('/api/v1/modules', {
    immediate: false,
    default: () => ({
      modules: [],
      stats: {
        maintainers: 0,
        contributors: 0,
        modules: 0
      }
    })
  })

  const stats = computed(() => data.value.stats)
  const modules = computed<Module[]>(() => data.value.modules || [])

  const module = useState<Module>('module', () => ({} as Module))

  // Data fetching
  async function fetchList() {
    if (modules.value.length) {
      return
    }

    return execute()
  }

  // Filters are local state: `/modules` syncs them with the URL without navigating.
  const q = ref('')
  const category = ref('')
  const sortBy = ref('')
  const orderBy = ref('')

  // Data

  const categories = computed<Filter[]>(() => {
    return Object.keys(categoriesMap)
      .map((name) => {
        return {
          key: name,
          label: categoryLabels[name] ?? name,
          active: category.value === name,
          // Same filters as a click, which only changes the category, for links opened in a new tab.
          to: {
            name: 'modules',
            query: { q: q.value || undefined, category: name === category.value ? undefined : name, sortBy: sortBy.value || undefined, orderBy: orderBy.value || undefined },
            state: { smooth: '#smooth' }
          },
          // Clicks filter in memory, so prefetching each category's `_payload.json` is wasted.
          prefetch: false,
          icon: categoriesMap[name]!.icon,
          onClick: (e: MouseEvent) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            e.preventDefault()
            category.value = category.value === name ? '' : name
          }
        }
      })
  })

  const selectedCategory = computed(() => {
    return categories.value.find(item => item.key === category.value)
  })

  const selectedSort = computed(() => {
    return sorts.find(sort => sort.key === sortBy.value) || sorts[0]
  })

  const selectedOrder = computed(() => {
    return orders.find(order => order.key === orderBy.value) || orders[0]
  })

  const isSponsorOrOfficial = (a: Module, b: Module) => {
    if (a.sponsor && !b.sponsor) {
      return -1
    } else if (!a.sponsor && b.sponsor) {
      return 1
    } else if (a.type === 'official' && b.type !== 'official') {
      return -1
    } else if (a.type !== 'official' && b.type === 'official') {
      return 1
    } else {
      return 0
    }
  }

  const filteredModules = computed<Module[]>(() => {
    let filteredModules = [...modules.value]
      .filter((module: Module) => {
        if (selectedCategory.value) {
          if (selectedCategory.value.key === 'Official') {
            return module.type === 'official'
          }
          if (module.category !== selectedCategory.value.key) {
            return false
          }
        }
        const queryRegExp = searchTextRegExp(q.value as string)
        if (q.value && !moduleMatchesSearch(module, queryRegExp) && !findModuleProvider(module, queryRegExp)) {
          return false
        }

        return true
      })
      .sort((a: Module, b: Module) => {
        const sortKey = selectedSort.value?.key as ModuleStatsKeys
        if (sortKey && a.stats && b.stats) {
          return (b.stats[sortKey] as number) - (a.stats[sortKey] as number)
        }
        return 0
      })

    if (selectedOrder.value?.key === 'asc') {
      filteredModules = filteredModules.reverse()
    }

    // sponsored & official modules in first place if no sort or order by
    if (!sortBy.value && !orderBy.value) {
      return filteredModules.sort(isSponsorOrOfficial)
    }
    return filteredModules
  })

  return {
    // Data fetching
    fetchList,
    // Data
    // versions,
    sorts,
    orders,
    // Computed
    stats,
    modules,
    filteredModules,
    module,
    categories,
    // types,
    // contributors,
    // stats,
    selectedCategory,
    // selectedType,
    // selectedVersion,
    selectedSort,
    selectedOrder,
    q,
    category,
    sortBy,
    orderBy
  }
}
