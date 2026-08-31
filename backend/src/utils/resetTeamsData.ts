import fs from 'fs'
import path from 'path'

const basePath = path.resolve(__dirname, '../../data/teams.base.json')
const teamsPath = path.resolve(__dirname, '../../data/teams.json')

/** Rebuild mutable teams.json from the committed seed file. */
export function resetTeamsData() {
  fs.copyFileSync(basePath, teamsPath)
}
