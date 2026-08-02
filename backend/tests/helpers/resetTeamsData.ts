import fs from 'fs'
import path from 'path'

const basePath = path.resolve(__dirname, '../../data/teams.base.json')
const teamsPath = path.resolve(__dirname, '../../data/teams.json')

export function resetTeamsData() {
  fs.copyFileSync(basePath, teamsPath)
}
