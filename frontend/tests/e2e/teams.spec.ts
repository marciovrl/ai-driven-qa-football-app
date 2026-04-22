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

    await teamsPage.goto()

    await expect(teamsPage.loadingMessage()).not.toBeVisible()
    await expect(teamsPage.teamsList()).toBeVisible()
    await expect(teamsPage.teamCards()).toHaveCount(1)
  })

  test('should render correct data', async ({ page }) => {
    const teamsPage = new TeamsPage(page)

    await teamsPage.goto()

    await expect(teamsPage.teamCardByName('Associação Portuguesa de Desportos')).toBeVisible()
  })
})
