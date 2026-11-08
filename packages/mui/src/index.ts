export const VERSION = '0.1.0'
export { FormBuilder } from './form-builder/index.js'

export type {
    TextFieldConfig,
    NumberFieldConfig,
    CheckboxFieldConfig,
    CheckboxGroupFieldConfig,
    RadioGroupFieldConfig,
    SelectFieldConfig,
    AutocompleteFieldConfig,
    FieldGroup,
} from './types/index.js'
export type { InferFieldValue, InferFormValues } from './types/index.js'
export { defineConfig } from './helpers/index.js'
