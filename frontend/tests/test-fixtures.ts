import { test as base, expect } from '@playwright/test'
import { CreateTeamPage } from './pages/create-team.page'
import { TeamPage } from './pages/team.page'

type FrameworkFixtures = {
  teamPage: TeamPage
  createTeamPage: CreateTeamPage
}

export const test = base.extend<FrameworkFixtures>({
  teamPage: async ({ page }, use) => {
    await use(new TeamPage(page))
  },
  createTeamPage: async ({ page }, use) => {
    await use(new CreateTeamPage(page))
  },
})

export { expect }
