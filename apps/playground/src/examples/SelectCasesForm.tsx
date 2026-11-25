import { reviewTeams } from '../variables/catalog'
import { FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'
import { selectCasesDefaults } from '../variables/defaultValues'

type Team = (typeof reviewTeams)[number]

const config = defineConfig([
    {
        accessor: 'reviewer',
        type: 'select',
        properties: {
            label: 'Reviewer',
            helperText: 'Optional; can be cleared',
            emptyLabel: 'No reviewer',
            fullWidth: true,
            variant: 'standard',
            items: reviewTeams,
            getItemLabel: (team: Team) => team.name,
            getItemKey: (team: Team) => team.id,
        },
    },
    {
        accessor: 'teams',
        type: 'select',
        properties: {
            label: 'Teams',
            helperText: 'Choose one or more teams',
            multiple: true,
            fullWidth: true,
            items: reviewTeams,
            getItemLabel: (team: Team) => team.name,
            getItemKey: (team: Team) => team.id,
        },
        rules: { required: 'Choose at least one team' },
    },
])

export function SelectCasesForm({ onSubmit, onInvalid }: FormCallbacks) {
    return (
        <FormBuilder
            config={config}
            defaultValues={selectCasesDefaults}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    )
}
