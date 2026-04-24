import type { CreateTeamInput, Team } from '../types/team'

/** Same-origin paths; Vite `server.proxy` forwards /api to the backend in dev and Docker. */
const TEAMS_URL = '/api/v1/teams'

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(TEAMS_URL)

  if (!response.ok) {
    throw new Error('Failed to load teams.')
  }

  return (await response.json()) as Team[]
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await fetch(TEAMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const responseData = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(responseData?.message ?? 'Failed to create team.')
  }

  return (await response.json()) as Team
}
