import { useState, type FormEvent } from 'react'
import type { CreateTeamInput } from '../types/team'

interface AddTeamModalProps {
  isOpen: boolean
  isSubmitting: boolean
  error: string
  onClose: () => void
  onSubmit: (input: CreateTeamInput) => Promise<void>
}

export function AddTeamModal({
  isOpen,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddTeamModalProps) {
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [address, setAddress] = useState('')

  if (!isOpen) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanNickname = nickname.trim()
    const cleanAddress = address.trim()

    await onSubmit({
      name: cleanName,
      nickname: cleanNickname ? cleanNickname : null,
      address: cleanAddress ? cleanAddress : null,
    })

    setName('')
    setNickname('')
    setAddress('')
  }

  const isSubmitDisabled = isSubmitting || !name.trim()

  return (
    <div className="modal-overlay" data-testid="add-team-modal">
      <div className="modal-card">
        <h2>Add Team</h2>
        <form className="team-form" onSubmit={handleSubmit}>
          <label htmlFor="team-name">Name</label>
          <input
            id="team-name"
            data-testid="team-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Team name"
          />

          <label htmlFor="team-nickname">Nickname</label>
          <input
            id="team-nickname"
            data-testid="team-nickname-input"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Optional"
          />

          <label htmlFor="team-address">Address</label>
          <input
            id="team-address"
            data-testid="team-address-input"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Optional"
          />

          {error && (
            <p data-testid="team-create-error" role="alert" className="error">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" data-testid="team-submit-button" disabled={isSubmitDisabled}>
              {isSubmitting ? 'Adding...' : 'Add Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
