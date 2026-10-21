import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

afterEach(cleanup)

test('text fields inherit MUI theme defaults and keep explicit field props', async () => {
    const user = userEvent.setup()
    const theme = createTheme({
        components: {
            MuiTextField: {
                defaultProps: { color: 'secondary', variant: 'filled', helperText: 'Theme hint' },
            },
        },
    })
    const config = defineConfig([
        {
            accessor: 'name',
            type: 'text',
            properties: { label: 'Name' },
            rules: { required: 'Name is required' },
        },
        {
            accessor: 'title',
            type: 'text',
            properties: { label: 'Title', color: 'success', variant: 'outlined' },
        },
    ])

    render(
        <ThemeProvider theme={theme}>
            <FormBuilder config={config} onSubmit={vi.fn()} />
        </ThemeProvider>,
    )

    const name = screen.getByRole('textbox', { name: 'Name' })
    const title = screen.getByRole('textbox', { name: 'Title' })
    expect(name.closest('.MuiTextField-root')?.querySelector('.MuiInputLabel-root')).toHaveClass(
        'MuiFormLabel-colorSecondary',
    )
    expect(name.closest('.MuiTextField-root')?.querySelector('.MuiFilledInput-root')).not.toBeNull()
    expect(title.closest('.MuiTextField-root')?.querySelector('.MuiInputLabel-root')).toHaveClass(
        'MuiFormLabel-colorSuccess',
    )
    expect(
        title.closest('.MuiTextField-root')?.querySelector('.MuiOutlinedInput-root'),
    ).not.toBeNull()
    expect(screen.getAllByText('Theme hint')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Name is required')).toBeVisible()
    expect(screen.getByText('Theme hint')).toBeVisible()
})

test('checkboxes use the parent MUI theme color unless config or validation overrides it', async () => {
    const user = userEvent.setup()
    const theme = createTheme({
        components: { MuiCheckbox: { defaultProps: { color: 'secondary' } } },
    })
    const config = defineConfig([
        {
            accessor: 'consent',
            type: 'checkbox',
            properties: { label: 'Consent' },
            rules: { required: 'Consent is required' },
        },
        {
            accessor: 'featured',
            type: 'checkbox',
            properties: { label: 'Featured', color: 'success' },
        },
        {
            accessor: 'roles',
            type: 'checkboxGroup',
            properties: {
                label: 'Roles',
                items: ['Editor'],
                getItemLabel: (item: string) => item,
                getItemKey: (item: string) => item,
            },
        },
    ])

    render(
        <ThemeProvider theme={theme}>
            <FormBuilder config={config} onSubmit={vi.fn()} />
        </ThemeProvider>,
    )

    const consent = screen.getByRole('checkbox', { name: 'Consent' })
    const featured = screen.getByRole('checkbox', { name: 'Featured' })
    const editor = screen.getByRole('checkbox', { name: 'Editor' })
    expect(consent.closest('.MuiCheckbox-root')).toHaveClass('MuiCheckbox-colorSecondary')
    expect(featured.closest('.MuiCheckbox-root')).toHaveClass('MuiCheckbox-colorSuccess')
    expect(editor.closest('.MuiCheckbox-root')).toHaveClass('MuiCheckbox-colorSecondary')

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Consent is required')).toBeVisible()
    expect(consent.closest('.MuiCheckbox-root')).toHaveClass('MuiCheckbox-colorError')
})

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

test('initializes checkbox values as booleans and applies partial edit defaults', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'name', type: 'text', properties: { label: 'Name' } },
        {
            accessor: 'active',
            type: 'checkbox',
            properties: {
                slotProps: {
                    input: (state) => ({ 'aria-label': state.disabled ? 'Disabled' : 'Active' }),
                },
            },
        },
        {
            accessor: 'archived',
            type: 'checkbox',
            properties: { slotProps: { input: { 'aria-label': 'Archived' } } },
        },
    ])

    render(<FormBuilder config={config} defaultValues={{ active: true }} onSubmit={onSubmit} />)

    const active = screen.getByRole('checkbox', { name: 'Active' })
    const archived = screen.getByRole('checkbox', { name: 'Archived' })
    expect(active).toBeChecked()
    expect(archived).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { name: '', active: true, archived: false },
        {
            name: { type: 'text', value: '' },
            active: { type: 'checkbox', value: true },
            archived: { type: 'checkbox', value: false },
        },
    )

    await user.click(archived)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { name: '', active: true, archived: true },
        {
            name: { type: 'text', value: '' },
            active: { type: 'checkbox', value: true },
            archived: { type: 'checkbox', value: true },
        },
    )
})

