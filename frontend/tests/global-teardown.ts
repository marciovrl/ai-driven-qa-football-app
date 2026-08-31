import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const testsDir = path.dirname(fileURLToPath(import.meta.url))

export default async function globalTeardown() {
  execSync('npm run reset:data', {
    cwd: path.resolve(testsDir, '../../backend'),
    stdio: 'inherit',
  })
}
