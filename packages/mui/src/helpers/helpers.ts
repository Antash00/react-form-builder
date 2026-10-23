import type {
    AutocompleteFieldConfig,
    CheckboxGroupFieldConfig,
    InferFormResult,
    InferFormValues,
    ItemField,
    RadioGroupFieldConfig,
    SelectFieldConfig,
} from '../types'
import type { RegisterOptions } from 'react-hook-form'
import type { ReactNode } from 'react'

type ValidateSelectableItems<TField> = TField extends {
    type: 'checkboxGroup' | 'radioGroup' | 'select'
    properties: { items: readonly (infer TItem)[] }
}
    ? TField extends { type: 'select' }
        ? SelectFieldConfig<TItem>
        : TField extends { type: 'radioGroup' }
          ? RadioGroupFieldConfig<TItem>
          : CheckboxGroupFieldConfig<TItem>
    : TField extends { type: 'autocomplete'; properties: { options: readonly (infer TItem)[] } }
      ? AutocompleteFieldConfig<TItem>
      : TField

export const defineConfig = <const TConfig extends readonly ItemField[]>(
    config: TConfig & {
        [TIndex in keyof TConfig]: ValidateSelectableItems<NoInfer<TConfig[TIndex]>>
    },
): TConfig => config

export const buildFormResult = <TConfig extends readonly ItemField[]>(
    config: TConfig,
    values: InferFormValues<TConfig>,
): InferFormResult<TConfig> => {
    return Object.fromEntries(
        config.map((field) => [
            field.accessor,
            {
                type: field.type,
                value: values[field.accessor as keyof InferFormValues<TConfig>],
            },
        ]),
    ) as unknown as InferFormResult<TConfig>
}

export function assertValidAccessors(config: readonly ItemField[]): void {
    const seen = new Set<string>()
    for (const { accessor } of config) {
        if (
            accessor === '' ||
            accessor.includes('.') ||
            accessor.includes('[') ||
            accessor.includes(']')
        ) {
            throw new Error(
                `Invalid accessor "${accessor}": use a non-empty name without dots or brackets`,
            )
        }
        if (seen.has(accessor)) {
            throw new Error(`Duplicate accessor "${accessor}": field names must be unique`)
        }
        seen.add(accessor)
    }
}

export const isRequired = (rule: RegisterOptions['required']): boolean =>
    typeof rule === 'object' ? Boolean(rule.value) : Boolean(rule)

export const hasSupportingText = (text: ReactNode): boolean =>
    text != null && text !== false && text !== ''
