import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('home preview submits the edited config-backed values', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Workspace name').fill('Platform')
    await page.getByLabel('Private workspace').uncheck()
    await page.getByRole('button', { name: 'Save workspace' }).click()
    expect(JSON.parse(await page.getByRole('status').innerText())).toEqual({
        name: 'Platform',
        private: false,
    })
})

test('source inspector exposes helper files and preserves the form draft', async ({ page }) => {
    await page.goto('/supplier-onboarding')
    const name = page.getByRole('textbox', { name: 'Legal business name' })
    await name.fill('Studio')
    const file = page.getByLabel('Source file')
    await file.selectOption({ label: 'defaultValues.ts' })
    await expect(page.locator('.code-panel pre code')).toContainText(
        'export const supplierOnboardingDefaults',
    )
    await file.selectOption({ label: 'catalog.ts' })
    const expand = page.getByRole('button', { name: 'Expand' })
    await expand.click()
    const dialog = page.getByRole('dialog', { name: 'Expanded source code' })
    await expect(dialog.locator('pre code')).toContainText(
        "{ id: 'Engineering', name: 'Engineering' }",
    )
    await dialog.getByLabel('Source file').selectOption({ label: 'useFormOutput.ts' })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(expand).toBeFocused()
    await expect(page.locator('.code-panel pre code')).toContainText('function useFormOutput')
    await expect(name).toHaveValue('Studio')
})

test('examples display their current source files', async ({ page }) => {
    const routes = [
        ['/basic', 'BasicForm'],
        ['/all-fields', 'AllFieldsForm'],
        ['/select-cases', 'SelectCasesForm'],
        ['/async-options', 'AsyncOptionsForm'],
        ['/employee-onboarding', 'EmployeeOnboardingForm'],
        ['/supplier-onboarding', 'SupplierOnboardingForm'],
    ]
    for (const [route, form] of routes) {
        await page.goto(route)
        const select = page.getByLabel('Source file')
        await expect(select.locator('option:checked')).toHaveText(form + '.tsx')
        const files = ['examples/' + form + '.tsx', 'variables/catalog.ts', 'useFormOutput.ts']
        if (form !== 'BasicForm') files.push('variables/defaultValues.ts')
        for (const file of files) {
            await select.selectOption({ label: file.split('/').pop() })
            const expected = await readFile('src/' + file, 'utf8')
            expect(await page.locator('.code-panel pre code').textContent()).toBe(
                expected.replaceAll('\r\n', '\n').trimEnd(),
            )
        }
    }
})
