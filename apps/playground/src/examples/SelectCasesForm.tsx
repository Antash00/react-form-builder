import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

type Team = { id: number; name: string }

const teams: Team[] = [
    { id: 0, name: 'Operations' },
    { id: 1, name: 'Design' },
    { id: 2, name: 'Engineering' },
]

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
            items: teams,
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
            items: teams,
            getItemLabel: (team: Team) => team.name,
            getItemKey: (team: Team) => team.id,
        },
        rules: { required: 'Choose at least one team' },
    },
])

export const SelectCasesForm = () => {
    const [submitted, setSubmitted] = useState<{ reviewer: string; teams: string[] } | null>(null)

    return (
        <>
            <p>
                The form starts with saved selections. Try clearing the reviewer and changing teams.
            </p>
            <FormBuilder
                config={config}
                defaultValues={{
                    reviewer: { id: 0, name: 'Operations' },
                    teams: [{ id: 1, name: 'Design' }],
                }}
                onSubmit={(values) => {
                    setSubmitted({
                        reviewer: values.reviewer?.name ?? 'None',
                        teams: values.teams.map((team) => team.name),
                    })
                }}
            />
            {submitted && (
                <>
                    <output aria-label="Saved reviewer">{submitted.reviewer}</output>
                    <output aria-label="Saved teams">{submitted.teams.join(', ')}</output>
                </>
            )}
        </>
    )
}