test('shows checkbox label and validation message, then restores helper text', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'consent',
            type: 'checkbox',
            id: 'consent',
            className: 'consent-field',
            properties: {
                label: 'Agree to terms',
                helperText: 'Read the terms before agreeing',
                slotProps: { input: { 'aria-describedby': 'external-help' } },
            },
            rules: { required: 'Agreement is required' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)

    const checkbox = screen.getByRole('checkbox', { name: /Agree to terms/ })
    const helper = screen.getByText('Read the terms before agreeing')
    expect(checkbox).toHaveAttribute('id', 'consent')
    expect(checkbox).toBeRequired()
    expect(checkbox.closest('.consent-field')).not.toBeNull()
    expect(checkbox).toHaveAttribute('aria-describedby', `external-help ${helper.id}`)

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    const error = await screen.findByText('Agreement is required')
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveAttribute('aria-describedby', `external-help ${error.id}`)
    expect(checkbox).toHaveFocus()

    await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { consent: true },
        { consent: { type: 'checkbox', value: true } },
    )
    expect(screen.getByText('Read the terms before agreeing')).toBeVisible()
})

test('checkbox group preserves selected objects and matches defaults by key', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 1, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'checkboxGroup',
            id: 'role-options',
            className: 'role-field',
            properties: {
                label: 'Roles',
                helperText: 'Choose your roles',
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id,
            },
        },
    ])
    render(
        <FormBuilder
            config={config}
            defaultValues={{ roles: [{ id: 1, name: 'Editor' }] }}
            onSubmit={onSubmit}
        />,
    )

    const editor = screen.getByRole('checkbox', { name: 'Editor' })
    const reviewer = screen.getByRole('checkbox', { name: 'Reviewer' })
    const helper = screen.getByText('Choose your roles')
    expect(screen.getByRole('group', { name: 'Roles' })).toHaveAttribute(
        'aria-labelledby',
        'role-options',
    )
    expect(editor.closest('.role-field')).not.toBeNull()
    expect(editor).toBeChecked()
    expect(reviewer).not.toBeChecked()
    expect(editor).toHaveAttribute('aria-describedby', helper.id)

    await user.click(editor)
    await user.click(reviewer)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { roles: [roles[1]] },
        { roles: { type: 'checkboxGroup', value: [roles[1]] } },
    )
})

test('checkbox group validates an empty selection and focuses its first input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'checkboxGroup',
            properties: {
                label: 'Roles',
                helperText: 'Choose your roles',
                items: [{ id: 1, name: 'Editor' }],
                getItemLabel: (item: { id: number; name: string }) => item.name,
                getItemKey: (item: { id: number; name: string }) => item.id,
            },
            rules: { required: 'Choose a role' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)

    const editor = screen.getByRole('checkbox', { name: 'Editor' })
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    const error = await screen.findByText('Choose a role')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(editor).toHaveFocus()
    expect(editor).toHaveAttribute('aria-invalid', 'true')
    expect(editor).toHaveAttribute('aria-describedby', error.id)

    await user.click(editor)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { roles: [{ id: 1, name: 'Editor' }] },
        { roles: { type: 'checkboxGroup', value: [{ id: 1, name: 'Editor' }] } },
    )
    expect(screen.getByText('Choose your roles')).toBeVisible()
})

