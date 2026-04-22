import type { Team } from '../types/team'

const API_BASE_URL = 'http://localhost:3000'

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/teams`)

  if (!response.ok) {
    throw new Error('Failed to load teams.')
  }

  return (await response.json()) as Team[]
}
