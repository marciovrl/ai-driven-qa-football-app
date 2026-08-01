import type { Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class TeamPage extends BasePage {
  async goto() {
    // Globs on full URLs (e.g. Vite + same-origin proxy) are brittle; assert pathname and GET.
    const teamsResponsePromise = this.page.waitForResponse((r) => {
      if (r.request().method() !== 'GET') return false
      try {
        return new URL(r.url()).pathname === '/api/v1/teams'
      } catch {
        return false
      }
    })

    await this.page.goto('/')
    return teamsResponsePromise
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
    return this.teamCards().filter({ hasText: name }).first()
  }

  openAddTeamModalButton(): Locator {
    return this.page.getByTestId('open-add-team-modal')
  }

  async openAddTeamModal() {
    await this.openAddTeamModalButton().click()
  }
}
