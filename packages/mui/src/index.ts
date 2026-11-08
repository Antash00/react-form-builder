export const VERSION = '0.1.0'
export { FormBuilder } from './form-builder/'

export type {
    TextFieldConfig,
    NumberFieldConfig,
    CheckboxFieldConfig,
    CheckboxGroupFieldConfig,
    RadioGroupFieldConfig,
    SelectFieldConfig,
    AutocompleteFieldConfig,
    FieldGroup,
} from './types/'
export type { InferFieldValue, InferFormValues } from './types/'
export { defineConfig } from './helpers'
