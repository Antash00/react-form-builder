import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

afterEach(cleanup)

test('disabled basic fields skip required validation and keep their initial values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'name',
            type: 'text',
            properties: { label: 'Name', disabled: true },
            rules: { required: 'Enter a name' },
        },
        {
            accessor: 'amount',
            type: 'number',
            properties: { label: 'Amount', disabled: true },
            rules: { required: 'Enter an amount' },
        },
        {
            accessor: 'confirmed',
            type: 'checkbox',
            properties: { label: 'Confirmed', disabled: true },
            rules: { required: 'Confirm' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled()
    expect(screen.getByRole('spinbutton', { name: 'Amount' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: /Confirmed/ })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { name: '', amount: null, confirmed: false },
        {
            name: { type: 'text', value: '' },
            amount: { type: 'number', value: null },
            confirmed: { type: 'checkbox', value: false },
        },
    )
})

test('fields with separate helper text derive its id from the configured id', () => {
    const items = [{ id: 1, name: 'Editor' }]
    const config = defineConfig([
        {
            accessor: 'confirmed',
            type: 'checkbox',
            id: 'confirmed',
            properties: { label: 'Confirmed', helperText: 'Confirmation help' },
        },
        {
            accessor: 'roles',
            type: 'checkboxGroup',
            id: 'roles',
            properties: {
                label: 'Roles',
                helperText: 'Roles help',
                items,
                getItemLabel: (item: (typeof items)[number]) => item.name,
                getItemKey: (item: (typeof items)[number]) => item.id,
            },
        },
        {
            accessor: 'radioRole',
            type: 'radioGroup',
            id: 'radio-role',
            properties: {
                label: 'Radio role',
                helperText: 'Radio help',
                items,
                getItemLabel: (item: (typeof items)[number]) => item.name,
                getItemKey: (item: (typeof items)[number]) => item.id,
            },
        },
        {
            accessor: 'primaryRole',
            type: 'select',
            id: 'primary-role',
            properties: {
                label: 'Primary role',
                helperText: 'Select help',
                items,
                getItemLabel: (item: (typeof items)[number]) => item.name,
                getItemKey: (item: (typeof items)[number]) => item.id,
            },
        },
    ])
    render(<FormBuilder config={config} onSubmit={() => {}} />)

    expect(screen.getByText('Confirmation help')).toHaveAttribute('id', 'confirmed-helper-text')
    expect(screen.getByText('Roles help')).toHaveAttribute('id', 'roles-helper-text')
    expect(screen.getByText('Radio help')).toHaveAttribute('id', 'radio-role-helper-text')
    expect(screen.getByText('Select help')).toHaveAttribute('id', 'primary-role-helper-text')
    expect(screen.getByRole('checkbox', { name: 'Confirmed' })).toHaveAttribute(
        'aria-describedby',
        'confirmed-helper-text',
    )
    expect(screen.getByRole('checkbox', { name: 'Editor' })).toHaveAttribute(
        'aria-describedby',
        'roles-helper-text',
    )
    expect(screen.getByRole('radiogroup', { name: 'Radio role' })).toHaveAttribute(
        'aria-describedby',
        'radio-role-helper-text',
    )
    expect(screen.getByRole('combobox', { name: 'Primary role' })).toHaveAttribute(
        'aria-describedby',
        'primary-role-helper-text',
    )
})

test('radio group validates, selects and resets a domain object', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 0, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'role',
            type: 'radioGroup',
            id: 'role-group',
            properties: {
                label: 'Role',
                helperText: 'Choose one role',
                row: true,
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id,
            },
            rules: { required: 'Select a role' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const editor = screen.getByRole('radio', { name: 'Editor' })
    const reviewer = screen.getByRole('radio', { name: 'Reviewer' })
    expect(editor).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    const error = await screen.findByText('Select a role')
    expect(editor).toHaveFocus()
    expect(screen.getByRole('radiogroup', { name: 'Role' })).toHaveAttribute(
        'aria-describedby',
        error.id,
    )
    await user.click(editor)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenLastCalledWith(
        { role: roles[0] },
        { role: { type: 'radioGroup', value: roles[0] } },
    )
    expect(screen.getByText('Choose one role')).toBeVisible()
    await user.click(reviewer)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls.at(-1)?.[0].role).toEqual(roles[1])
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(editor).not.toBeChecked()
    expect(reviewer).not.toBeChecked()
})

