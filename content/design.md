---
version: alpha
name: Nuxt
description: Nuxt 设计系统，由 Nuxt UI 和 Tailwind CSS v4 提供支持。深色模式是默认主题。
brand:
  green: "#00DC82"
  black: "#0A0A0A"
  white: "#FFFFFF"
theme:
  font-sans: "'Inter', ui-sans-serif, system-ui, sans-serif"
  font-heading: "'Outfit', var(--font-sans)"
  color-green-50: "#EFFDF5"
  color-green-100: "#D9FBE8"
  color-green-200: "#B3F5D1"
  color-green-300: "#75EDAE"
  color-green-400: "#00DC82"
  color-green-500: "#00C16A"
  color-green-600: "#00A155"
  color-green-700: "#007F45"
  color-green-800: "#016538"
  color-green-900: "#0A5331"
  color-green-950: "#052E16"
semantic-colors:
  primary: green
  neutral: neutral
  important: violet
  secondary: blue
  success: green
  info: blue
  warning: yellow
  error: red
css-variables:
  ui-container: 90rem
  ui-bg-dark: "var(--ui-color-neutral-950)"
  ui-bg-muted-dark: "var(--ui-color-neutral-900)"
  ui-bg-elevated-dark: "var(--ui-color-neutral-900)"
  ui-bg-accented-dark: "var(--ui-color-neutral-800)"
text:
  dimmed: "text-dimmed"
  muted: "text-muted"
  toned: "text-toned"
  default: "text-default"
  highlighted: "text-highlighted"
  inverted: "text-inverted"
background:
  default: "bg-default"
  muted: "bg-muted"
  elevated: "bg-elevated"
  accented: "bg-accented"
  inverted: "bg-inverted"
border:
  default: "border-default"
  muted: "border-muted"
  accented: "border-accented"
  inverted: "border-inverted"
radius:
  base: "var(--ui-radius)"
  utilities: [xs, sm, md, lg, xl, 2xl, 3xl]
components:
  button-primary: 'UButton color="primary"'
  button-secondary: 'UButton color="neutral" variant="subtle"'
  button-ghost: 'UButton variant="ghost"'
  button-error: 'UButton color="error"'
  input: 'UInput'
  container: 'UContainer'
  page-hero: 'UPageHero'
  app-shell: 'UDashboardGroup'
  auth-form: 'UAuthForm'
  error-page: 'UError'
  content: 'ContentRenderer (@nuxt/content)'
---

# Nuxt

