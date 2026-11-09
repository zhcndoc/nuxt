import { splitByCase, upperFirst } from 'scule'

const _numberFormatter = Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 })

// Normalize k/m/b to K/M/B to fix hydration mismatch between Node.js and browser ICU data
export const formatNumber = (value: number) => _numberFormatter.format(value).replace(/([kmb])$/i, match => match.toUpperCase())

// Case-insensitive RegExp, escaping special characters
// https://stackoverflow.com/a/38151393/3926832
export const searchTextRegExp = function (query = '') {
  return new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i')
}

export const formatDateByLocale = (locale: string, d: string | number | Date) => {
  return new Date(d).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// In UTC, so the server and the browser render the same day
export const formatShortDate = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString('zh-CN', { dateStyle: 'medium', timeZone: 'UTC' })
}

export const toRelativeDate = (date: string | number | Date) => {
  const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} 分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} 小时前`
  } else if (diff < 604800) {
    return `${Math.floor(diff / 86400)} 天前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 604800)} 周前`
  } else if (diff < 31536000) {
    return `${Math.floor(diff / 2592000)} 个月前`
  } else {
    return `${Math.floor(diff / 31536000)} 年前`
  }
}

export const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9 -]/g, ' ').trim().replace(/[\s-]+/g, '-')

export const random = (arr: Array<any>) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const createBreadcrumb = (link: string = '链接缺失') => {
  if (link.startsWith('http')) {
    return link
  }
  return link
    .split('/')
    .filter(Boolean)
    // Docs version folders (`4.x`, `3.x`) become "4 X" via splitByCase — skip them.
    .filter(part => !/^\d+\.x$/i.test(part))
    .map(part => splitByCase(part).map(p => upperFirst(p)).join(' '))
    .join(' > ')
    .replace('Api', 'API')
}
