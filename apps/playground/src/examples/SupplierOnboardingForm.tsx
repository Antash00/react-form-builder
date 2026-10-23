import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'
import {
    type Choice,
    countries,
    currencies,
    getId,
    getName,
    industries,
    managers,
    regions,
    sameChoice,
    supplierCategories,
} from './catalog'

const paymentTerms: Choice[] = [
    { id: 'prepaid', name: 'Prepaid' },
    { id: 'net-15', name: 'Net 15' },
    { id: 'net-30', name: 'Net 30' },
    { id: 'net-45', name: 'Net 45' },
    { id: 'net-60', name: 'Net 60' },
    { id: 'milestone', name: 'Milestone billing' },
]

const contractTypes: Choice[] = [
    { id: 'master', name: 'Master services agreement' },
    { id: 'purchase', name: 'Purchase order' },
    { id: 'subscription', name: 'Subscription' },
    { id: 'statement', name: 'Statement of work' },
    { id: 'one-time', name: 'One-time purchase' },
]

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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getOptionLabel: getName,
            isOptionEqualToValue: sameChoice,
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
            getItemLabel: getName,
            getItemKey: getId,
        },
    },
    {
        accessor: 'accountOwner',
        type: 'autocomplete',
        properties: {
            label: 'Internal account owner',
            fullWidth: true,
            options: managers,
            getOptionLabel: getName,
            isOptionEqualToValue: sameChoice,
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
            getItemLabel: getName,
            getItemKey: getId,
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

export function SupplierOnboardingForm() {
    const [submitted, setSubmitted] = useState<string | null>(null)

    return (
        <>
            <p>
                Review a saved supplier draft. This 30-field form covers company identity, contacts,
                billing, service scope and compliance.
            </p>
            <FormBuilder
                config={config}
                defaultValues={{
                    registrationNumber: 'ACME-2026',
                    taxId: 'US123456789',
                    industry: industries[0],
                    country: countries[14],
                    stateProvince: 'New York',
                    city: 'New York',
                    postalCode: '10001',
                    addressLine1: '100 Market Street',
                    primaryContact: 'Dana Lewis',
                    contactEmail: 'dana@example.com',
                    contactPhone: '+1 212 555 0198',
                    currency: currencies[9],
                    paymentTerms: paymentTerms[2],
                    annualSpend: 125000,
                    categories: [supplierCategories[9]],
                    regions: [regions[0]],
                    accountOwner: managers[1],
                    contractType: contractTypes[0],
                }}
                onSubmit={(values, result) => {
                    console.log('Supplier onboarding submit', { values, result })
                    setSubmitted(JSON.stringify(values, null, 2))
                }}
            />
            {submitted !== null && (
                <pre aria-label="Submitted values" className="submission-output">
                    {submitted}
                </pre>
            )}
        </>
    )
}