使用此文件设计或构建 Nuxt 官方界面：nuxt.com、框架和模块文档、模板，以及其他使用 [Nuxt UI](https://ui.nuxt.com) 构建的 Nuxt 官方网站。front matter 中的令牌是机器可读的数据源，正文说明如何应用它们。

整体风格以开发者为中心，沉稳而自信：纯中性背景、以 Nuxt 绿色作为唯一的强调色，并保留充足的留白。通过清晰的表达和准确的技术内容建立信任，切勿依赖装饰。深色模式是默认主题。

## 下载徽标 {#download-logos}

透明背景的 Nuxt 官方徽标：

- 适用于深色背景：[绿色与白色 SVG](https://nuxt.com/assets/design-kit/logo-green-white.svg) · [PNG](https://nuxt.com/assets/design-kit/logo-green-white.png)
- 适用于浅色背景：[绿色与黑色 SVG](https://nuxt.com/assets/design-kit/logo-green-black.svg) · [PNG](https://nuxt.com/assets/design-kit/logo-green-black.png)
- 仅图标：[绿色 SVG](https://nuxt.com/assets/design-kit/icon-green.svg) · [PNG](https://nuxt.com/assets/design-kit/icon-green.png)
- 全部资源，包含单色版本：[nuxt-brand-assets.zip](https://nuxt.com/nuxt-brand-assets.zip)

网站优先使用 SVG。在页头，让徽标链接到首页，设置 `aria-label="Nuxt home"`，并按高度确定尺寸（`h-6`、`w-auto`）。为适应配色模式，内联绿色与白色版本的 SVG，将白色路径设为 `fill="currentColor"`，并为 SVG 设置 `class="text-highlighted"`。这样山峰始终为绿色，文字标识随主题变为黑色或白色。如果不内联，则同时渲染两个文件，用 `dark:hidden` / `hidden dark:block` 切换。

如果需要标明 Nuxt Studio 等产品的名称，将名称放在页面标题中，或在徽标旁使用普通的 `font-heading` 文本，并用间距隔开。切勿修改 SVG 来添加产品名称。

切勿脱离山峰符号单独使用文字标识，也不要更改徽标颜色、拉伸或重绘徽标。请在 [/design-kit](https://nuxt.com/design-kit) 查看所有版本，在 [Figma 品牌套件](https://www.figma.com/community/file/1296154408275753939/nuxt-brand-kit) 获取源文件。

## 优先顺序 {#priority-order}

当需求相互冲突时，请按以下顺序保障：

1. 内容准确性：代码示例、版本、API 和相关表述。
2. 所用技术栈：Nuxt、Nuxt UI 和 Tailwind CSS v4。先使用现有组件和令牌，再考虑编写新的。
3. 可读性和可访问性：WCAG AA 对比度、键盘访问和可见焦点。
4. Nuxt 品牌形象：徽标、以绿色作为唯一的强调色、Outfit 标题、Inter 正文和中性背景。
5. 适合内容的构图，而非固定模板。

## 基础 {#foundation}

该系统基于 Tailwind CSS v4 之上的 Nuxt UI。品牌令牌通过 `@theme` 统一声明，其他内容均来自 Nuxt UI 的语义令牌：

```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Outfit', var(--font-sans);
  --color-green-50: #EFFDF5;
  /* … green-100 到 green-950 … */
  --color-green-400: #00DC82;
}

@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-weight-medium) !important;
  }
}

:root {
  --ui-container: 90rem;
}

.dark {
  --ui-bg: var(--ui-color-neutral-950);
  --ui-bg-muted: var(--ui-color-neutral-900);
  --ui-bg-elevated: var(--ui-color-neutral-900);
  --ui-bg-accented: var(--ui-color-neutral-800);
}
```

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
      important: 'violet'
    },
    pageHero: {
      slots: {
        container: 'py-10 sm:py-20 lg:py-20',
        title: 'sm:text-6xl'
      }
    }
  }
})
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' }
    }
  },
  colorMode: {
    preference: 'dark'
  },
  ui: {
    theme: {
      // Nuxt UI only generates the colors listed here; without `important`, color="important" does nothing.
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'important']
    },
    // Registers the Prose components on sites without @nuxt/content, such as a landing page with a code snippet.
    prose: true
  }
})
```

文档、博客、更新日志和其他文本内容均使用 [Nuxt Content](https://content.nuxt.com)。将 `'@nuxt/content'` 加入 `modules`（此时 Nuxt UI 会自行注册 Prose 和 `UContent*` 组件，可以移除 `prose: true`），然后使用 Markdown 编写页面：

```ts [content.config.ts]
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'docs/**/*.md' })
  }
})
```

```vue
<!-- app/pages/docs/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
const { data: navigation } = await useAsyncData('docs-navigation', () => queryCollectionNavigation('docs'))
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <!-- inside the Docs shell below -->
  <ContentRenderer :value="page" />
  <!-- table of contents: <UContentToc :links="page?.body?.toc?.links" /> -->
</template>
```

Nuxt Content 为 Markdown 提供语法高亮、标题锚点和提示块（`::note`、`::tip`、`::warning`、`::caution`）。对于文本内容，切勿在 Vue 中手写 Prose 组件或目录数组。

每个页面用 `useSeoMeta({ title, description })` 设置各自的标题和描述。

深色模式是默认模式。保留 `UColorModeButton`，让访客可以切换。Inter 和 Outfit 无需 `<link>` 标签，Nuxt UI 随附的 `@nuxt/fonts` 会根据 `@theme` 中的声明自行托管这些字体。

在 Nuxt UI 提供标题字体令牌（`--ui-font-heading`）之前，标题规则放在基础层中。其中的 `!important` 会覆盖 Nuxt UI 在标题中硬编码的粗体字重，因此字重工具类不会影响标题。

这条规则只适用于 `h1`–`h6`。一些 Nuxt UI 组件用 `div` 渲染标题（`UAuthForm`、`UPricingPlan`、`UPageCard`、`UAccordion`），因此这些标题仍使用 Inter。卡片标题和手风琴的展开控件适用这种样式。当这类标题用作页面或区块的标题时，例如身份验证表单或定价方案，在 `#title` 插槽中放入实际的标题元素（`<template #title><h1>Sign In to Nuxt</h1></template>`），使它使用 Outfit 并纳入文档大纲。

## 公共令牌 {#public-tokens}

