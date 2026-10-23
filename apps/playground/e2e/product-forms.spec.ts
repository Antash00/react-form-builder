import { expect, test } from '@playwright/test'

test('employee onboarding validates a saved draft and submits domain selections', async ({
    page,
}) => {
    await page.goto('/employee-onboarding')
    const form = page.getByRole('region', { name: 'Employee onboarding' })
    const submit = form.getByRole('button', { name: 'Submit' })
    const firstName = form.getByRole('textbox', { name: 'First name' })

    await submit.click()
    await expect(form.getByText('Enter a first name')).toBeVisible()
    await expect(firstName).toBeFocused()

    await firstName.fill('A')
    await submit.click()
    await expect(form.getByText('Use at least 2 characters')).toBeVisible()
    await firstName.fill('Sam')

    const email = form.getByRole('textbox', { name: 'Work email' })
    await email.fill('invalid')
    await submit.click()
    await expect(form.getByText('Enter a valid email')).toBeVisible()
    await email.fill('sam.rivera@example.com')

    const salary = form.getByRole('spinbutton', { name: 'Annual salary' })
    await salary.fill('-1')
    await submit.click()
    await expect(form.getByText('Salary cannot be negative')).toBeVisible()
    await salary.fill('85000')

    await form.getByRole('combobox', { name: 'Department' }).click()
    await expect(page.getByRole('option')).toHaveCount(12)
    await page.keyboard.press('Escape')

    await form.getByRole('checkbox', { name: 'The onboarding details have been reviewed' }).check()
    await submit.click()
    const submitted = JSON.parse((await form.getByLabel('Submitted values').textContent()) ?? '')
    expect(submitted.firstName).toBe('Sam')
    expect(submitted.salary).toBe(85000)
    expect(submitted.department.name).toBe('Operations')
    expect(submitted.manager.name).toBe('Alex Morgan')
    expect(submitted.equipment).toHaveLength(2)
})

test('supplier onboarding handles a 30-field draft and long option lists', async ({ page }) => {
    await page.goto('/supplier-onboarding')
    const form = page.getByRole('region', { name: 'Supplier onboarding' })
    const submit = form.getByRole('button', { name: 'Submit' })
    const legalName = form.getByRole('textbox', { name: 'Legal business name' })

    await submit.click()
    await expect(form.getByText('Enter the legal business name')).toBeVisible()
    await legalName.fill('A')
    await submit.click()
    await expect(form.getByText('Use at least 2 characters')).toBeVisible()
    await legalName.fill('Acme Cloud Services')

    await form.getByRole('combobox', { name: 'Country' }).click()
    await expect(page.getByRole('option')).toHaveCount(15)
    await page.keyboard.press('Escape')

    const annualSpend = form.getByRole('spinbutton', { name: 'Estimated annual spend' })
    await annualSpend.fill('-10')
    await submit.click()
    await expect(form.getByText('Amount cannot be negative')).toBeVisible()
    await annualSpend.fill('125000')

    await form.getByRole('checkbox', { name: 'Compliance review completed' }).check()
    await submit.click()
    const submitted = JSON.parse((await form.getByLabel('Submitted values').textContent()) ?? '')
    expect(submitted.legalName).toBe('Acme Cloud Services')
    expect(submitted.currency.name).toBe('USD')
    expect(submitted.categories[0].name).toBe('Software')
    expect(submitted.annualSpend).toBe(125000)
})
