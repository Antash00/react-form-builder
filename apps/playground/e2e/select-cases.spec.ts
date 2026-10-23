import { expect, test } from '@playwright/test'

test('selects, clears, edits and validates saved selections', async ({ page }) => {
    await page.goto('/select-cases')
    const cases = page.getByRole('region', { name: 'Select cases' })
    const reviewer = cases.getByRole('combobox', { name: 'Reviewer' })
    const teams = cases.getByRole('combobox', { name: 'Teams' })
    const submit = cases.getByRole('button', { name: 'Submit' })

    await expect(reviewer).toContainText('Operations')
    await expect(teams).toContainText('Design')
    await submit.click()
    await expect(cases.getByRole('status', { name: 'Saved reviewer' })).toHaveText('Operations')
    await expect(cases.getByRole('status', { name: 'Saved teams' })).toHaveText('Design')

    await reviewer.click()
    await page.getByRole('option', { name: 'No reviewer' }).click()
    await submit.click()
    await expect(cases.getByRole('status', { name: 'Saved reviewer' })).toHaveText('None')

    await teams.click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    await expect(cases.getByRole('status', { name: 'Saved teams' })).toHaveText(
        'Design, Engineering',
    )

    await teams.click()
    await page.getByRole('option', { name: 'Design' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    await expect(cases.getByRole('status', { name: 'Saved teams' })).toHaveText('Engineering')

    await teams.click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    await expect(cases.getByText('Choose at least one team')).toBeVisible()
    await expect(cases.getByRole('status', { name: 'Saved teams' })).toHaveText('Engineering')

    await teams.click()
    await page.getByRole('option', { name: 'Operations' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    await expect(cases.getByRole('status', { name: 'Saved teams' })).toHaveText('Operations')
})
