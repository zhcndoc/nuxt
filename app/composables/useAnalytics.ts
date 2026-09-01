// import { track } from '@vercel/analytics'

export function useAnalytics() {
  return {
    track: (
      _name: string,
      _properties?: Record<string, string | number | boolean | null | undefined>
    ) => {}
  }
}
