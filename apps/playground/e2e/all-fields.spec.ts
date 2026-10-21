import { expect, test } from '@playwright/test'

test('all-fields page exercises every supported field type', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'All fields' }).click()
    await expect(page).toHaveURL(/\/all-fields$/)

    const allFields = page.getByRole('region', { name: 'All fields' })
    const submit = allFields.getByRole('button', { name: 'Submit' })
    const name = allFields.getByRole('textbox', { name: 'Name' })
    const email = allFields.getByRole('textbox', { name: 'Email' })

    await expect(allFields.getByRole('spinbutton', { name: 'Budget' })).toHaveValue('0')
    await expect(allFields.getByRole('textbox', { name: 'Notes' })).toHaveValue('Existing note')
    await expect(
        allFields.getByRole('combobox', { name: 'Additional roles (multiple select)' }),
    ).toContainText('Reviewer')

    await submit.click()
    await expect(allFields.getByText('Enter a name')).toBeVisible()
    await expect(name).toBeFocused()
    await name.fill('A')
    await submit.click()
    await expect(allFields.getByText('Use at least 2 characters')).toBeVisible()

    await name.fill('Ada')
    await email.fill('invalid')
    await submit.click()
    await expect(allFields.getByText('Enter a valid email')).toBeVisible()
    await email.fill('ada@example.com')

    await submit.click()
    await expect(allFields.getByText('Confirm the details', { exact: true })).toBeVisible()
    await allFields.getByRole('checkbox', { name: 'I confirm the details' }).check()
    await submit.click()
    await expect(allFields.getByText('Choose a role')).toBeVisible()
    await allFields.getByRole('checkbox', { name: 'Publisher' }).check()

    await submit.click()
    await expect(allFields.getByText('Choose a primary role')).toBeVisible()
    await allFields.getByRole('combobox', { name: 'Primary role (single select)' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()

    await allFields.getByRole('combobox', { name: 'Additional roles (multiple select)' }).click()
    await page.getByRole('option', { name: 'Editor' }).click()
    await page.keyboard.press('Escape')
    await submit.click()

    const submitted = JSON.parse(
        (await allFields.getByLabel('Submitted values').textContent()) ?? '',
    )
    expect(submitted).toEqual({
        name: 'Ada',
        email: 'ada@example.com',
        budget: '0',
        notes: 'Existing note',
        confirmed: true,
        roles: ['Publisher'],
        primaryRole: 'Editor',
        additionalRoles: ['Reviewer', 'Editor'],
    })
})
