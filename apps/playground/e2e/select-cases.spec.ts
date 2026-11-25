import { expect, test } from '@playwright/test'

test('selects, clears, edits and validates saved selections', async ({ page }) => {
    await page.goto('/select-cases')
    const cases = page.getByRole('region', { name: 'Select cases' })
    const reviewer = cases.getByRole('combobox', { name: 'Reviewer' })
    const teams = cases.getByRole('combobox', { name: 'Teams' })
    const submit = cases.getByRole('button', { name: 'Submit', exact: true })

    const submitted = async () => JSON.parse(await cases.getByLabel('Submitted values').innerText())
    await expect(reviewer).toContainText('Operations')
    await expect(teams).toContainText('Design')
    await submit.click()
    expect((await submitted()).reviewer).toEqual({ id: 0, name: 'Operations' })
    expect((await submitted()).teams).toEqual([{ id: 1, name: 'Design' }])

    await reviewer.click()
    await page.getByRole('option', { name: 'No reviewer' }).click()
    await submit.click()
    expect((await submitted()).reviewer).toEqual(null)

    await teams.click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    expect((await submitted()).teams).toEqual([
        { id: 1, name: 'Design' },
        { id: 2, name: 'Engineering' },
    ])

    await teams.click()
    await page.getByRole('option', { name: 'Design' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    expect((await submitted()).teams).toEqual([{ id: 2, name: 'Engineering' }])

    await teams.click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    await expect(cases.locator('form').getByText('Choose at least one team')).toBeVisible()
    expect(JSON.parse(await cases.getByLabel('Validation errors').innerText()).teams.type).toBe(
        'required',
    )

    await cases.getByText('Last successful submission').click()
    expect(
        JSON.parse(await cases.getByLabel('Last submitted values', { exact: true }).innerText())
            .teams,
    ).toEqual([{ id: 2, name: 'Engineering' }])
    await teams.click()
    await page.getByRole('option', { name: 'Operations' }).click()
    await page.keyboard.press('Escape')
    await submit.click()
    expect((await submitted()).teams).toEqual([{ id: 0, name: 'Operations' }])
})
