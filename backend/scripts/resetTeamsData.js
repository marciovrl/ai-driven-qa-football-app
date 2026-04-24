const fs = require('fs')
const path = require('path')

const basePath = path.resolve(__dirname, '../data/teams.base.json')
const targetPath = path.resolve(__dirname, '../data/teams.json')

const baseData = fs.readFileSync(basePath, 'utf-8')
fs.writeFileSync(targetPath, baseData, 'utf-8')

console.log('teams.json reset to base state.')