按用途命名令牌，不要按值或字体命名。仅使用下列令牌，不要在页面代码中自行创建、设置别名或重新声明。通过向 `@theme` 或 `app.config.ts` 添加用途来扩展系统，不要硬编码值。

### 字体 {#public-tokens-fonts}

| 令牌 | 工具类 | 用途 |
|-------|---------|------|
| `--font-heading` | `font-heading` | 各级标题（Outfit） |
| `--font-sans` | `font-sans` | 正文、标签、控件（Inter） |
| `--font-mono` | `font-mono` | 代码、命令、文件路径、标识符 |

仅对标识符本身设置 `font-mono`，不要将其应用于周围的整个句子。

### 颜色 {#public-tokens-colors}

| 语义 | 映射到 | 用途 |
|----------|---------|-----|
| `primary` | `green` | 视图中的主要操作、链接、激活的导航 |
| `neutral` | `neutral` | 文本、边框、背景、禁用状态 |
| `important` | `violet` | 少量用于强调的徽章 |
| `secondary` | `blue` | 少量用于信息强调，避免用于按钮 |
| `success` | `green` | 成功状态 |
| `info` | `blue` | 信息提示 |
| `warning` | `yellow` | 警告、待处理状态 |
| `error` | `red` | 错误、破坏性操作 |

在 Nuxt UI 组件上使用 `color` 属性（`<UButton color="neutral" variant="subtle">`），在标记中使用语义化工具类。浅色模式使用 `-500` 色阶，深色模式使用 `-400`。请保留这些色阶，即使要提高对比度，也不要按模式重新映射 `--ui-primary` 或其他语义颜色。次要操作使用中性色按钮（见组件部分），避免使用 `secondary`。

绿色用于标记交互和状态，包括每个视图中唯一的主要操作、链接、激活的导航和选中项。切勿大面积使用绿色。图表、条形和其他数据采用中性色阶，仅用主色突出需要关注的数据系列或条形。小型图表可以使用普通元素（采用语义颜色的 `div` 条形和文本摘要），无需为此引入图表库。`success` 也是绿色，因此要为成功状态配上图标和文字（「就绪」「已保存」），避免被误认为可执行的操作。

### 文本、背景和边框 {#public-tokens-text-surfaces-and-borders}

| 文本 | 用途 | 背景 | 用途 | 边框 | 用途 |
|------|------|---------|------|--------|------|
| `text-highlighted` | 标题、强调 | `bg-default` | 页面画布 | `border-default` | 标准 |
| `text-default` | 正文 | `bg-muted` | 轻微分组 | `border-muted` | 分隔线 |
| `text-toned` | 三级文本 | `bg-elevated` | 卡片、弹出层 | `border-accented` | 强调 |
| `text-muted` | 次要文本、说明文字 | `bg-accented` | 悬停、激活 | `border-inverted` | 反转背景上 |
| `text-dimmed` | 禁用、占位符 | `bg-inverted` | 反转 | | |

深色画布使用 `neutral-950`（`#0A0A0A`），比 Nuxt UI 的默认值更深。

### 品牌颜色 {#public-tokens-brand-colors}

用于徽标、社交媒体图片和印刷品。不要在 UI 代码中直接使用这些原始值。

| 名称 | 十六进制 | 用途 |
|------|-----|-----|
| 绿色 | `#00DC82` | 徽标、品牌强调色。映射到 `green-400`。 |
| 黑色 | `#0A0A0A` | 深色背景。映射到 `neutral-950`。 |
| 白色 | `#FFFFFF` | 深色背景上的文本和徽标。 |

## 排版用途 {#typography-roles}

按用途选择，而非按大小。同级元素始终使用相同的排版用途，不要因为文本较长就单独调整某个元素的大小。

