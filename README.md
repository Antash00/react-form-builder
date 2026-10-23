# React Form Builder MUI

Most projects have many ordinary forms with the same field, validation, and
submission wiring. React Form Builder MUI speeds up building those forms: describe
the fields in a typed config, and the library connects React Hook Form to Material
UI, renders the inputs, shows validation errors, and infers submitted value types.

> Early development. API is not stable yet.

## Current capabilities

- `FormBuilder` creates a standalone React Hook Form form from `defineConfig(...)`.
- Field `properties` stay close to MUI props; the library controls form-owned
  props such as value, change and blur handlers.
- `rules` connect supported React Hook Form validation to MUI error and required
  states.
- `defaultValues` initialize forms for editing existing data.
- Optional `groups` arrange selected fields with MUI Grid. Other fields follow in config order.
- Select, radio group, checkbox group, and autocomplete fields keep the original
  item objects in submitted values. `getItemKey` matches saved objects to current
  items in select and group fields.
- The playground is a consumer of the package and contains working examples of
  every supported field type.

| Field type      | Component        | Submitted value                                     |
| --------------- | ---------------- | --------------------------------------------------- |
| `text`          | MUI TextField    | `string`                                            |
| `number`        | MUI TextField    | `number \| null` (`null` when empty)                |
| `checkbox`      | MUI Checkbox     | `boolean`                                           |
| `checkboxGroup` | MUI checkboxes   | `TItem[]`                                           |
| `radioGroup`    | MUI RadioGroup   | `TItem \| null`                                     |
| `select`        | MUI Select       | `TItem \| null`, or `TItem[]` with `multiple: true` |
| `autocomplete`  | MUI Autocomplete | `TItem \| null`, or `TItem[]` with `multiple: true` |

## Example

```tsx
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

type Role = { id: number; name: string }

const roles: Role[] = [
    { id: 1, name: 'Editor' },
    { id: 2, name: 'Reviewer' },
]

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        properties: { label: 'Name', fullWidth: true },
        rules: { required: 'Enter a name' },
    },
    {
        accessor: 'confirmed',
        type: 'checkbox',
        properties: { label: 'I confirm the details' },
    },
    {
        accessor: 'roles',
        type: 'checkboxGroup',
        properties: {
            label: 'Roles',
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
    },
    {
        accessor: 'primaryRole',
        type: 'select',
        properties: {
            label: 'Primary role',
            emptyLabel: 'No primary role',
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
    },
    {
        accessor: 'additionalRoles',
        type: 'select',
        properties: {
            label: 'Additional roles',
            multiple: true,
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
    },
    {
        accessor: 'approvalRole',
        type: 'radioGroup',
        properties: {
            label: 'Approval role',
            row: true,
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
    },
    {
        accessor: 'searchRole',
        type: 'autocomplete',
        properties: {
            label: 'Search for a role',
            options: roles,
            getOptionLabel: (role: Role) => role.name,
            isOptionEqualToValue: (option: Role, value: Role) => option.id === value.id,
        },
    },
])

export function UserForm() {
    return (
        <FormBuilder
            config={config}
            defaultValues={{ primaryRole: roles[0], additionalRoles: [roles[1]] }}
            onSubmit={(values) => {
                console.log(values.name, values.confirmed)
                console.log(values.roles.map((role) => role.name))
                console.log(values.primaryRole?.name)
                console.log(values.additionalRoles.map((role) => role.name))
                console.log(values.approvalRole?.name, values.searchRole?.name)
            }}
        />
    )
}
```

The submit callback infers `name` as `string`, `confirmed` as `boolean`, `roles`
and `additionalRoles` as `Role[]`, and `primaryRole`, `approvalRole`, and
`searchRole` as `Role | null`. Select and radio defaults may be different object
instances from `items` when their keys match. For autocomplete, pass
`isOptionEqualToValue` when saved values may be different instances from
`options`. `emptyLabel` adds a clear option to a single select. The optional
second submit argument contains each field's type and value.

For a responsive layout, pass groups of field accessors to `FormBuilder`:

```tsx
groups={[
    { fields: ['firstName', 'lastName'], columns: { xs: 1, md: 2 }, gap: 2 },
    { fields: ['email', 'phone'], columns: { xs: 1, md: 2 }, gap: 3 },
]}
```

Each group is a MUI Grid container; `columns` and `gap` use the Grid's column and
spacing props. A field can occur in only one group. Fields omitted from groups are
rendered after the groups in their config order.

The current package provides the standalone `FormBuilder`. Complex forms can use
React Hook Form and JSX directly. Rendering configured fields inside an existing
form context is planned for a later API.

## Development

```bash
pnpm install
pnpm --filter playground dev
```

## Code style

```bash
pnpm lint          # ESLint across the workspace
pnpm lint:fix
pnpm format        # Prettier across the workspace
pnpm format:check
```

## Tests

```bash
pnpm --filter @antash00/form-builder-mui test:unit
pnpm build && pnpm test:types
pnpm --filter playground exec playwright install chromium
pnpm test:e2e
pnpm check
```

Vitest and Testing Library exercise the form behavior, `tsd` checks the built
package's public types, and Playwright tests the playground in Chromium.
