import { useEffect, useRef, useState } from 'react'
import { AddTeamModal } from '../components/AddTeamModal'
import { TeamList } from '../components/TeamList'
import { createTeam, getTeams } from '../services/teamService'
import type { CreateTeamInput, Team } from '../types/team'

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const createInFlight = useRef(false)

  useEffect(() => {
    async function loadTeams() {
      try {
        setIsLoading(true)
        setError('')
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

  async function handleCreateTeam(input: CreateTeamInput) {
    if (createInFlight.current) {
      return
    }
    createInFlight.current = true
    try {
      setCreateError('')
      setSuccessMessage('')
      setIsCreating(true)

      const createdTeam = await createTeam(input)
      setTeams((previousTeams) => [...previousTeams, createdTeam])
      setSuccessMessage('Team added successfully.')
      setIsModalOpen(false)
    } catch (createTeamError) {
      const message =
        createTeamError instanceof Error ? createTeamError.message : 'Could not create team.'
      setCreateError(message)
    } finally {
      setIsCreating(false)
      createInFlight.current = false
    }
  }

  return (
    <main className="page" data-testid="teams-page">
      <header className="page-header">
        <h1>Football Teams</h1>
        <p className="muted">Simple list loaded from your API.</p>
        <button
          type="button"
          className="primary-button"
          data-testid="open-add-team-modal"
          onClick={() => {
            setSuccessMessage('')
            setCreateError('')
            setIsModalOpen(true)
          }}
        >
          Add Team
        </button>
      </header>

      {successMessage && (
        <p data-testid="team-create-success" className="success">
          {successMessage}
        </p>
      )}

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

      <AddTeamModal
        isOpen={isModalOpen}
        isSubmitting={isCreating}
        error={createError}
        onClose={() => {
          if (!isCreating) {
            setIsModalOpen(false)
            setCreateError('')
          }
        }}
        onSubmit={handleCreateTeam}
      />
    </main>
  )
}
