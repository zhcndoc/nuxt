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
  ui-header-height: 112px
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
  prose: 'prose prose-primary dark:prose-invert'
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

网站优先使用 SVG。切勿脱离山峰符号单独使用文字标识，也不要更改徽标颜色、拉伸或重绘徽标。请在 [/design-kit](https://nuxt.com/design-kit) 查看所有版本，在 [Figma 品牌套件](https://www.figma.com/community/file/1296154408275753939/nuxt-brand-kit) 获取源文件。

## 优先顺序 {#priority-order}

当需求相互冲突时，请按以下顺序保障：

1. 内容准确性：代码示例、版本、API 和相关表述。
2. 所用技术栈：Nuxt、Nuxt UI 和 Tailwind CSS v4。先使用现有组件和令牌，再考虑编写新的。
3. 可读性和可访问性：WCAG AA 对比度、键盘访问和可见焦点。
4. Nuxt 品牌形象：徽标、以绿色作为唯一的强调色、Outfit 标题、Inter 正文和中性背景。
5. 适合内容的构图，而非固定模板。

## 基础 {#foundation}

该系统基于 Tailwind CSS v4 之上的 Nuxt UI。品牌令牌通过 `@theme` 统一声明，其他内容均来自 Nuxt UI 的语义令牌：

```css
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

.dark {
  --ui-bg: var(--ui-color-neutral-950);
  --ui-bg-muted: var(--ui-color-neutral-900);
  --ui-bg-elevated: var(--ui-color-neutral-900);
  --ui-bg-accented: var(--ui-color-neutral-800);
}
```

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
      important: 'violet'
    }
  }
})
```

在 Nuxt UI 提供标题字体令牌（`--ui-font-heading`）之前，标题规则放在基础层中。其中的 `!important` 会覆盖 Nuxt UI 在标题中硬编码的粗体字重，因此字重工具类不会影响标题。

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
| `secondary` | `blue` | 次要操作 |
| `success` | `green` | 成功状态 |
| `info` | `blue` | 信息提示 |
| `warning` | `yellow` | 警告、待处理状态 |
| `error` | `red` | 错误、破坏性操作 |

在 Nuxt UI 组件上使用 `color` 属性（`<UButton color="neutral" variant="subtle">`），在标记中使用语义化工具类。浅色模式使用 `-500` 色阶，深色模式使用 `-400`。

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
| 展示标题 | 营销页面中定义主题的唯一核心表述 | `UPageHero` 标题 |
| 区块标题 | 营销页面中的主要内容转折 | `UPageSection` 标题（`text-3xl sm:text-4xl lg:text-5xl`） |
| 页面标题 | 文档和内容页面 | `UPageHeader` 标题（`text-3xl sm:text-4xl`） |
| 内容标题 | 内容中的嵌套结构 | Prose `h2` / `h3` / `h4`（`text-2xl` / `text-xl` / `text-lg`） |
| 卡片标题 | 同级卡片中的标题 | `UPageCard` 标题（`text-base`） |
| 导语 | 标题下方简短的引导段落 | 主视觉或区块描述（`text-lg sm:text-xl text-muted`） |
| 正文 | 阅读文本 | Prose 段落（`text-base leading-7`） |
| 标签 | 简短名称、控件、导航 | `text-sm` |
| 说明文字 | 对佐证内容的补充说明 | `text-sm text-muted` 或 `text-xs text-muted` |

所有标题均以 Outfit 中等字重呈现。正文使用常规字重，谨慎使用强调。正文每行保持约 65 个字符，通过改写而非缩小文字来适应空间。

## 布局 {#layout}

### 页面框架 {#layout-page-shells}

每个页面都使用三种 Nuxt UI 页面框架之一。`UPageHero` 和 `UPageSection` 会渲染各自的容器，因此不要将它们包裹在 `UContainer` 中，其他内容则放在恰好一个 `UContainer` 中，使页面内容与页头对齐。`UPageCTA` 是卡片：将其放在 `UContainer` 或 `UPageSection` 内，或使用 `class="rounded-none"` 明确将其设计为通栏区块。

**主视觉与内容**（列表、设计套件、团队）：

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

**区块**（落地页）：`UPageHero` 后接多个 `UPageSection` 区块，不额外包裹容器。

**分栏内容**（文档、文章、模块和机构页面）：一个 `UPage` 通过 `#left` 和 `#right` 插槽提供分栏。文章和详情页的页头横跨各栏，位于分栏上方：

