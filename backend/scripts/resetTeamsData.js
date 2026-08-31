const fs = require('fs')
const path = require('path')

const basePath = path.resolve(__dirname, '../data/teams.base.json')
const targetPath = path.resolve(__dirname, '../data/teams.json')

function resetTeamsData() {
  fs.copyFileSync(basePath, targetPath)
}

if (require.main === module) {
  resetTeamsData()
  console.log('teams.json reset to base state.')
}

module.exports = { resetTeamsData, basePath, targetPath }