| 用途 | 使用场景 | 实现 |
|------|-----|----------------|
| 展示标题 | 营销或列表页面中定义主题的唯一核心表述 | `UPageHero` 标题（通过 `pageHero` 覆盖为 `text-5xl sm:text-6xl`），比区块标题高一级，使主视觉保持突出 |
| 区块标题 | 营销页面中的主要内容转折 | `UPageSection` 标题（`text-3xl sm:text-4xl lg:text-5xl`），其上方的 `headline` 保持组件默认的主色 |
| 页面标题 | 文档和内容页面 | `UPageHeader` 标题（`text-3xl sm:text-4xl`） |
| 内容标题 | 内容中的嵌套结构 | Prose `h2` / `h3` / `h4`（`text-2xl` / `text-xl` / `text-lg`） |
| 表单标题 | 登录等专用表单的标题 | `UAuthForm` 标题（`text-xl`），在其 `#title` 插槽中使用 `h1` |
| 面板标题 | 应用视图中的分组，例如图表、列表或设置组 | 带有 `text-lg text-highlighted` 的 `h2` |
| 卡片标题 | 同级卡片中的标题 | `UPageCard` 标题（`text-base`） |
| 指标 | 作为卡片重点的数值，例如统计数字或价格 | `font-heading text-3xl text-highlighted tabular-nums`，价格保留 `UPricingPlan` 的默认样式 |
| 导语 | 标题下方简短的引导段落 | 主视觉或区块描述（`text-lg sm:text-xl text-muted`） |
| 正文 | 阅读文本 | Prose 段落（`text-base leading-7`） |
| 标签 | 简短名称、控件、导航 | `text-sm` |
| 说明文字 | 对佐证内容的补充说明 | `text-sm text-muted` 或 `text-xs text-muted` |

所有标题均以 Outfit 中等字重呈现。正文使用常规字重，谨慎使用强调。通过改写使文字适应空间，避免缩小字号。

正文每行保持约 65 个字符。文档布局的两侧栏已限定好这个宽度，因此无需给 `UPageBody` 添加 `max-width`。其他地方将正文放在居中的 `max-w-3xl` 栏内。

## 布局 {#layout}

### 页面框架 {#layout-page-shells}

每个页面使用下方的一种框架，按页面用途选择。`UPageHero` 和 `UPageSection` 会渲染各自的容器，因此不要将它们包裹在 `UContainer` 中，其他内容则放在恰好一个 `UContainer` 中，使页面内容与页头对齐。`UPageCTA` 是卡片，可将其放在 `UContainer` 或 `UPageSection` 内，或使用 `class="rounded-none"` 明确将其设计为通栏区块。`UPageCTA` 内的 `UContainer` 仅为卡片内容提供内边距，因此用 `UContainer` 包裹卡片不算嵌套。

**主视觉与内容**（列表、目录、设计套件、团队）：

```vue
<UPage>
  <UPageHero title="…" description="…" />
  <UPageBody>
    <UContainer>
      <!-- content -->
    </UContainer>
  </UPageBody>
</UPage>
```

**区块**（落地页和定价页）：`UPageHero` 后接多个 `UPageSection` 区块，不额外包裹容器。定价方案用 `UPricingPlans` 放在主视觉的默认插槽或第一个区块中，方案对比使用 `UPricingTable`。

**文档**由一个 `UPage` 容纳导航、页头、正文和目录，使导航与页头并排显示：

```vue
<UContainer>
  <UPage>
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>
    <UPageHeader title="…" description="…" />
    <UPageBody>
      <!-- content -->
    </UPageBody>
    <template #right>
      <UContentToc :links="page?.body?.toc?.links" />
    </template>
  </UPage>
</UContainer>
```

在小于 `lg` 的屏幕上，`UPageAside` 会隐藏，因此在 `UHeader` 的 `#body` 插槽中渲染同一份 `UContentNavigation`，作为移动端菜单。

**详情页**（模块和机构页面）的页头横跨各栏，位于分栏上方：

```vue
<UContainer>
  <UPageHeader title="…" />
  <UPage>
    <UPageBody>
      <!-- content -->
    </UPageBody>
    <template #right>
      <!-- table of contents, stats, links -->
    </template>
  </UPage>
</UContainer>
```

**文章**（博客文章）在一个 `UContainer` 中将页头和正文放入居中的 `max-w-3xl` 栏。在 `xl` 及以上屏幕上，目录位于旁边的一栏。

仅当内容需要位于一栏上方、同时位于另一栏旁边时，才使用第二个 `UPage`：部署页面的导航位于左侧，页头位于目录上方。需要侧边栏的主视觉页面应将侧边栏放在主视觉之后：`UPage` > `UPageHero` + `UContainer` > 带有 `#left` 的 `UPage`。

**应用**（仪表盘、设置、控制台）使用 `UDashboardGroup` > `UDashboardSidebar` + `UDashboardPanel`，在每个面板的 `#header` 中用 `UDashboardNavbar` 承载视图标题。这些组件自行确定尺寸，因此无需使用 `UContainer`、`UPage`、`UPageHeader` 或主视觉区。侧边栏包含徽标、垂直的 `UNavigationMenu` 和账户控件。在移动端，从导航栏的菜单按钮打开侧边栏（组件默认行为）。包含少量子页面的设置也可以使用文档框架，将导航放在 `#left` 中。

