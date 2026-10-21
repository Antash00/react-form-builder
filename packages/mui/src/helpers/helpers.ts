import type {
    CheckboxGroupFieldConfig,
    InferFormResult,
    InferFormValues,
    ItemField,
    SelectFieldConfig,
} from '../types'

type ValidateSelectableItems<TField> = TField extends {
    type: 'checkboxGroup' | 'select'
    properties: { items: readonly (infer TItem)[] }
}
    ? TField extends { type: 'select' }
        ? SelectFieldConfig<TItem>
        : CheckboxGroupFieldConfig<TItem>
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
