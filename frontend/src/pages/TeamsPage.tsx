import { useEffect, useState } from 'react'
import { TeamList } from '../components/TeamList'
import { getTeams } from '../services/teamService'
import type { Team } from '../types/team'

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeams() {
      try {
        setIsLoading(true)
        const data = await getTeams()
        setTeams(data)
      } catch {
        setError('Could not load teams.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTeams()
  }, [])

  return (
    <main className="page" data-testid="teams-page">
      <header className="page-header">
        <h1>Football Teams</h1>
        <p className="muted">Simple list loaded from your API.</p>
      </header>

      {isLoading && (
        <p data-testid="teams-loading" className="muted">
          Loading teams...
        </p>
      )}

      {!isLoading && error && (
        <p data-testid="teams-error" role="alert" className="error">
          {error}
        </p>
      )}

      {!isLoading && !error && <TeamList teams={teams} />}
    </main>
  )
}
