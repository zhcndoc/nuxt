import type { Sponsor } from '#shared/types'

export const useSponsors = async () => {
  const [{ data: apiSponsors }, { data: manualSponsors }] = await Promise.all([
    useFetch('/api/sponsors', {
      key: 'sponsors',
      transform: (sponsors) => {
        for (const tier in sponsors) {
          if (Array.isArray(sponsors[tier])) {
            sponsors[tier].forEach((sponsor) => {
              if (sponsor.sponsorLogo.includes('github')) {
                sponsor.sponsorLogo = `https://markhub.top/github/${sponsor.sponsorId}`
              } else if (sponsor.sponsorLogo.includes('opencollective')) {
                sponsor.sponsorLogo = `https://markhub.top/opencollective/${sponsor.sponsorId}`
              }
            })
          }
        }
        return sponsors
      }
    }),
    useAsyncData('manual-sponsors', () => queryCollection('manualSponsors').first())
  ])

  const sponsors = computed(() => {
    const manual = manualSponsors.value?.sponsors || []

    const result: Record<string, Sponsor[]> = {}

    for (const [tier, sponsorsList] of Object.entries(apiSponsors.value || {})) {
      result[tier] = [...sponsorsList]
    }

    for (const manualSponsor of manual) {
      const tier = manualSponsor.tier || 'backers'
      if (!result[tier]) {
        result[tier] = []
      }
      result[tier].push(manualSponsor as Sponsor)
    }

    return result
  })

  const getFilteredSponsors = (tiers: string[]) => {
    return computed(() => {
      return Object.entries(sponsors.value)
        .filter(([tier]) => tiers.includes(tier))
        .map(([tier, sponsors]) => ({
          tier,
          sponsors: sponsors.map(s => ({
            sponsorName: s.sponsorName,
            sponsorLogo: s.sponsorLogo,
            sponsorUrl: s.sponsorUrl
          }))
        }))
    })
  }

  return {
    sponsors,
    getFilteredSponsors
  }
}
