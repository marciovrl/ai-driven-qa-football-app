import type { Team } from '../types/team'

interface TeamListProps {
  teams: Team[]
}

export function TeamList({ teams }: TeamListProps) {
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
          <h2>{team.name}</h2>
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
