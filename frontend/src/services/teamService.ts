import type { CreateTeamInput, Team } from '../types/team'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/teams`)

  if (!response.ok) {
    throw new Error('Failed to load teams.')
  }

  return (await response.json()) as Team[]
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await fetch(`${API_BASE_URL}/api/v1/teams`, {
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
