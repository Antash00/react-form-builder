import { type FieldGroup, FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'
import {
    countries,
    currencies,
    industries,
    managers,
    regions,
    supplierCategories,
    paymentTerms,
    contractTypes,
} from '../variables/catalog'
import { supplierOnboardingDefaults } from '../variables/defaultValues'

type Option = { id: string; name: string }

const emailRule = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email',
}

const config = defineConfig([
    {
        accessor: 'legalName',
        type: 'text',
        properties: { label: 'Legal business name', fullWidth: true },
        rules: {
            required: 'Enter the legal business name',
            minLength: { value: 2, message: 'Use at least 2 characters' },
            maxLength: 120,
        },
    },
    {
        accessor: 'tradingName',
        type: 'text',
        properties: { label: 'Trading name', fullWidth: true },
        rules: { maxLength: 120 },
    },
    {
        accessor: 'registrationNumber',
        type: 'text',
        properties: { label: 'Registration number', fullWidth: true },
        rules: {
            required: 'Enter a registration number',
            pattern: { value: /^[A-Z0-9-]{5,20}$/i, message: 'Use 5–20 letters, digits or dashes' },
        },
    },
    {
        accessor: 'taxId',
        type: 'text',
        properties: { label: 'Tax ID', fullWidth: true },
        rules: { required: 'Enter a tax ID', minLength: 6, maxLength: 25 },
    },
    {
        accessor: 'website',
        type: 'text',
        properties: { label: 'Website', type: 'url', fullWidth: true },
        rules: {
            pattern: { value: /^https?:\/\/.+\..+$/i, message: 'Enter a full http(s) URL' },
        },
    },
    {
        accessor: 'yearFounded',
        type: 'number',
        properties: { label: 'Year founded', fullWidth: true },
        rules: {
            min: { value: 1800, message: 'Check the founding year' },
            max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
        },
    },
    {
        accessor: 'industry',
        type: 'select',
        properties: {
            label: 'Industry',
            fullWidth: true,
            items: industries,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose an industry' },
    },
    {
        accessor: 'country',
        type: 'select',
        properties: {
            label: 'Country',
            fullWidth: true,
            items: countries,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a country' },
    },
    {
        accessor: 'stateProvince',
        type: 'text',
        properties: { label: 'State or province', fullWidth: true },
        rules: { required: 'Enter a state or province', maxLength: 80 },
    },
    {
        accessor: 'city',
        type: 'text',
        properties: { label: 'City', fullWidth: true },
        rules: { required: 'Enter a city', maxLength: 80 },
    },
    {
        accessor: 'postalCode',
        type: 'text',
        properties: { label: 'Postal code', fullWidth: true },
        rules: { required: 'Enter a postal code', minLength: 3, maxLength: 15 },
    },
    {
        accessor: 'addressLine1',
        type: 'text',
        properties: { label: 'Address line 1', fullWidth: true },
        rules: { required: 'Enter an address', maxLength: 120 },
    },
    {
        accessor: 'addressLine2',
        type: 'text',
        properties: { label: 'Address line 2', fullWidth: true },
        rules: { maxLength: 120 },
    },
    {
        accessor: 'primaryContact',
        type: 'text',
        properties: { label: 'Primary contact', fullWidth: true },
        rules: { required: 'Enter a primary contact', minLength: 2, maxLength: 80 },
    },
    {
        accessor: 'contactTitle',
        type: 'text',
        properties: { label: 'Contact job title', fullWidth: true },
        rules: { maxLength: 80 },
    },
    {
        accessor: 'contactEmail',
        type: 'text',
        properties: { label: 'Contact email', type: 'email', fullWidth: true },
        rules: { required: 'Enter a contact email', pattern: emailRule },
    },
    {
        accessor: 'contactPhone',
        type: 'text',
        properties: { label: 'Contact phone', type: 'tel', fullWidth: true },
        rules: {
            required: 'Enter a contact phone',
            pattern: { value: /^\+?[\d\s()-]{7,20}$/, message: 'Enter a valid phone number' },
        },
    },
    {
        accessor: 'supportEmail',
        type: 'text',
        properties: { label: 'Support email', type: 'email', fullWidth: true },
        rules: { pattern: emailRule },
    },
    {
        accessor: 'currency',
        type: 'select',
        properties: {
            label: 'Billing currency',
            fullWidth: true,
            items: currencies,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a billing currency' },
    },
    {
        accessor: 'paymentTerms',
        type: 'select',
        properties: {
            label: 'Payment terms',
            fullWidth: true,
            items: paymentTerms,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose payment terms' },
    },
    {
        accessor: 'annualSpend',
        type: 'number',
        properties: { label: 'Estimated annual spend', fullWidth: true },
        rules: {
            required: 'Enter estimated annual spend',
            min: { value: 0, message: 'Amount cannot be negative' },
            max: { value: 100000000, message: 'Check the amount' },
        },
    },
    {
        accessor: 'leadTimeDays',
        type: 'number',
        properties: { label: 'Typical lead time (days)', fullWidth: true },
        rules: {
            min: { value: 0, message: 'Days cannot be negative' },
            max: { value: 365, message: 'Enter at most 365 days' },
        },
    },
    {
        accessor: 'categories',
        type: 'autocomplete',
        properties: {
            label: 'Goods and services',
            multiple: true,
            fullWidth: true,
            options: supplierCategories,
            getOptionLabel: (item: Option) => item.name,
            isOptionEqualToValue: (option: Option, value: Option) => option.id === value.id,
        },
        rules: { required: 'Choose at least one category' },
    },
    {
        accessor: 'regions',
        type: 'select',
        properties: {
            label: 'Service regions',
            multiple: true,
            fullWidth: true,
            items: regions,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
    },
    {
        accessor: 'accountOwner',
        type: 'autocomplete',
        properties: {
            label: 'Internal account owner',
            fullWidth: true,
            options: managers,
            getOptionLabel: (item: Option) => item.name,
            isOptionEqualToValue: (option: Option, value: Option) => option.id === value.id,
        },
        rules: { required: 'Choose an account owner' },
    },
    {
        accessor: 'contractType',
        type: 'select',
        properties: {
            label: 'Contract type',
            fullWidth: true,
            items: contractTypes,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a contract type' },
    },
    {
        accessor: 'insuranceCoverage',
        type: 'number',
        properties: { label: 'Insurance coverage', fullWidth: true },
        rules: { min: { value: 0, message: 'Coverage cannot be negative' } },
    },
    {
        accessor: 'dataProcessing',
        type: 'checkbox',
        properties: { label: 'Supplier will process personal data' },
    },
    {
        accessor: 'complianceApproved',
        type: 'checkbox',
        properties: { label: 'Compliance review completed' },
        rules: { required: 'Complete the compliance review' },
    },
    {
        accessor: 'notes',
        type: 'text',
        properties: { label: 'Procurement notes', multiline: true, minRows: 3, fullWidth: true },
        rules: { maxLength: { value: 1000, message: 'Use at most 1000 characters' } },
    },
])

const groups = [
    {
        fields: [
            'legalName',
            'tradingName',
            'registrationNumber',
            'taxId',
            'website',
            'yearFounded',
            'industry',
            'country',
            'stateProvince',
            'city',
            'postalCode',
            'addressLine1',
            'addressLine2',
        ],
        columns: { xs: 1, sm: 2 },
        gap: 2,
    },
    {
        fields: ['primaryContact', 'contactTitle', 'contactEmail', 'contactPhone', 'supportEmail'],
        columns: { xs: 1, sm: 2 },
        gap: 2,
    },
    {
        fields: [
            'currency',
            'paymentTerms',
            'annualSpend',
            'leadTimeDays',
            'categories',
            'regions',
            'accountOwner',
            'contractType',
            'insuranceCoverage',
        ],
        columns: { xs: 1, sm: 2 },
        gap: 2,
    },
] satisfies FieldGroup<(typeof config)[number]['accessor']>[]

export function SupplierOnboardingForm({ onSubmit, onInvalid }: FormCallbacks) {
    return (
        <FormBuilder
            config={config}
            groups={groups}
            defaultValues={supplierOnboardingDefaults}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    )
}
