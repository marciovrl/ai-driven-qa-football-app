import type { Team } from '../types/team'

interface TeamListProps {
  teams: Team[]
  onDeleteRequest: (team: Team) => void
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export function TeamList({ teams, onDeleteRequest }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <p data-testid="teams-empty" className="muted">
        No teams found.
      </p>
    )
  }

  return (
    <ul className="team-list" data-testid="teams-list">
      {teams.map((team) => (
        <li key={team.id} className="team-card" data-testid={`team-card-${team.id}`}>
          <div className="team-card-header">
            <h2>{team.name}</h2>
            <button
              type="button"
              className="icon-button"
              data-testid={`team-delete-button-${team.id}`}
              aria-label={`Delete ${team.name}`}
              onClick={() => onDeleteRequest(team)}
            >
              <TrashIcon />
            </button>
          </div>
          <p>
            <strong>Nickname:</strong> {team.nickname ?? '-'}
          </p>
          <p>
            <strong>Address:</strong> {team.address ?? '-'}
          </p>
        </li>
      ))}
    </ul>
  )
}
