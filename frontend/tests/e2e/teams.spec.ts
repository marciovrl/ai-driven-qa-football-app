import { expect, test } from '@playwright/test'
import { TeamsPage } from '../pages/TeamsPage'

const TEAMS_ENDPOINT = '**/api/v1/teams'

test.describe('Teams page', () => {
  test('should load page successfully', async ({ page }) => {
    const teamsPage = new TeamsPage(page)
    const teamsResponsePromise = page.waitForResponse(TEAMS_ENDPOINT)

    await teamsPage.goto()
    const teamsResponse = await teamsResponsePromise

    expect(teamsResponse.ok()).toBeTruthy()
    await expect(teamsPage.teamsPage()).toBeVisible()
  })

  test('should display list of items', async ({ page }) => {
    const teamsPage = new TeamsPage(page)
    const teamsResponsePromise = page.waitForResponse(TEAMS_ENDPOINT)

    await teamsPage.goto()
    await teamsResponsePromise

    await expect(teamsPage.loadingMessage()).not.toBeVisible()
    await expect(teamsPage.teamsList()).toBeVisible()
    expect(await teamsPage.teamCards().count()).toBeGreaterThan(0)
  })

  test('should render correct data', async ({ page }) => {
    const teamsPage = new TeamsPage(page)
    const teamsResponsePromise = page.waitForResponse(TEAMS_ENDPOINT)

    await teamsPage.goto()
    await teamsResponsePromise

    await expect(teamsPage.teamCardByName('Associação Portuguesa de Desportos')).toBeVisible()
  })

  test('should create a new team from modal', async ({ page }) => {
    const teamsPage = new TeamsPage(page)
    const teamsResponsePromise = page.waitForResponse(TEAMS_ENDPOINT)
    const teamName = 'Philips Sport Vereniging'

    await teamsPage.goto()
    await teamsResponsePromise
    await expect(teamsPage.loadingMessage()).not.toBeVisible()

    await teamsPage.openAddTeamModal()
    await expect(teamsPage.addTeamModal()).toBeVisible()
    await expect(teamsPage.teamSubmitButton()).toBeDisabled()

    await teamsPage.fillTeamForm({
      name: teamName,
      nickname: 'PSV',
      address: 'Eindhoven',
    })
    await expect(teamsPage.teamSubmitButton()).toBeEnabled()

    await teamsPage.submitTeamForm()

    await expect(teamsPage.teamCreateSuccessMessage()).toBeVisible()
    await expect(teamsPage.teamCardByName(teamName)).toBeVisible()
  })

  test('should keep add button disabled when team name is not provided', async ({ page }) => {
    const teamsPage = new TeamsPage(page)
    const teamsResponsePromise = page.waitForResponse(TEAMS_ENDPOINT)

    await teamsPage.goto()
    await teamsResponsePromise
    await expect(teamsPage.loadingMessage()).not.toBeVisible()

    await teamsPage.openAddTeamModal()
    await expect(teamsPage.addTeamModal()).toBeVisible()

    await expect(teamsPage.teamSubmitButton()).toBeDisabled()
    await teamsPage.fillTeamForm({
      name: '   ',
      nickname: 'No Name',
      address: 'No Name Address',
    })
    await expect(teamsPage.teamSubmitButton()).toBeDisabled()
  })
})