test('disabled checkbox group skips required validation and preserves its value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'checkboxGroup',
            properties: {
                label: 'Roles',
                disabled: true,
                items: [{ id: 1, name: 'Editor' }],
                getItemLabel: (item: { id: number; name: string }) => item.name,
                getItemKey: (item: { id: number; name: string }) => item.id,
            },
            rules: { required: 'Choose a role' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    expect(screen.getByRole('checkbox', { name: 'Editor' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { roles: [] },
        { roles: { type: 'checkboxGroup', value: [] } },
    )
    expect(screen.queryByText('Choose a role')).not.toBeInTheDocument()
})

test('select preserves a chosen object and matches an edit default by key', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 0, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const defaultRole = { id: 0, name: 'Editor' }
    const config = defineConfig([
        {
            accessor: 'primaryRole',
            type: 'select',
            id: 'primary-role',
            properties: {
                label: 'Primary role',
                helperText: 'Choose your main role',
                'aria-describedby': 'external-help',
                variant: 'filled',
                fullWidth: true,
                emptyLabel: 'None',
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id,
            },
        },
    ])
    render(
        <FormBuilder
            config={config}
            defaultValues={{ primaryRole: defaultRole }}
            onSubmit={onSubmit}
        />,
    )

    const select = screen.getByRole('combobox', { name: 'Primary role' })
    expect(select).toHaveTextContent('Editor')
    expect(select).toHaveAttribute('id', 'primary-role')
    expect(screen.getByText('Primary role')).toHaveClass('MuiInputLabel-filled')
    expect(select).toHaveAttribute(
        'aria-describedby',
        `external-help ${screen.getByText('Choose your main role').id}`,
    )
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0].primaryRole).toEqual(defaultRole)
    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'Reviewer' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { primaryRole: roles[1] },
        { primaryRole: { type: 'select', value: roles[1] } },
    )

    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'None' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { primaryRole: null },
        { primaryRole: { type: 'select', value: null } },
    )
})

test('select validates an empty required value and focuses the input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'primaryRole',
            type: 'select',
            properties: {
                label: 'Primary role',
                helperText: 'Choose a role',
                items: [{ id: 1, name: 'Editor' }],
                getItemLabel: (item: { id: number; name: string }) => item.name,
                getItemKey: (item: { id: number; name: string }) => item.id,
            },
            rules: { required: 'Choose a primary role' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const select = screen.getByRole('combobox', { name: 'Primary role' })
    expect(select).toBeRequired()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    const error = await screen.findByText('Choose a primary role')
    expect(error).toBeVisible()
    expect(select).toHaveAttribute('aria-describedby', error.id)
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveFocus()
    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'Editor' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { primaryRole: { id: 1, name: 'Editor' } },
        { primaryRole: { type: 'select', value: { id: 1, name: 'Editor' } } },
    )
    expect(screen.getByText('Choose a role')).toBeVisible()
})

test('multiple select initializes an array and preserves selected objects', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 0, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'select',
            properties: {
                label: 'Roles',
                multiple: true,
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id.toString(),
            },
        },
    ])
    const form = render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const select = screen.getByRole('combobox', { name: 'Roles' })

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { roles: [] },
        { roles: { type: 'select', value: [] } },
    )
    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'Editor' }))
    await user.click(screen.getByRole('option', { name: 'Reviewer' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { roles },
        { roles: { type: 'select', value: roles } },
    )
    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'Editor' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { roles: [roles[1]] },
        { roles: { type: 'select', value: [roles[1]] } },
    )

    form.unmount()
    onSubmit.mockClear()
    render(
        <FormBuilder
            config={config}
            defaultValues={{ roles: [{ id: 2, name: 'Reviewer' }] }}
            onSubmit={onSubmit}
        />,
    )
    expect(screen.getByRole('combobox', { name: 'Roles' })).toHaveTextContent('Reviewer')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0].roles).toEqual([{ id: 2, name: 'Reviewer' }])
})

test('multiple select validates an empty required array', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'select',
            properties: {
                label: 'Roles',
                multiple: true,
                items: [{ id: 1, name: 'Editor' }],
                getItemLabel: (item: { id: number; name: string }) => item.name,
                getItemKey: (item: { id: number; name: string }) => item.id,
            },
            rules: { required: 'Choose a role' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const select = screen.getByRole('combobox', { name: 'Roles' })
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(await screen.findByText('Choose a role')).toBeVisible()
    expect(select).toHaveFocus()
    await user.click(select)
    await user.click(screen.getByRole('option', { name: 'Editor' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { roles: [{ id: 1, name: 'Editor' }] },
        { roles: { type: 'select', value: [{ id: 1, name: 'Editor' }] } },
    )
})

test('multiple select accepts a single value from the hidden input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 0, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'select',
            properties: {
                label: 'Roles',
                multiple: true,
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id,
            },
        },
    ])
    const { container } = render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const input = container.querySelector('input[name="roles"]')
    expect(input).not.toBeNull()
    fireEvent.change(input!, { target: { value: '1' } })
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0].roles).toEqual([roles[1]])
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
