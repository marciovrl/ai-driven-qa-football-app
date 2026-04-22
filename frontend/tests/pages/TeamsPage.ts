import type { Locator, Page } from '@playwright/test'

export class TeamsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  teamsPage(): Locator {
    return this.page.getByTestId('teams-page')
  }

  loadingMessage(): Locator {
    return this.page.getByTestId('teams-loading')
  }

  teamsList(): Locator {
    return this.page.getByTestId('teams-list')
  }

  teamCards(): Locator {
    return this.page.locator('[data-testid^="team-card-"]')
  }

  teamCardByName(name: string): Locator {
    return this.teamCards().filter({ hasText: name })
  }
}
