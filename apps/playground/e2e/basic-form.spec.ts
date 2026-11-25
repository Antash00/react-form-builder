import { expect, test } from '@playwright/test'

test('validates an empty field and submits typed text', async ({ page }) => {
    await page.goto('/basic')
    const basic = page.getByRole('region', { name: 'Basic form' })

    const name = basic.getByRole('textbox', { name: /Name/ })
    await expect(name).toHaveValue('')
    await expect(basic.getByRole('button', { name: 'Reset' })).toHaveCount(0)
    await basic.getByRole('button', { name: 'Save form' }).click()
    await expect(basic.locator('form').getByText('Name is required')).toBeVisible()
    expect(JSON.parse(await basic.getByLabel('Validation errors').innerText()).name).toEqual({
        type: 'required',
        message: 'Name is required',
    })
    await expect(name).toBeFocused()

    await name.fill('Ada')
    await basic.getByRole('button', { name: 'Save form' }).click()
    const confirmation = basic.getByRole('checkbox', { name: /I confirm the details/ })
    await expect(basic.locator('form').getByText('Confirmation is required')).toBeVisible()
    await expect(confirmation).toBeFocused()

    await confirmation.check()
    await basic.getByRole('button', { name: 'Save form' }).click()
    await expect(basic.locator('form').getByText('Choose at least one role')).toBeVisible()
    const editor = basic.getByRole('checkbox', { name: 'Editor' })
    await expect(editor).toBeFocused()

    await editor.check()
    await basic.getByRole('button', { name: 'Save form' }).click()
    await expect(basic.locator('form').getByText('Choose a primary role')).toBeVisible()

    await basic.getByRole('combobox', { name: 'Primary role' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()

    await basic.getByRole('combobox', { name: 'Additional roles' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()
    await page.getByRole('option', { name: 'Reviewer' }).click()
    await page.keyboard.press('Escape')
    await basic.getByRole('button', { name: 'Save form' }).click()
    const values = JSON.parse(await basic.getByLabel('Submitted values').innerText())
    const editorRole = { id: 1, name: 'Editor' }
    expect(values).toEqual({
        name: 'Ada',
        confirmed: true,
        roles: [editorRole],
        primaryRole: editorRole,
        additionalRoles: [editorRole, { id: 2, name: 'Reviewer' }],
    })
    await basic.getByRole('button', { name: 'result', exact: true }).click()
    expect(JSON.parse(await basic.getByLabel('Field result').innerText()).primaryRole).toEqual({
        type: 'select',
        value: editorRole,
    })
})
