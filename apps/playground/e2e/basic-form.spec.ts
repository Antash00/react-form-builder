import { expect, test } from '@playwright/test'

test('validates an empty field and submits typed text', async ({ page }) => {
    await page.goto('/basic')
    const basic = page.getByRole('region', { name: 'Basic form' })

    const name = basic.getByRole('textbox', { name: /Name/ })
    await expect(name).toHaveValue('')
    await basic.getByRole('button', { name: 'Submit' }).click()
    await expect(basic.getByText('Name is required')).toBeVisible()
    await expect(name).toBeFocused()

    await name.fill('Ada')
    await basic.getByRole('button', { name: 'Submit' }).click()
    const confirmation = basic.getByRole('checkbox', { name: /I confirm the details/ })
    await expect(basic.getByText('Confirmation is required')).toBeVisible()
    await expect(confirmation).toBeFocused()

    await confirmation.check()
    await basic.getByRole('button', { name: 'Submit' }).click()
    await expect(basic.getByText('Choose at least one role')).toBeVisible()
    const editor = basic.getByRole('checkbox', { name: 'Editor' })
    await expect(editor).toBeFocused()

    await editor.check()
    await basic.getByRole('button', { name: 'Submit' }).click()
    await expect(basic.getByText('Choose a primary role')).toBeVisible()

    await basic.getByRole('combobox', { name: 'Primary role' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()

    await basic.getByRole('combobox', { name: 'Additional roles' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()
    await page.getByRole('option', { name: 'Reviewer' }).click()
    await page.keyboard.press('Escape')
    await basic.getByRole('button', { name: 'Submit' }).click()
    await expect(basic.getByRole('status', { name: 'Submitted name' })).toHaveText('Ada')
    await expect(basic.getByRole('status', { name: 'Submitted roles' })).toHaveText('Editor')
    await expect(basic.getByRole('status', { name: 'Submitted primary role' })).toHaveText('Editor')
    await expect(basic.getByRole('status', { name: 'Submitted additional roles' })).toHaveText(
        'Editor, Reviewer',
    )
})