**专用页面**（登录、注册、重置密码、验证邮箱）无需站点导航。页面占满高度，顶部放置徽标，居中的 `max-w-sm` 栏内放置一个 `UAuthForm`。没有输入字段的状态页面使用同样的标题、描述和操作。

**错误页面**依次显示站点页头、带有错误信息的 `UError` 和页脚。

### 间距和网格 {#layout-spacing-and-grid}

- **间距：** Tailwind 的 4px 刻度。组内使用 `gap-2`，相关项之间使用 `gap-4`。保留 `UPageSection` 的默认内边距，主视觉通过 `app.config.ts` 中的 `pageHero` 覆盖得到 `py-10 sm:py-20`。
- **断点：** Tailwind 默认值（`sm` 640px、`md` 768px、`lg` 1024px、`xl` 1280px、`2xl` 1536px）。
- **圆角：** 每个 `rounded-*` 工具类都派生自 `--ui-radius`。控件和卡片使用 `rounded-md` 或 `rounded-lg`，`rounded-2xl` 仅用于大型面板。

每处间距都只由一方负责：由父元素的 `gap` 设置间距，子元素不要再添加相互叠加的外边距。

## 组件 {#components}

使用 Nuxt UI 原语。不要重新实现已有功能：

| 模式 | 组件 |
|---------|-----------|
| 主要操作 | `<UButton color="primary">` |
| 次要操作 | `<UButton color="neutral" variant="subtle">` |
| 三级或行内操作 | `<UButton variant="ghost">` 或 `variant="link"` |
| 破坏性操作 | 用 `<UButton color="error">` 确认，在列表行中使用 `color="error" variant="ghost"` |
| 表单输入 | `UForm`、`UFormField`、`UInput` |
| 页面结构 | `UPage`、`UPageHero`、`UPageSection`、`UPageHeader`、`UPageBody` |
| 应用结构 | `UDashboardGroup`、`UDashboardSidebar`、`UDashboardPanel`、`UDashboardNavbar` |
| 内容 | 文档、博客或更新日志页面使用 `@nuxt/content` 的 `ContentRenderer`，营销页面中的单个代码片段可直接使用 `ProsePre` |
| 导航 | `UHeader`、`UNavigationMenu`、`UContentNavigation`、`UBreadcrumb` |
| 筛选和视图切换 | 带有 `:content="false"` 和 `color="neutral"` 的 `UTabs`、`USelect`、带搜索图标的 `UInput` |
| 数据 | `UTable`、用 `UBadge` 显示状态 |
| 身份验证和错误 | `UAuthForm`、`UError` |
| 空状态 | `UEmpty` |
| 定价 | `UPricingPlans`、`UPricingTable` |
| 菜单 | `UDropdownMenu`、`UContextMenu` |
| 确认 | `UModal` |

界面操作图标使用 Lucide（`i-lucide-*`），第三方品牌图标使用 Simple Icons（`i-simple-icons-*`）。代码块的文件图标使用 `ProsePre` 默认采用的 VS Code Icons（`i-vscode-icons-*`），将 `@iconify-json/vscode-icons` 与另外两套图标一起安装。仅在图标能帮助用户更快识别操作或状态时使用。组件自带的图标继续保留，例如提示块和提示消息的图标。

对于删除账户等不可撤销的破坏性操作，使用普通区块说明操作后果，并提供打开 `UModal` 的入口。将用于确认操作的实色错误按钮放在模态框中，也可要求用户输入资源名称。切勿用红色卡片包裹整个区块。

## 效果和动效 {#effects-and-motion}

界面采用平面设计。只有当边框或卡片能传达间距无法表达的分组、选择或交互含义时，才添加它们。

主视觉区域同样采用平面设计，所有页面都避免使用光晕、渐变和背景特效。自行编写的代码不添加模糊效果，保留 Nuxt UI 在粘性界面元素（`UHeader`、粘性表头、移动端目录）上设置的背景模糊。

默认保持静态。仅用动画解释状态变化或确认操作，保留 Nuxt UI 内置的过渡效果，并尊重 `prefers-reduced-motion`。

