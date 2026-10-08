import type { ItemField } from "./types";

export type InferFieldValue<TField extends ItemField> =
    TField extends { type: 'text' }
        ? string
        : never

export type InferFormValues<TConfig extends readonly ItemField[]> = {
    [TField in TConfig[number] as TField['accessor']]:
    InferFieldValue<TField>
}

export type InferFieldResult<TField extends ItemField> = {
    type: TField['type']
    value: InferFieldValue<TField>
}

export type InferFormResult<TConfig extends readonly ItemField[]> = {
    [TField in TConfig[number] as TField['accessor']]:
    InferFieldResult<TField>
}