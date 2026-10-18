import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        id: 'person-name',
        properties: {
            label: 'Name',
            placeholder: 'Enter name',
            fullWidth: true,
            variant: 'filled',
            helperText: 'Your full name',
            slotProps: {
                htmlInput: { autoComplete: 'name', maxLength: 60 },
                inputLabel: (state) => ({ shrink: state.required }),
            },
        },
        rules: {
            required: 'Name is required',
        },
    },
])

export const BasicForm = () => {
    const [submittedName, setSubmittedName] = useState<string | null>(null)

    return (
        <>
            <FormBuilder
                config={config}
                onSubmit={(values) => {
                    setSubmittedName(values.name)
                }}
            />
            {submittedName !== null && <output aria-label="Submitted name">{submittedName}</output>}
        </>
    )
}