```vue
<UContainer>
  <UPageHeader title="…" />
  <UPage>
    <UPageBody>
      <!-- content -->
    </UPageBody>
    <template #right>
      <UContentToc />
    </template>
  </UPage>
</UContainer>
```

文档将页头放在 `UPage` 内，使导航能显示在其旁边。仅当内容需要位于一栏上方、同时位于另一栏旁边时，才使用第二个 `UPage`：部署页面的导航位于左侧，页头位于目录上方。需要侧边栏的主视觉页面应将侧边栏放在主视觉之后：`UPage` > `UPageHero` + `UContainer` > 带有 `#left` 的 `UPage`。

### 间距和网格 {#layout-spacing-and-grid}

- **间距：** Tailwind 的 4px 刻度。组内使用 `gap-2`，相关项之间使用 `gap-4`，区块使用 `py-10 sm:py-20`，主视觉使用 `py-24 sm:py-32 lg:py-40`。
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
| 破坏性操作 | `<UButton color="error">` |
| 表单输入 | `UInput`、`UFormField` |
| 页面结构 | `UPage`、`UPageHero`、`UPageSection`、`UPageHeader`、`UPageBody` |
| 内容 | `ContentRenderer` 搭配 prose 组件 |
| 导航 | `UHeader`、`UNavigationMenu`、`UContentNavigation` |
| 菜单 | `UDropdownMenu`、`UContextMenu` |

界面操作图标使用 Lucide（`i-lucide-*`），第三方品牌图标使用 Simple Icons（`i-simple-icons-*`）。仅在图标能帮助用户更快识别操作时使用。

## 效果和动效 {#effects-and-motion}

界面采用平面设计。只有当边框或卡片能传达间距无法表达的分组、选择或交互含义时，才添加它们。

绿色主视觉光晕（`HeroBackground`，通过页面的 `heroBackground` 元数据启用）仅用于营销页面的主视觉区域。文档和产品界面不使用光晕、渐变或模糊。

默认保持静态。仅用动画解释状态变化或确认操作，保留 Nuxt UI 内置的过渡效果，并尊重 `prefers-reduced-motion`。

## 语气与内容 {#voice-and-content}

- 标签、按钮、标题和选项卡使用标题式大小写，正文和辅助文本使用句首式大小写。
- 用动词和名词命名操作：`Deploy Project`、`Install Module`。
- 错误信息要说明发生了什么以及下一步该怎么做。
- 提示消息要指出具体发生变化的对象，不加句号结尾，不使用“successfully”。
- 空状态要指向第一个操作。
- 进行中状态使用现在分词和省略号：`Deploying…`。

## 应避免的做法 {#reject-these}

- 在组件中使用原始十六进制值或调色板类（`text-gray-500`），而非语义令牌。
- 按值或字体命名新令牌，例如 `--font-outfit` 或 `--color-dark-navy`。
- 随意设置字号，或在标题上使用字重工具类。
- 在营销主视觉之外使用光晕、渐变、渐变文字或模糊。
- 卡片内嵌套卡片，或用边框弥补层级不清。
- 将图标放入彩色色块、使用装饰性图标或混用图标集。
- 为适应空间而使用细小的弱化正文。
- 仅通过颜色传达状态。
- 重新实现 Nuxt UI 组件。
- 在 `UContainer` 内放置 `UPageHero` 或 `UPageSection`，或在 `UContainer` 内嵌套另一个 `UContainer`。
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
