import { expect, test } from '@playwright/test'

test('validates an empty field and submits typed text', async ({ page }) => {
    await page.goto('/')

    const name = page.getByRole('textbox', { name: /Name/ })
    await expect(name).toHaveValue('')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(name).toBeFocused()

    await name.fill('Ada')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('status', { name: 'Submitted name' })).toHaveText('Ada')
})
