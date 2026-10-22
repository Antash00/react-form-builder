import type { ItemField } from './types'

export type InferFieldValue<TField extends ItemField> =
    | (TField extends { type: 'text' } ? string : never)
    | (TField extends { type: 'number' } ? number | null : never)
    | (TField extends { type: 'checkbox' } ? boolean : never)
    | (TField extends { type: 'checkboxGroup'; properties: { items: readonly (infer TItem)[] } }
          ? TItem[]
          : never)
    | (TField extends { type: 'select'; properties: { items: readonly (infer TItem)[] } }
          ? TField extends { properties: { multiple: infer TMultiple extends boolean } }
              ? TMultiple extends true
                  ? TItem[]
                  : TItem | null
              : TItem | null
          : never)

export type InferFormValues<TConfig extends readonly ItemField[]> = {
    [TField in TConfig[number] as TField['accessor']]: InferFieldValue<TField>
}

export type InferFieldResult<TField extends ItemField> = {
    type: TField['type']
    value: InferFieldValue<TField>
}

export type InferFormResult<TConfig extends readonly ItemField[]> = {
    [TField in TConfig[number] as TField['accessor']]: InferFieldResult<TField>
}
