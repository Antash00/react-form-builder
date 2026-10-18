import type { InferFormResult, InferFormValues, ItemField } from '../types'

type ConfigFromAccessors<TAccessors extends readonly string[]> = {
    readonly [TIndex in keyof TAccessors]: ItemField<TAccessors[TIndex] & string>
}

export const defineConfig = <const TAccessors extends readonly string[]>(
    config: ConfigFromAccessors<TAccessors>,
): ConfigFromAccessors<TAccessors> => config

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
