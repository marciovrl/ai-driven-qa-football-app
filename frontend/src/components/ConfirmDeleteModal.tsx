import type { Team } from '../types/team'

interface ConfirmDeleteModalProps {
  team: Team | null
  isDeleting: boolean
  error: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({
  team,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!team) {
    return null
  }

  return (
    <div className="modal-overlay" data-testid="confirm-delete-modal">
      <div className="modal-card">
        <h2>Delete team?</h2>
        <p className="muted">
          Are you sure you want to delete <strong>{team.name}</strong>? This action cannot be
          undone.
        </p>

        {error && (
          <p data-testid="team-delete-error" role="alert" className="error">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            data-testid="team-delete-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-button"
            data-testid="team-delete-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