滑动到页面边缘时，保持页面稳定。裁剪 `html` 和 `body` 的水平溢出，让触控板的横向滑动只用于前进和后退，页面本身不会横移。使用 `clip` 保持 `position: sticky` 可用，`hidden` 会破坏这一行为。仅对只使用鼠标或触控板的设备禁用纵向回弹（带触摸屏的笔记本按触控设备处理），这样页头、侧边栏和导航栏等粘性元素在 macOS 上不会回弹，触控设备则保留下拉刷新。切勿在 x 轴设置 `overscroll-behavior`，否则会禁用滑动导航。

```css [app/assets/css/main.css]
html,
body {
  overflow-x: clip;
}

@media (pointer: fine) and (not (any-pointer: coarse)) {
  html {
    overscroll-behavior-y: none;
  }
}
```

## 语气与内容 {#voice-and-content}

- 所有标题使用标题式大小写，包括主视觉、区块、页面、卡片和模态框的标题、正文标题、标签、按钮、选项卡、菜单项和表头。除了首词之后的冠词、连词和短介词（a、an、the、and、or、by、for、in、of、on、to、with），每个词首字母均大写，例如 `Privacy by Default`，避免写成 `Privacy by default`。标题末尾不加句号。
- 描述、导语、正文、辅助文本、占位符、提示消息和空状态消息使用句首式大小写。保留代码、产品名称和用户数据的原样。
- 用动词和名词命名操作：`Deploy Project`、`Install Module`。
- 错误信息要说明发生了什么以及下一步该怎么做。
- 提示消息要指出具体发生变化的对象，不加句号结尾，不使用“successfully”。
- 空状态要指向第一个操作。
- 进行中状态使用现在分词和省略号：`Deploying…`。
- 像编写真实内容一样编写占位和模拟内容，使用合理的数字和明确虚构的名称，例如 Acme 或 Jane Doe。切勿把捏造的引言、使用情况或客户徽标归于真实人物或公司。界面中不标注内容为虚构、示意或示例，页面发布者会在发布时替换这些内容。

## 应避免的做法 {#reject-these}

- 在组件中使用原始十六进制值或调色板类（`text-gray-500`），而非语义令牌。
- 在浅色或深色模式下覆盖 `--ui-primary` 或其他语义颜色。
- 按值或字体命名新令牌，例如 `--font-outfit` 或 `--color-dark-navy`。
- 在自行编写的代码中随意设置字号，或在标题上使用字重工具类。可以保留 Nuxt UI 组件的默认字号。
- 在任何页面（包括主视觉区域）用自行编写的代码添加光晕、渐变、渐变文字或模糊。
- 卡片内嵌套卡片，或用边框弥补层级不清。
- 将图标放入彩色色块、使用装饰性图标或混用图标集。
- 为适应空间而使用细小的弱化正文。
- 标题使用句首式大小写或以句号结尾。
- 仅通过颜色传达状态，或在图表等较大区域填充绿色。
- 重新实现 Nuxt UI 组件。
- 在 `UPageHero` 或 `UPageSection` 外包裹 `UContainer`，或嵌套两个 `UContainer`。
- 脱离山峰符号单独使用文字标识，或更改徽标颜色、拉伸或重绘徽标。

## 发布前检查 {#review-before-shipping}

1. **品牌形象：** 能否通过徽标、绿色强调色和 Outfit 标题一眼认出 Nuxt？
2. **层级：** 每个视图是否有一个主导元素，每个元素是否都使用了对应的排版用途？
3. **令牌：** 所有颜色、字体和圆角是否都使用语义令牌，没有原始值？
4. **克制：** 是否有边框、卡片、图标、颜色或效果可以移除而不丢失含义？如果有，就移除它。
5. **主题：** 深色和浅色模式是否保持相同的层级和对比度？
6. **可访问性：** 是否所有内容都能通过键盘使用，并提供可见焦点、标签和替代文本？
7. **重排：** 布局是否能在窄屏上重新排列而不溢出？

## 资源 {#resources}

- 品牌资源：[/design-kit](https://nuxt.com/design-kit) 和 [Figma 品牌套件](https://www.figma.com/community/file/1296154408275753939/nuxt-brand-kit)
- Nuxt UI 设计系统：[ui.nuxt.com/docs/getting-started/theme/design-system](https://ui.nuxt.com/docs/getting-started/theme/design-system)
- Nuxt UI CSS 变量：[ui.nuxt.com/docs/getting-started/theme/css-variables](https://ui.nuxt.com/docs/getting-started/theme/css-variables)
