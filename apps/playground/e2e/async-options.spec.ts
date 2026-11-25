import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    const start = new Date('2026-01-01T00:00:00Z')
    await page.clock.install({ time: start })
    await page.clock.pauseAt(new Date(start.getTime() + 1000))
    await page.goto('/async-options')
})

test('creates a project with options loaded after mounting without losing the project name', async ({
    page,
}) => {
    const demo = page.getByRole('region', { name: 'Async Options' })
    const catalog = demo.getByRole('status', { name: 'Team catalog' })
    const name = demo.getByRole('textbox', { name: 'Project name' })
    const submit = demo.getByRole('button', { name: 'Submit' })

    await expect(catalog).toHaveText('Loading teams…')
    await expect(submit).toBeDisabled()
    await name.fill('New project')
    await page.clock.resume()
    await expect(catalog).toHaveText('Teams loaded.')
    await expect(name).toHaveValue('New project')

    await expect(submit).toBeEnabled()

    await submit.click()
    const errors = demo.getByLabel('Validation errors')
    expect(Object.keys(JSON.parse(await errors.innerText()))).toEqual([
        'owner',
        'contributors',
        'reviewer',
    ])

    await demo.getByRole('combobox', { name: 'Owning team' }).click()
    await page.getByRole('option', { name: 'Design' }).click()
    await demo.getByRole('combobox', { name: 'Contributing teams' }).click()
    await page.getByRole('option', { name: 'Engineering' }).click()
    await page.getByRole('option', { name: 'Operations' }).click()
    await page.keyboard.press('Escape')
    await demo.getByRole('combobox', { name: 'Reviewing team' }).fill('Oper')
    await page.getByRole('option', { name: 'Operations' }).click()
    await submit.click()

    await expect(demo.getByLabel('Submitted values')).toHaveText(
        JSON.stringify(
            {
                name: 'New project',
                owner: { id: 'design', name: 'Design' },
                contributors: [
                    { id: 'engineering', name: 'Engineering' },
                    { id: 'operations', name: 'Operations' },
                ],
                reviewer: { id: 'operations', name: 'Operations' },
            },
            null,
            2,
        ),
    )
})

test('loads teams before showing the saved project', async ({ page }) => {
    const demo = page.getByRole('region', { name: 'Async Options' })
    const catalog = demo.getByRole('status', { name: 'Team catalog' })
    const name = demo.getByRole('textbox', { name: 'Project name' })
    const owner = demo.getByRole('combobox', { name: 'Owning team' })
    const submit = demo.getByRole('button', { name: 'Submit' })

    await demo.getByRole('button', { name: 'Edit saved project' }).click()
    await expect(catalog).toHaveText('Loading teams…')
    await expect(name).toHaveCount(0)
    await page.clock.resume()

    await expect(name).toHaveValue('Website refresh')
    await expect(owner).toHaveText('Design')
    await expect(demo.getByRole('combobox', { name: 'Contributing teams' })).toHaveText(
        'Engineering',
    )
    await expect(demo.getByRole('combobox', { name: 'Reviewing team' })).toHaveValue('Operations')

    await name.fill('Updated website')
    await submit.click()
    await expect(demo.getByLabel('Submitted values')).toHaveText(
        JSON.stringify(
            {
                name: 'Updated website',
                owner: { id: 'design', name: 'Design' },
                contributors: [{ id: 'engineering', name: 'Engineering' }],
                reviewer: { id: 'operations', name: 'Operations' },
            },
            null,
            2,
        ),
    )
    await demo.getByRole('button', { name: 'Reset' }).click()
    await expect(name).toHaveValue('Website refresh')
})
