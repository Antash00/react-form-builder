import type { DefaultValues } from 'react-hook-form'
import type { InferFormValues, ItemField } from '../types/index.js'

function matchSelectedItems<TItem>(
    items: readonly TItem[],
    selectedValues: readonly TItem[],
    getItemKey: (item: TItem) => string | number,
): TItem[] {
    if (items.length === 0 || selectedValues.length === 0) return []
    const selectedKeys = new Set(selectedValues.map(getItemKey))
    return items.filter((item) => selectedKeys.has(getItemKey(item)))
}

function matchSelectedItem<TItem>(
    items: readonly TItem[],
    selectedValue: TItem | null | undefined,
    getItemKey: (item: TItem) => string | number,
): TItem | null {
    if (items.length === 0 || selectedValue == null) return null
    const selectedKey = getItemKey(selectedValue)
    return items.find((item) => getItemKey(item) === selectedKey) ?? null
}

export function buildInitialValues<TConfig extends readonly ItemField[]>(
    config: TConfig,
    defaultValues?: Partial<InferFormValues<TConfig>>,
): DefaultValues<InferFormValues<TConfig>> {
    const providedValues = new Map(Object.entries(defaultValues ?? {}))
    const initialValues: Record<string, unknown> = {}
    for (const field of config) {
        const value = providedValues.get(field.accessor)
        switch (field.type) {
            case 'text':
                initialValues[field.accessor] = typeof value === 'string' ? value : ''
                break
            case 'number':
                initialValues[field.accessor] = typeof value === 'number' ? value : null
                break
            case 'checkbox':
                initialValues[field.accessor] = typeof value === 'boolean' ? value : false
                break
            case 'checkboxGroup':
                initialValues[field.accessor] = matchSelectedItems(
                    field.properties.items,
                    Array.isArray(value) ? value : [],
                    (item) => field.properties.getItemKey(item),
                )
                break
            case 'radioGroup':
                initialValues[field.accessor] = matchSelectedItem(
                    field.properties.items,
                    value,
                    (item) => field.properties.getItemKey(item),
                )
                break
            case 'select':
                initialValues[field.accessor] = field.properties.multiple
                    ? matchSelectedItems(
                          field.properties.items,
                          Array.isArray(value) ? value : [],
                          (item) => field.properties.getItemKey(item),
                      )
                    : matchSelectedItem(field.properties.items, value, (item) =>
                          field.properties.getItemKey(item),
                      )
                break
            case 'autocomplete':
                initialValues[field.accessor] = field.properties.multiple
                    ? Array.isArray(value)
                        ? value
                        : []
                    : (value ?? null)
                break
            default:
                throw new Error(`Unsupported field: ${JSON.stringify(field satisfies never)}`)
        }
    }

    // Every configured field has an initialized value matching its field type.
    return initialValues as DefaultValues<InferFormValues<TConfig>>
}
