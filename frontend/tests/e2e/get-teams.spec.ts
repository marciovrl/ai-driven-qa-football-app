import { expect, test } from '../test-fixtures'

test.describe('Get teams', () => {
  test.beforeEach(async ({ teamPage }) => {
    const teamsResponse = await teamPage.goto()
    expect(teamsResponse.ok()).toBeTruthy()
  })

  test(
    'should load page successfully',
    {
      tag: ['@smoke'],
    },
    async ({ teamPage }) => {
      await expect(teamPage.teamsPage()).toBeVisible()
    },
  )

  test(
    'should display list of items',
    {
      tag: ['@smoke'],
    },
    async ({ teamPage }) => {
      await expect(teamPage.loadingMessage()).not.toBeVisible()
      await expect(teamPage.teamsList()).toBeVisible()
      expect(await teamPage.teamCards().count()).toBeGreaterThan(0)
    },
  )

  test('should render correct data', async ({ teamPage }) => {
    await expect(teamPage.teamCardByName('Associação Portuguesa de Desportos')).toBeVisible()
  })
})
