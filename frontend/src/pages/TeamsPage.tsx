import { useEffect, useRef, useState } from 'react'
import { AddTeamModal } from '../components/AddTeamModal'
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal'
import { TeamList } from '../components/TeamList'
import { createTeam, deleteTeam, getTeams } from '../services/teamService'
import type { CreateTeamInput, Team } from '../types/team'

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const createInFlight = useRef(false)
  const deleteInFlight = useRef(false)

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

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timer = window.setTimeout(() => {
      setToastMessage('')
    }, 3000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toastMessage])

  async function handleCreateTeam(input: CreateTeamInput) {
    if (createInFlight.current) {
      return
    }
    createInFlight.current = true
    try {
      setCreateError('')
      setIsCreating(true)

      const createdTeam = await createTeam(input)
      setTeams((previousTeams) => [...previousTeams, createdTeam])
      setIsModalOpen(false)
      setToastMessage('Team added successfully.')
    } catch (createTeamError) {
      const message =
        createTeamError instanceof Error ? createTeamError.message : 'Could not create team.'
      setCreateError(message)
    } finally {
      setIsCreating(false)
      createInFlight.current = false
    }
  }

  async function handleConfirmDelete() {
    if (!teamToDelete || deleteInFlight.current) {
      return
    }
    deleteInFlight.current = true

    try {
      setDeleteError('')
      setIsDeleting(true)
      await deleteTeam(teamToDelete.id)
      setTeams((previousTeams) =>
        previousTeams.filter((team) => team.id !== teamToDelete.id),
      )
      setTeamToDelete(null)
      setToastMessage('Team deleted successfully.')
    } catch (deleteTeamError) {
      const message =
        deleteTeamError instanceof Error ? deleteTeamError.message : 'Could not delete team.'
      setDeleteError(message)
    } finally {
      setIsDeleting(false)
      deleteInFlight.current = false
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
            setCreateError('')
            setIsModalOpen(true)
          }}
        >
          Add Team
        </button>
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

      {!isLoading && !error && (
        <TeamList
          teams={teams}
          onDeleteRequest={(team) => {
            setDeleteError('')
            setTeamToDelete(team)
          }}
        />
      )}

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

      <ConfirmDeleteModal
        team={teamToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => {
          if (!isDeleting) {
            setTeamToDelete(null)
            setDeleteError('')
          }
        }}
        onConfirm={() => {
          void handleConfirmDelete()
        }}
      />

      {toastMessage && (
        <div className="toast toast-success" data-testid="success-toast" role="status">
          {toastMessage}
        </div>
      )}
    </main>
  )
}
