import { SupplierOnboardingForm } from '../examples/SupplierOnboardingForm'
import { EmployeeOnboardingForm } from '../examples/EmployeeOnboardingForm'
import { AsyncOptionsForm } from '../examples/AsyncOptionsForm'
import { SelectCasesForm } from '../examples/SelectCasesForm'
import { AllFieldsForm } from '../examples/AllFieldsForm'
import { BasicForm } from '../examples/BasicForm'

export const categories = [
    {
        title: 'Getting started',
        examples: [
            {
                path: '/basic',
                title: 'Basic form',
                description: 'Capture a name and assign roles with required-field validation.',
                detail: 'Submit an empty form to focus the first invalid field. Select roles to inspect the original objects in the callback.',
                component: BasicForm,
                file: 'BasicForm',
            },
            {
                path: '/all-fields',
                title: 'All fields',
                description: 'Try every field type in a single editable record.',
                detail: 'Compare grouped inputs, numeric defaults, radio buttons and autocomplete. Reset restores the original record.',
                component: AllFieldsForm,
                file: 'AllFieldsForm',
            },
        ],
    },
    {
        title: 'Common use cases',
        examples: [
            {
                path: '/select-cases',
                title: 'Select cases',
                description: 'Edit a saved reviewer and choose multiple teams.',
                detail: 'Clear the optional reviewer or update the required team list. Submitted selections retain their IDs and names.',
                component: SelectCasesForm,
                file: 'SelectCasesForm',
            },
            {
                path: '/async-options',
                title: 'Async options',
                description: 'Load team options while creating or editing a project.',
                detail: 'Enter a project name while teams load, or open a saved project to edit its team selections.',
                component: AsyncOptionsForm,
                file: 'AsyncOptionsForm',
            },
        ],
    },
    {
        title: 'Real-world examples',
        examples: [
            {
                path: '/employee-onboarding',
                title: 'Employee onboarding',
                description: 'Prepare a new hire’s placement, pay and access requests.',
                detail: 'Complete the saved employee draft using grouped fields, salary validation and object-valued equipment selections.',
                component: EmployeeOnboardingForm,
                file: 'EmployeeOnboardingForm',
            },
            {
                path: '/supplier-onboarding',
                title: 'Supplier onboarding',
                description: 'Review a supplier’s contact, billing and compliance details.',
                detail: 'Edit a 30-field draft with searchable catalogs, numeric limits and a required compliance review.',
                component: SupplierOnboardingForm,
                file: 'SupplierOnboardingForm',
            },
        ],
    },
]
export type Example = (typeof categories)[number]['examples'][number]

export const examples = categories.flatMap((category) =>
    category.examples.map((example) => ({ ...example, category: category.title })),
)
