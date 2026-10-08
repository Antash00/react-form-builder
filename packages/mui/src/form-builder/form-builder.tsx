import { type SubmitHandler, useForm } from "react-hook-form";
import type { InferFormResult, InferFormValues, ItemField, TextFieldConfig } from "../types";
import { TextFieldRenderer } from "../fields/text";
import { buildFormResult } from "../helpers";

type FormBuilderProps<TConfig extends readonly ItemField[]> = {
    config: TConfig
    onSubmit: (values: InferFormValues<TConfig>, result: InferFormResult<TConfig>,) => void
}

export const FormBuilder = <
    const TConfig extends readonly ItemField[],
>({
      config,
      onSubmit,
  }: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    const {
        control,
        handleSubmit,
    } = useForm<FormValues>()

    const handleFormSubmit: SubmitHandler<FormValues> = (values) => {
        const result = buildFormResult(config, values)
        onSubmit(values, result)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {config.map((field) => {
                switch (field.type) {
                    case 'text':
                        return (
                            <TextFieldRenderer<FormValues>
                                key={field.accessor}
                                config={field}
                                control={control}
                            />
                        )
                }
            })}

            <button type="submit">
                Submit
            </button>
        </form>
    )
}