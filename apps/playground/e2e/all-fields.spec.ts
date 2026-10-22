import { expect, test } from '@playwright/test'

test('grouped fields use one column on mobile and two columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto('/all-fields')

    const firstGroup = page.locator('.MuiGrid-container').first()
    const secondGroup = page.locator('.MuiGrid-container').nth(1)
    const remainingFields = page.locator('.MuiGrid-container').nth(2)
    const first = firstGroup.locator(':scope > .MuiGrid-root').first()
    const second = firstGroup.locator(':scope > .MuiGrid-root').nth(1)
    const mobileFirst = await first.boundingBox()
    const mobileSecond = await second.boundingBox()
    expect(mobileFirst).not.toBeNull()
    expect(mobileSecond).not.toBeNull()
    expect(mobileSecond!.y).toBeGreaterThan(mobileFirst!.y)

    await page.setViewportSize({ width: 1280, height: 800 })
    const desktopFirst = await first.boundingBox()
    const desktopSecond = await second.boundingBox()
    expect(desktopFirst).not.toBeNull()
    expect(desktopSecond).not.toBeNull()
    expect(Math.abs(desktopSecond!.y - desktopFirst!.y)).toBeLessThan(2)
    expect(desktopSecond!.x).toBeGreaterThan(desktopFirst!.x)

    const firstGroupBox = await firstGroup.boundingBox()
    const secondGroupBox = await secondGroup.boundingBox()
    const remainingFieldsBox = await remainingFields.boundingBox()
    expect(firstGroupBox).not.toBeNull()
    expect(secondGroupBox).not.toBeNull()
    expect(remainingFieldsBox).not.toBeNull()
    expect(secondGroupBox!.y - (firstGroupBox!.y + firstGroupBox!.height)).toBeGreaterThan(0)
    expect(remainingFieldsBox!.y - (secondGroupBox!.y + secondGroupBox!.height)).toBeGreaterThan(0)

    const primarySelect = page.getByRole('combobox', { name: 'Primary role (single select)' })
    const additionalSelect = page.getByRole('combobox', {
        name: 'Additional roles (multiple select)',
    })
    const primaryBox = await primarySelect.boundingBox()
    const additionalBox = await additionalSelect.boundingBox()
    expect(primaryBox).not.toBeNull()
    expect(additionalBox).not.toBeNull()
    expect(additionalBox!.y - (primaryBox!.y + primaryBox!.height)).toBeGreaterThanOrEqual(8)

    const submitBox = await page.getByRole('button', { name: 'Submit' }).boundingBox()
    const resetBox = await page.getByRole('button', { name: 'Reset' }).boundingBox()
    expect(submitBox).not.toBeNull()
    expect(resetBox).not.toBeNull()
    expect(Math.abs(resetBox!.y - submitBox!.y)).toBeLessThan(2)
    expect(resetBox!.x).toBeGreaterThan(submitBox!.x + submitBox!.width)
})

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
        budget: 0,
        notes: 'Existing note',
        confirmed: true,
        roles: ['Publisher'],
        primaryRole: 'Editor',
        additionalRoles: ['Reviewer', 'Editor'],
    })
})
