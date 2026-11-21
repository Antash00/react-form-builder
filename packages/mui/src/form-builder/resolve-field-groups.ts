import type { FieldGroup, ItemField } from '../types/index.js'

export function resolveFieldGroups<TConfig extends readonly ItemField[]>(
    config: TConfig,
    groups?: readonly FieldGroup<NoInfer<TConfig[number]['accessor']>>[],
) {
    const fieldsByAccessor = new Map(config.map((field) => [field.accessor, field]))
    const groupedAccessors = new Set<string>()
    const groupedFields = groups?.map((group) => {
        const fields = group.fields.map((accessor) => {
            const field = fieldsByAccessor.get(accessor)
            if (!field) {
                throw new Error(`Unknown group field "${accessor}": no matching field in config`)
            }
            if (groupedAccessors.has(accessor)) {
                throw new Error(`Duplicate group field "${accessor}": each field can appear once`)
            }
            groupedAccessors.add(accessor)
            return field
        })
        return { group, fields }
    })
    const ungroupedFields = config.filter((field) => !groupedAccessors.has(field.accessor))
    return { groupedFields, ungroupedFields }
}
