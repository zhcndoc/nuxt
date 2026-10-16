---
title: 设计套件
head:
  title: Nuxt 设计套件
  description: 获取 Nuxt 资源，如 Logo、排版和颜色。
description: 欢迎来到 Nuxt 设计定义页面。我们通过精心挑选颜色和形状重新定义了品牌形象，以表达 Nuxt 产品的易用与愉悦。
navigation:
  icon: 'i-lucide-palette'
links:
  - label: '下载品牌资源'
    size: 'lg'
    to: '/nuxt-brand-assets.zip'
    icon: 'i-lucide-download'
    download: 'nuxt-brand-assets.zip'
    external: true
  - label: 'Nuxt 品牌套件'
    size: 'lg'
    to: 'https://www.figma.com/community/file/1296154408275753939/nuxt-brand-kit'
    icon: 'i-logos-figma'
    trailingIcon: 'i-lucide-arrow-up-right'
    color: 'neutral'
    variant: 'subtle'
    target: '_blank'
---

如需获取机器可读的设计令牌（颜色、排版、间距、组件），请参阅 [/design.md](/design.md){external}。

## 徽标历史 {#logo-history}

Nuxt 徽标随着时间的推移逐渐演变，但山形和文字标识一直是其设计的关键元素。

::div{class="hidden lg:block"}
![Nuxt 徽标时间线](/assets/design-kit/timeline-light.svg){class="dark:hidden w-full"}
![Nuxt 徽标时间线](/assets/design-kit/timeline-dark.svg){class="hidden dark:block w-full"}
::

::div{class="lg:hidden"}
![Nuxt 徽标时间线](/assets/design-kit/timeline-mobile-light.svg){class="dark:hidden w-full"}
![Nuxt 徽标时间线](/assets/design-kit/timeline-mobile-dark.svg){class="hidden dark:block w-full"}
::

## Nuxt 徽标 {#nuxt-logo}

徽标由两个元素组成：三角形的山和文字标识。在大多数情况下，它们应该一起出现，如相对的主锁定所示。三角形的山可以单独用作图标、头像或徽章，但文字标识绝不应在没有该符号的情况下使用。

### 图标 {#nuxt-logo-icon}

::u-page-grid
  :design-kit-image-card{path="icon-green" name="绿色"}
  :design-kit-image-card{path="icon-black" name="黑色" background="bg-white"}
  :design-kit-image-card{path="icon-white" name="白色" background="bg-neutral-950"}
::

### 徽标 {#nuxt-logo-logo}

::u-page-grid
  :design-kit-image-card{path="logo-green-white" name="绿色与白色" background="bg-neutral-950" full}
  :design-kit-image-card{path="logo-black" name="黑色" background="bg-white" full}
  :design-kit-image-card{path="logo-white" name="白色" background="bg-neutral-950" full}
  :design-kit-image-card{path="logo-green-black" name="绿色与黑色" background="bg-white" full}
::

## 调色板 {#color-palette}

我们的调色板以标志性的 Nuxt 绿色为基础，搭配纯中性色，让绿色承担所有强调作用。创建 Nuxt 宣传内容时，请使用所示的颜色值，确保您的设计符合品牌形象。

::u-page-grid
  :design-kit-color-card{background="#00DC82" name="绿色"}
  :design-kit-color-card{background="#FFFFFF" name="白色"}
  :design-kit-color-card{background="#0A0A0A" name="黑色"}
::

## 排版 {#typography}

标题使用 Outfit，这是一款几何无衬线字体，其圆润的形状呼应了 Nuxt 的山峰。正文和界面文本使用 Inter，专为各种尺寸屏幕上的清晰阅读而设计。

::u-page-grid
  :design-kit-font-card{name="Outfit" usage="各级标题，中等字重" font="font-heading" to="https://fonts.google.com/specimen/Outfit"}
  :design-kit-font-card{name="Inter" usage="正文和界面文本" font="font-sans" to="https://fonts.google.com/specimen/Inter"}
::