test('radio group matches a saved object by key and skips validation when disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [{ id: 0, name: 'Editor' }]
    const config = defineConfig([
        {
            accessor: 'role',
            type: 'radioGroup',
            properties: {
                label: 'Role',
                disabled: true,
                items: roles,
                getItemLabel: (item: (typeof roles)[number]) => item.name,
                getItemKey: (item: (typeof roles)[number]) => item.id,
            },
            rules: { required: 'Select a role' },
        },
    ])
    render(
        <FormBuilder
            config={config}
            defaultValues={{ role: { id: 0, name: 'Editor' } }}
            onSubmit={onSubmit}
        />,
    )
    expect(screen.getByRole('radio', { name: 'Editor' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Editor' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0].role).toEqual({ id: 0, name: 'Editor' })
})

test('autocomplete selects, clears, validates and resets a domain object', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 1, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'role',
            type: 'autocomplete',
            id: 'role-search',
            properties: {
                label: 'Role search',
                helperText: 'Choose a role',
                options: roles,
                getOptionLabel: (role: (typeof roles)[number]) => role.name,
            },
            rules: { required: 'Role is required' },
        },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const input = screen.getByRole('combobox', { name: /Role search/ })

    expect(input).toHaveAttribute('id', 'role-search')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Role is required')).toBeVisible()
    expect(input).toHaveFocus()
    await user.type(input, 'Rev')
    await user.click(screen.getByRole('option', { name: 'Reviewer' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { role: roles[1] },
        { role: { type: 'autocomplete', value: roles[1] } },
    )
    expect(screen.getByText('Choose a role')).toBeVisible()

    await user.click(screen.getByTitle('Clear'))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(screen.getByText('Role is required')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(input).toHaveValue('')
})

test('multiple autocomplete keeps arrays of selected objects and default values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const roles = [
        { id: 1, name: 'Editor' },
        { id: 2, name: 'Reviewer' },
    ]
    const config = defineConfig([
        {
            accessor: 'roles',
            type: 'autocomplete',
            properties: {
                label: 'Roles search',
                multiple: true,
                options: roles,
                getOptionLabel: (role: (typeof roles)[number]) => role.name,
            },
        },
    ])
    render(
        <FormBuilder config={config} defaultValues={{ roles: [roles[0]] }} onSubmit={onSubmit} />,
    )
    expect(screen.getByText('Editor')).toBeVisible()
    const input = screen.getByRole('combobox', { name: 'Roles search' })
    await user.type(input, 'Rev')
    await user.click(screen.getByRole('option', { name: 'Reviewer' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { roles },
        { roles: { type: 'autocomplete', value: roles } },
    )
})

test('renders responsive MUI grids without losing ungrouped fields or form values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'firstName', type: 'text', properties: { label: 'First name' } },
        { accessor: 'lastName', type: 'text', properties: { label: 'Last name' } },
        { accessor: 'email', type: 'text', properties: { label: 'Email' } },
        { accessor: 'phone', type: 'text', properties: { label: 'Phone' } },
        { accessor: 'notes', type: 'text', properties: { label: 'Notes' } },
    ])

    const { container } = render(
        <FormBuilder
            config={config}
            groups={[
                { fields: ['firstName', 'lastName'], columns: { xs: 1, md: 2 }, gap: 2 },
                { fields: ['email', 'phone'], columns: { xs: 1, md: 2 }, gap: 3 },
            ]}
            onSubmit={onSubmit}
        />,
    )

    const grids = container.querySelectorAll('.MuiGrid-container')
    expect(grids).toHaveLength(3)
    expect(grids[0]).toHaveClass('MuiGrid-spacing-xs-2')
    expect(grids[1]).toHaveClass('MuiGrid-spacing-xs-3')
    expect(grids[0].querySelectorAll('.MuiGrid-root')).toHaveLength(2)
    expect(grids[1].querySelectorAll('.MuiGrid-root')).toHaveLength(2)
    expect(grids[2]).toHaveClass('MuiGrid-spacing-xs-2')
    expect(grids[2].querySelectorAll('.MuiGrid-root')).toHaveLength(1)
    expect(grids[2]).toContainElement(screen.getByRole('textbox', { name: 'Notes' }))
    expect(screen.getAllByRole('textbox').map((input) => input.getAttribute('name'))).toEqual([
        'firstName',
        'lastName',
        'email',
        'phone',
        'notes',
    ])

    await user.type(screen.getByRole('textbox', { name: 'First name' }), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { firstName: 'Ada', lastName: '', email: '', phone: '', notes: '' },
        expect.any(Object),
    )
})

