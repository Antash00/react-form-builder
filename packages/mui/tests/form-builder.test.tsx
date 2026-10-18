import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

afterEach(cleanup)

test('submits initialized strings for untouched fields and partial edit defaults', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'name', type: 'text', properties: { label: 'Name' } },
        { accessor: 'notes', type: 'text', properties: { label: 'Notes' } },
    ])

    const form = render(
        <FormBuilder config={config} defaultValues={{ name: 'Ada' }} onSubmit={onSubmit} />,
    )
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada')
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { name: 'Ada', notes: '' },
        { name: { type: 'text', value: 'Ada' }, notes: { type: 'text', value: '' } },
    )

    form.unmount()
    onSubmit.mockClear()
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { name: '', notes: '' },
        { name: { type: 'text', value: '' }, notes: { type: 'text', value: '' } },
    )
})

test('connects validation, focus, required state and input identity to RHF', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'name',
            type: 'text',
            id: 'person-name',
            className: 'person-field',
            rules: { required: 'Name is required' },
            properties: { label: 'Name', helperText: 'Your full name' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox', { name: /Name/ })
    expect(input).toHaveAttribute('id', 'person-name')
    expect(input).toBeRequired()
    expect(input.closest('.person-field')).not.toBeNull()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText('Name is required')).toBeVisible()
    expect(input).toHaveFocus()

    await user.type(input, 'Ada')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' }, { name: { type: 'text', value: 'Ada' } })
    expect(screen.getByText('Your full name')).toBeVisible()
})

test('preserves string values for number and multiline text fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'amount', type: 'text', properties: { label: 'Amount', type: 'number' } },
        { accessor: 'notes', type: 'text', properties: { label: 'Notes', multiline: true } },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    await user.type(screen.getByRole('spinbutton', { name: 'Amount' }), '12.5')
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'First line')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { amount: '12.5', notes: 'First line' },
        { amount: { type: 'text', value: '12.5' }, notes: { type: 'text', value: 'First line' } },
    )
})

test('keeps safe MUI slot props and accessibility links', () => {
    const config = defineConfig([
        {
            accessor: 'name',
            type: 'text',
            id: 'person-name',
            properties: {
                label: 'Name',
                helperText: 'Your full name',
                variant: 'filled',
                slotProps: {
                    input: { disableUnderline: true, endAdornment: <span>suffix</span> },
                    htmlInput: (state) => ({
                        autoComplete: 'name',
                        maxLength: 60,
                        'data-required': state.required,
                    }),
                    inputLabel: { shrink: true },
                    root: { title: 'Name field' },
                },
            },
            rules: { required: true },
        },
    ])
    render(<FormBuilder config={config} onSubmit={() => {}} />)

    const input = screen.getByRole('textbox', { name: /Name/ })
    const helper = screen.getByText('Your full name')
    expect(input).toHaveAttribute('id', 'person-name')
    expect(input).toHaveAttribute('autocomplete', 'name')
    expect(input).toHaveAttribute('maxlength', '60')
    expect(input).toHaveAttribute('data-required', 'true')
    expect(input).toHaveAttribute('aria-describedby', helper.id)
    expect(screen.getByText('suffix')).toBeVisible()
    expect(input.closest('[title="Name field"]')).not.toBeNull()
})

test.each([
    [false, false],
    [true, true],
    ['Required', true],
    [{ value: true, message: 'Required' }, true],
    [{ value: false, message: 'Optional' }, false],
])('maps required rule %o to required UI state', (required, expected) => {
    const config = defineConfig([{ accessor: 'name', type: 'text', rules: { required } }])
    render(<FormBuilder config={config} onSubmit={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveProperty('required', expected)
})

test('rejects duplicate and nested accessors', () => {
    const duplicate = defineConfig([
        { accessor: 'name', type: 'text' },
        { accessor: 'name', type: 'text' },
    ])
    expect(() => render(<FormBuilder config={duplicate} onSubmit={() => {}} />)).toThrow(
        'Duplicate accessor "name"',
    )

    const nested = defineConfig([{ accessor: 'user.name', type: 'text' }])
    expect(() => render(<FormBuilder config={nested} onSubmit={() => {}} />)).toThrow(
        'Invalid accessor "user.name"',
    )
})
