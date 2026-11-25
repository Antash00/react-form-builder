import { useEffect, useState } from 'react'
import { FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'
import { projectTeams } from '../variables/catalog'
import { savedProject } from '../variables/defaultValues'

type ProjectTeam = (typeof projectTeams)[number]

function buildConfig(items: readonly ProjectTeam[], loading: boolean) {
    const selectProperties = {
        items,
        getItemKey: (item: ProjectTeam) => item.id,
        getItemLabel: (item: ProjectTeam) => item.name,
    }
    return defineConfig([
        {
            accessor: 'name',
            type: 'text',
            properties: { label: 'Project name' },
            rules: { required: 'Enter a project name' },
        },
        {
            accessor: 'owner',
            type: 'select',
            properties: { ...selectProperties, label: 'Owning team' },
            rules: { required: 'Choose an owning team' },
        },
        {
            accessor: 'contributors',
            type: 'select',
            properties: { ...selectProperties, label: 'Contributing teams', multiple: true },
            rules: { required: 'Choose at least one contributing team' },
        },
        {
            accessor: 'reviewer',
            type: 'autocomplete',
            properties: {
                label: 'Reviewing team',
                options: items,
                loading,
                getOptionKey: (item: ProjectTeam) => item.id,
                getOptionLabel: (item: ProjectTeam) => item.name,
                isOptionEqualToValue: (option: ProjectTeam, value: ProjectTeam) =>
                    option.id === value.id,
            },
            rules: { required: 'Choose a reviewing team' },
        },
    ])
}

type Mode = 'create' | 'edit'

function ProjectForm({ mode, onSubmit, onInvalid }: { mode: Mode } & FormCallbacks) {
    const [teams, setTeams] = useState<readonly ProjectTeam[] | null>(null)

    useEffect(() => {
        const timer = window.setTimeout(() => setTeams(projectTeams), 700)
        return () => window.clearTimeout(timer)
    }, [])

    const loading = teams === null
    return (
        <>
            <p role="status" aria-label="Team catalog">
                {loading ? 'Loading teams…' : 'Teams loaded.'}
            </p>
            {(mode === 'create' || !loading) && (
                <FormBuilder
                    config={buildConfig(teams ?? [], loading)}
                    defaultValues={mode === 'edit' ? savedProject : undefined}
                    submitButtonProps={{ disabled: loading }}
                    onSubmit={onSubmit}
                    onInvalid={onInvalid}
                />
            )}
        </>
    )
}

export function AsyncOptionsForm({
    clearOutput,
    ...callbacks
}: FormCallbacks & { clearOutput: () => void }) {
    const [mode, setMode] = useState<Mode>('create')

    function changeMode(next: Mode) {
        if (next !== mode) {
            clearOutput()
            setMode(next)
        }
    }
    return (
        <div className="async-options">
            <div className="async-options-actions">
                <button
                    type="button"
                    aria-pressed={mode === 'create'}
                    onClick={() => changeMode('create')}
                >
                    Create project
                </button>
                <button
                    type="button"
                    aria-pressed={mode === 'edit'}
                    onClick={() => changeMode('edit')}
                >
                    Edit saved project
                </button>
            </div>
            <ProjectForm key={mode} mode={mode} {...callbacks} />
        </div>
    )
}
