import { defineConfig, FormBuilder } from "@antash00/form-builder-mui";

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        properties: {
            label: "Name",
            placeholder: 'Enter name',
            fullWidth: true,
            variant: 'filled'
        },
        rules: {
            required: 'Name is required',
        },
    },
])

export function BasicForm() {
    return (
        <FormBuilder
            config={ config }
            onSubmit={ (values, result) => {
                console.log(values)
                console.log(result)
            } }
        />
    )
}
