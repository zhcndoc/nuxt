---
version: alpha
name: Nuxt
description: Nuxt 设计系统，由 Nuxt UI 和 Tailwind CSS v4 提供支持。深色模式是默认主题。
brand:
  green: "#00DC82"
  navy: "#020420"
  white: "#FFFFFF"
theme:
  font-sans: "'Public Sans', sans-serif"
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
  neutral: slate
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

## 概述

Nuxt 是 Nuxt 产品和沟通的设计语言。其美学以开发者为中心且充满自信：深海军蓝的表面、Nuxt 绿色作为唯一的强调色，以及充足的留白。应优先考虑可读性、可访问性和清晰度，而不是装饰性。使用颜色来传达状态或层级，而不是填充空间。

该系统由 [Nuxt UI](https://ui.nuxt.com) 和 **Tailwind CSS v4** 提供支持，并使用 **CSS 变量** 作为设计令牌。颜色采用语义化命名（`primary`、`neutral`、`error`…），而不是在组件中硬编码十六进制值。深色模式是默认主题。

Logo 资源和可下载的品牌文件位于 [/design-kit](/design-kit)。

## Tailwind CSS

主题令牌通过 `@theme` 指令定义：

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;
  --color-green-50: #EFFDF5;
  /* … green-100 到 green-950 … */
  --color-green-400: #00DC82;
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

有关完整的 `@theme` 自定义选项，请参阅 [Nuxt UI 设计系统文档](https://ui.nuxt.com/docs/getting-started/theme/design-system)。

## 品牌颜色

以下是 Nuxt 的营销配色，与 Nuxt UI 的语义令牌不同：

| 名称 | 十六进制 | 用途 |
|------|-----|-------|
| 绿色 | `#00DC82` | Logo、品牌强调色。映射到 `@theme` 中的 `green-400`。 |
| 海军蓝 | `#020420` | 深色背景、OG 图片、`theme-color` 元标签。 |
| 白色 | `#FFFFFF` | 深色表面上的文本、浅色 logo 变体。 |

完整的绿色色阶（`green-50`–`green-950`）定义在 `@theme static` 中，并为 `primary` 语义颜色提供支持。

## 语义颜色

Nuxt UI 通过运行时配置将语义别名映射到 Tailwind 颜色刻度：

| 语义 | 映射到 | 用途 |
|----------|---------|-------|
| `primary` | `green` | CTA、链接、激活的导航、品牌元素 |
| `neutral` | `slate` | 文本、边框、背景、禁用状态 |
| `important` | `violet` | 高亮徽章和强调内容 |
| `secondary` | `blue`（默认） | 次要操作 |
| `success` | `green`（默认） | 成功状态 |
| `info` | `blue`（默认） | 信息提示、工具提示 |
| `warning` | `yellow`（默认） | 警告、待处理状态 |
| `error` | `red`（默认） | 错误、破坏性操作 |

在 Nuxt UI 组件上使用 `color` 属性：

```vue
<UButton color="primary">开始使用</UButton>
<UButton color="neutral" variant="subtle">了解更多</UButton>
<UButton color="error">删除</UButton>
```

已注册的主题颜色：`primary`、`secondary`、`info`、`success`、`warning`、`error`、`important`。

## CSS 变量

Nuxt UI 提供了由 `--ui-*` CSS 变量支持的语义化工具类。请参阅 [CSS variables docs](https://ui.nuxt.com/docs/getting-started/theme/css-variables)。

### 颜色工具类

`text-primary`、`bg-success`、`border-error` 等——每个都会解析为映射后的颜色阶中的某个色阶。浅色模式使用 `-500` 色阶；深色模式使用 `-400`。

### 文本层级

| Class | Role |
|-------|------|
| `text-dimmed` | 禁用、占位符 |
| `text-muted` | 次要文本、说明文字 |
| `text-toned` | 三级文本 |
| `text-default` | 正文文本 |
| `text-highlighted` | 标题、强调 |
| `text-inverted` | 反转背景上的文本 |

### 背景层级

| Class | Role |
|-------|------|
| `bg-default` | 页面表面 |
| `bg-muted` | 轻微填充、分组内容 |
| `bg-elevated` | 卡片、弹出层 |
| `bg-accented` | 悬停状态、激活面板 |
| `bg-inverted` | 反转表面 |

深色主题将 `--ui-bg` 覆盖为 `neutral-950`（比 Nuxt UI 默认的 `neutral-900` 更深），以营造接近海军蓝的感觉。

### 边框层级

| Class | Role |
|-------|------|
| `border-default` | 标准边框 |
| `border-muted` | 轻微分隔线 |
| `border-accented` | 强调边框 |
| `border-inverted` | 反转表面上的边框 |

卡片和模块通常在 `bg-elevated` 或 `bg-muted` 上使用 `border border-default`。

## 排版

**字体：** Public Sans (`--font-sans`)，通过 `@nuxt/fonts` 加载。

Nuxt UI 不提供像专门设计系统那样固定的字号层级。请使用 Tailwind 工具类：

| 上下文 | 常用类 |
|---------|----------------|
| 页面主视觉 | `text-5xl sm:text-7xl font-semibold` |
| 区块主视觉 | `sm:text-5xl font-semibold` |
| 区块标题 | `text-2xl`–`text-4xl font-semibold` |
| 正文 / 文章内容 | `prose prose-primary dark:prose-invert` |
| UI 标签 | `text-sm`, `text-xs` |
| 代码 | `font-mono`, Shiki 高亮代码块 |

优先使用语义化文本类（`text-highlighted`、`text-muted`），而不是直接使用 slate 颜色。

## 布局

### 容器

`--ui-container: 90rem` — 由 `UContainer` 使用。

### 页头

在大屏幕上的文档和营销布局中，`--ui-header-height: 112px`。

### 间距

Tailwind 默认的基于 4px 的间距刻度。常见节奏：

- `gap-2` / `p-2`（8px）— 在组内
- `gap-4` / `p-4`（16px）— 在相关项之间
- `py-10 sm:py-20` — 区块内边距
- `py-24 sm:py-32 lg:py-40` — 英雄区块

### 断点

Tailwind 默认值：`sm` 640px，`md` 768px，`lg` 1024px，`xl` 1280px，`2xl` 1536px。

## 圆角

Nuxt UI 从单个 `--ui-radius` 基础值（默认 `0.25rem`）派生出所有 `rounded-*` 工具类。可用项：`rounded-xs`、`rounded-sm`、`rounded-md`、`rounded-lg`、`rounded-xl`、`rounded-2xl`、`rounded-3xl`。

卡片和控件通常使用 `rounded-lg` 或 `rounded-md`。Hero 面板可以使用 `rounded-2xl`。

## 组件

使用 Nuxt UI 原语——不要重建已经存在的东西：

| 模式 | 组件 | 示例 |
|---------|-----------|---------|
| 主要操作 | `UButton` | `<UButton color="primary">Deploy</UButton>` |
| 次要操作 | `UButton` | `<UButton color="neutral" variant="subtle">Cancel</UButton>` |
| 第三层 / 链接 | `UButton` | `<UButton variant="ghost">Docs</UButton>` |
| 破坏性操作 | `UButton` | `<UButton color="error">Delete</UButton>` |
| 表单输入 | `UInput` | `<UInput placeholder="Search modules" />` |
| 页面布局 | `UPage`, `UPageHero`, `UPageBody` | Marketing and docs pages |
| 内容 | `ContentRenderer` + prose | Markdown/MDC content |
| 导航 | `UHeader`, `UNavigationMenu` | App header |

焦点环由 Nuxt UI 处理（`:focus-visible` 上的 `outline-primary/25`）。不要移除轮廓，除非有可见的替代方案。

## 动效

请谨慎使用动效。尊重 `prefers-reduced-motion`。Nuxt UI 组件为模态框、弹出层和菜单包含了合理的默认过渡效果。

## 语气与内容

- 标签、按钮、标题和选项卡使用标题式大小写；正文和辅助文本使用句首式大小写。
- 用动词和名词命名操作（`Deploy Project`、`Install Module`）。
- 错误信息要说明发生了什么以及下一步该怎么做。
- 提示消息要指出具体发生变化的对象——不加句号结尾，不使用“successfully”。
- 空状态要指向第一个操作。
- 进行中状态使用现在分词 + 省略号：`Deploying…`。

## 注意事项与禁忌

- 使用语义化颜色属性（`color="primary"`）和工具类（`text-muted`、`bg-elevated`）——不要在组件中直接使用原始十六进制颜色值。
- 在视图中的主行动按钮使用绿色的 `primary` 颜色。
- 按 `text-highlighted` > `text-default` > `text-muted` > `text-dimmed` 的优先级来安排文本层级。
- 保持符合 WCAG AA 对比度要求（正文文本为 4.5:1）。
- 不要仅靠颜色来传达状态；应搭配图标或标签一起使用。
- 不要在 UI 代码中硬编码 `#00DC82`——请使用 `text-primary` 或 `color="primary"`。
- 不要在没有山峰符号的情况下使用品牌文字标识——见 [/design-kit](/design-kit)。

## 资源

- 品牌素材（徽标、图标）：[/design-kit](/design-kit)
- Figma 品牌工具包：[Nuxt 品牌工具包](https://www.figma.com/community/file/1296154408275753939/nuxt-brand-kit)
- Nuxt UI 设计系统：[ui.nuxt.com/docs/getting-started/theme/design-system](https://ui.nuxt.com/docs/getting-started/theme/design-system)
- Nuxt UI CSS 变量：[ui.nuxt.com/docs/getting-started/theme/css-variables](https://ui.nuxt.com/docs/getting-started/theme/css-variables)
