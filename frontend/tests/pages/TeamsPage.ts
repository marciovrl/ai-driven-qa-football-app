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

  openAddTeamModalButton(): Locator {
    return this.page.getByTestId('open-add-team-modal')
  }

  addTeamModal(): Locator {
    return this.page.getByTestId('add-team-modal')
  }

  teamNameInput(): Locator {
    return this.page.getByTestId('team-name-input')
  }

  teamNicknameInput(): Locator {
    return this.page.getByTestId('team-nickname-input')
  }

  teamAddressInput(): Locator {
    return this.page.getByTestId('team-address-input')
  }

  teamSubmitButton(): Locator {
    return this.page.getByTestId('team-submit-button')
  }

  teamCreateSuccessMessage(): Locator {
    return this.page.getByTestId('team-create-success')
  }

  async openAddTeamModal() {
    await this.openAddTeamModalButton().click()
  }

  async fillTeamForm(input: { name: string; nickname?: string; address?: string }) {
    await this.teamNameInput().fill(input.name)
    await this.teamNicknameInput().fill(input.nickname ?? '')
    await this.teamAddressInput().fill(input.address ?? '')
  }

  async submitTeamForm() {
    await this.teamSubmitButton().click()
  }
}
