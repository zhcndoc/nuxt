import type { H3Event } from 'h3'
import { readGlobalConfig } from '../../layers/nuxi/agent/lib/global-config'

interface TeamMemberSearchResponse {
  data?: { organization?: { team?: { members: { nodes: { login: string }[] } } } }
  errors?: Array<{ message: string }>
}

// Queries membership through AnyMeta without adding an application cache.
export async function isCoreTeamMember(event: H3Event, login: string): Promise<boolean> {
  // if (!useRuntimeConfig(event).github.token) {
  //   throw createError({ statusCode: 500, statusMessage: 'Missing NUXT_GITHUB_TOKEN env variable' })
  // }

  const response = await $fetch<TeamMemberSearchResponse>('https://anymeta.top/github/graphql', {
    method: 'POST',
    headers: githubHeaders(event),
    body: {
      query: `query($login: String!) {
        organization(login: "nuxt") { team(slug: "core") { members(query: $login, first: 10) { nodes { login } } } }
      }`,
      variables: { login }
    }
  })

  const members = response.data?.organization?.team?.members.nodes
  if (response.errors?.length || !members) {
    // throw createError({ statusCode: 500, statusMessage: 'Failed to fetch core team members.' })
    throw createError({ statusCode: 502, statusMessage: 'Core team membership is unavailable from AnyMeta.' })
  }
  return members.some(member => member.login.toLowerCase() === login)
}

function parseGithubLogins(raw: unknown): string[] {
  const values = Array.isArray(raw)
    ? raw.map(value => String(value))
    : typeof raw === 'string'
      ? raw.split(',')
      : []
  return [...new Set(values.map(value => value.trim().toLowerCase()).filter(Boolean))]
}

/** Extra admin logins: `NUXT_ADMIN_GITHUB_LOGINS` (local/preview) union Global Config `admin.githubLogins`. Env ignored in production. */
async function getExtraAdminLogins(): Promise<string[]> {
  const fromEnv = process.env.VERCEL_ENV === 'production'
    ? []
    : parseGithubLogins(process.env.NUXT_ADMIN_GITHUB_LOGINS)
  const config = await readGlobalConfig<{ admin?: { githubLogins?: string[] } }>(['admin'])
  return [...new Set([...fromEnv, ...parseGithubLogins(config.admin?.githubLogins)])]
}

export async function isAuthorizedAdmin(event: H3Event, login: string): Promise<boolean> {
  const normalized = login.toLowerCase()
  const extraLogins = await getExtraAdminLogins()
  if (extraLogins.includes(normalized)) {
    return true
  }
  return isCoreTeamMember(event, normalized)
}
