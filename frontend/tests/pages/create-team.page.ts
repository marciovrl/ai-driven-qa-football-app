import type { Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CreateTeamPage extends BasePage {
  modal(): Locator {
    return this.page.getByTestId('add-team-modal')
  }

  nameInput(): Locator {
    return this.page.getByTestId('team-name-input')
  }

  nicknameInput(): Locator {
    return this.page.getByTestId('team-nickname-input')
  }

  addressInput(): Locator {
    return this.page.getByTestId('team-address-input')
  }

  submitButton(): Locator {
    return this.page.getByTestId('team-submit-button')
  }

  successMessage(): Locator {
    return this.page.getByTestId('team-create-success')
  }

  errorMessage(): Locator {
    return this.page.getByTestId('team-create-error')
  }

  async fillForm(input: { name: string; nickname?: string; address?: string }) {
    await this.nameInput().fill(input.name)
    await this.nicknameInput().fill(input.nickname ?? '')
    await this.addressInput().fill(input.address ?? '')
  }

  async submit() {
    await this.submitButton().click()
  }
}
