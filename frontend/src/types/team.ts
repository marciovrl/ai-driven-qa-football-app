export interface Team {
  id: number
  name: string
  nickname: string | null
  address: string | null
}

export interface CreateTeamInput {
  name: string
  nickname: string | null
  address: string | null
}
