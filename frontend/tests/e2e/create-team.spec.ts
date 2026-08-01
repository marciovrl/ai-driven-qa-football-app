import { expect, test } from '../test-fixtures'

test.describe('Create team', () => {
  test.beforeEach(async ({ teamPage, createTeamPage }) => {
    await teamPage.goto()
    await expect(teamPage.loadingMessage()).not.toBeVisible()

    await teamPage.openAddTeamModal()
    await expect(createTeamPage.modal()).toBeVisible()
    await expect(createTeamPage.submitButton()).toBeDisabled()
  })

  test('should create a new team from modal', async ({ teamPage, createTeamPage }) => {
    const teamName = 'Philips Sport Vereniging'

    await createTeamPage.fillForm({
      name: teamName,
      nickname: 'PSV',
      address: 'Eindhoven',
    })
    await expect(createTeamPage.submitButton()).toBeEnabled()

    await createTeamPage.submit()

    await expect(createTeamPage.successMessage()).toBeVisible()
    await expect(teamPage.teamCardByName(teamName)).toBeVisible()
  })

  test('should keep add button disabled when team name is not provided', async ({
    createTeamPage,
  }) => {
    await createTeamPage.fillForm({
      name: '   ',
      nickname: 'No Name',
      address: 'No Name Address',
    })
    await expect(createTeamPage.submitButton()).toBeDisabled()
  })
})
