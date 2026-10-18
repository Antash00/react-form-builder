import { expect, test, vi } from 'vitest'
import { render } from '@testing-library/react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

const captured = vi.hoisted(() => ({
    submit: undefined as undefined | ((values: { name: string }) => unknown),
}))

vi.mock('react-hook-form', async (importOriginal) => {
    const original = await importOriginal<typeof import('react-hook-form')>()
    return {
        ...original,
        useForm: (...args: Parameters<typeof original.useForm>) => {
            const form = original.useForm(...args)
            return {
                ...form,
                handleSubmit: (onValid: Parameters<typeof form.handleSubmit>[0]) => {
                    captured.submit = onValid as (values: { name: string }) => unknown
                    return form.handleSubmit(onValid)
                },
            }
        },
    }
})

test('returns the user submit promise to React Hook Form', async () => {
    let resolveSubmit: () => void = () => {}
    const pending = new Promise<void>((resolve) => {
        resolveSubmit = resolve
    })
    const onSubmit = vi.fn(() => pending)
    const config = defineConfig([{ accessor: 'name', type: 'text' }])
    render(<FormBuilder config={config} onSubmit={onSubmit} />)

    const returned = captured.submit?.({ name: 'Ada' })
    expect(returned).toBe(pending)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' }, { name: { type: 'text', value: 'Ada' } })
    resolveSubmit()
    await returned
})