test('wraps fields in a single-column MUI grid when groups are omitted', async () => {
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'firstName', type: 'text', properties: { label: 'First name' } },
        { accessor: 'lastName', type: 'text', properties: { label: 'Last name' } },
    ])
    const { container } = render(<FormBuilder config={config} onSubmit={onSubmit} />)

    const grid = container.querySelector('.MuiGrid-container')
    expect(grid).not.toBeNull()
    expect(container.querySelectorAll('.MuiGrid-container')).toHaveLength(1)
    expect(grid).toHaveClass('MuiGrid-spacing-xs-2')
    expect(grid?.querySelectorAll(':scope > .MuiGrid-root')).toHaveLength(2)
    expect(grid).toContainElement(screen.getByRole('textbox', { name: 'First name' }))
    expect(grid).toContainElement(screen.getByRole('textbox', { name: 'Last name' }))

    await userEvent.setup().click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith({ firstName: '', lastName: '' }, expect.any(Object))
})

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

test('preserves string values for text and multiline fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        { accessor: 'amount', type: 'text', properties: { label: 'Amount as text' } },
        { accessor: 'notes', type: 'text', properties: { label: 'Notes', multiline: true } },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    await user.type(screen.getByRole('textbox', { name: 'Amount as text' }), '12.5')
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'First line')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(
        { amount: '12.5', notes: 'First line' },
        { amount: { type: 'text', value: '12.5' }, notes: { type: 'text', value: 'First line' } },
    )
})

test('number field submits null, zero and decimals alongside text fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'amount',
            type: 'number',
            id: 'amount',
            properties: { label: 'Amount', helperText: 'Enter an amount' },
        },
        { accessor: 'code', type: 'text', properties: { label: 'Code' } },
    ])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const amount = screen.getByRole('spinbutton', { name: 'Amount' })
    const code = screen.getByRole('textbox', { name: 'Code' })
    expect(amount).toHaveAttribute('id', 'amount')

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0]).toEqual({ amount: null, code: '' })

    await user.type(amount, '0')
    await user.type(code, '0')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[1][0]).toEqual({ amount: 0, code: '0' })

    await user.clear(amount)
    await user.type(amount, '12.5')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[2][0]).toEqual({ amount: 12.5, code: '0' })

    await user.clear(amount)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[3][0].amount).toBeNull()
})

test('number field validates required and range rules while keeping a numeric default', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const config = defineConfig([
        {
            accessor: 'amount',
            type: 'number',
            properties: { label: 'Amount', helperText: 'Between 0 and 10' },
            rules: {
                required: 'Enter an amount',
                min: { value: 0, message: 'Too small' },
                max: 10,
            },
        },
    ])
    const form = render(<FormBuilder config={config} onSubmit={onSubmit} />)
    const amount = screen.getByRole('spinbutton', { name: /Amount/ })
    expect(amount).toBeRequired()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Enter an amount')).toBeVisible()
    expect(amount).toHaveFocus()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.type(amount, '-1')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Too small')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.clear(amount)
    await user.type(amount, '0')
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit.mock.calls[0][0].amount).toBe(0)
    expect(screen.getByText('Between 0 and 10')).toBeVisible()

    form.unmount()
    onSubmit.mockClear()
    render(<FormBuilder config={config} defaultValues={{ amount: 5 }} onSubmit={onSubmit} />)
    expect(screen.getByRole('spinbutton', { name: /Amount/ })).toHaveValue(5)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith({ amount: 5 }, { amount: { type: 'number', value: 5 } })
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
