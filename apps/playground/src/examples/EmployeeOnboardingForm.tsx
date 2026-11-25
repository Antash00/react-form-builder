import { type FieldGroup, FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'
import {
    accessGroups,
    costCenters,
    departments,
    equipment,
    managers,
    offices,
    teams,
    employmentTypes,
} from '../variables/catalog'
import { employeeOnboardingDefaults } from '../variables/defaultValues'

type Option = { id: string; name: string }

const config = defineConfig([
    {
        accessor: 'firstName',
        type: 'text',
        properties: { label: 'First name', fullWidth: true },
        rules: {
            required: 'Enter a first name',
            minLength: { value: 2, message: 'Use at least 2 characters' },
            maxLength: { value: 60, message: 'Use at most 60 characters' },
        },
    },
    {
        accessor: 'lastName',
        type: 'text',
        properties: { label: 'Last name', fullWidth: true },
        rules: { required: 'Enter a last name', maxLength: 60 },
    },
    {
        accessor: 'preferredName',
        type: 'text',
        properties: { label: 'Preferred name', fullWidth: true },
        rules: { maxLength: 60 },
    },
    {
        accessor: 'workEmail',
        type: 'text',
        properties: { label: 'Work email', type: 'email', fullWidth: true },
        rules: {
            required: 'Enter a work email',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
        },
    },
    {
        accessor: 'phone',
        type: 'text',
        properties: { label: 'Phone number', type: 'tel', fullWidth: true },
        rules: {
            required: 'Enter a phone number',
            pattern: { value: /^\+?[\d\s()-]{7,20}$/, message: 'Enter a valid phone number' },
        },
    },
    {
        accessor: 'employeeId',
        type: 'text',
        properties: { label: 'Employee ID', helperText: 'Example: HR-2048', fullWidth: true },
        rules: {
            required: 'Enter an employee ID',
            pattern: { value: /^[A-Z]{2}-\d{4}$/, message: 'Use the format AB-1234' },
        },
    },
    {
        accessor: 'jobTitle',
        type: 'text',
        properties: { label: 'Job title', fullWidth: true },
        rules: { required: 'Enter a job title', minLength: 3, maxLength: 80 },
    },
    {
        accessor: 'startDate',
        type: 'text',
        properties: {
            label: 'Start date',
            placeholder: 'YYYY-MM-DD',
            helperText: 'Use YYYY-MM-DD',
            fullWidth: true,
        },
        rules: {
            required: 'Enter a start date',
            pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Use YYYY-MM-DD' },
        },
    },
    {
        accessor: 'employmentType',
        type: 'select',
        properties: {
            label: 'Employment type',
            fullWidth: true,
            items: employmentTypes,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose an employment type' },
    },
    {
        accessor: 'department',
        type: 'select',
        properties: {
            label: 'Department',
            fullWidth: true,
            items: departments,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a department' },
    },
    {
        accessor: 'team',
        type: 'select',
        properties: {
            label: 'Team',
            fullWidth: true,
            items: teams,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a team' },
    },
    {
        accessor: 'office',
        type: 'select',
        properties: {
            label: 'Office',
            fullWidth: true,
            items: offices,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose an office' },
    },
    {
        accessor: 'manager',
        type: 'autocomplete',
        properties: {
            label: 'Manager',
            fullWidth: true,
            options: managers,
            getOptionLabel: (item: Option) => item.name,
            isOptionEqualToValue: (option: Option, value: Option) => option.id === value.id,
        },
        rules: { required: 'Choose a manager' },
    },
    {
        accessor: 'costCenter',
        type: 'select',
        properties: {
            label: 'Cost center',
            fullWidth: true,
            items: costCenters,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose a cost center' },
    },
    {
        accessor: 'salary',
        type: 'number',
        properties: { label: 'Annual salary', fullWidth: true },
        rules: {
            required: 'Enter an annual salary',
            min: { value: 0, message: 'Salary cannot be negative' },
            max: { value: 1000000, message: 'Check the salary amount' },
        },
    },
    {
        accessor: 'weeklyHours',
        type: 'number',
        properties: { label: 'Weekly hours', fullWidth: true },
        rules: {
            required: 'Enter weekly hours',
            min: { value: 1, message: 'Enter at least 1 hour' },
            max: { value: 60, message: 'Enter at most 60 hours' },
        },
    },
    {
        accessor: 'equipment',
        type: 'autocomplete',
        properties: {
            label: 'Equipment to prepare',
            multiple: true,
            fullWidth: true,
            options: equipment,
            getOptionLabel: (item: Option) => item.name,
            isOptionEqualToValue: (option: Option, value: Option) => option.id === value.id,
        },
    },
    {
        accessor: 'accessGroups',
        type: 'checkboxGroup',
        properties: {
            label: 'Systems to provision',
            items: accessGroups,
            getItemLabel: (item: Option) => item.name,
            getItemKey: (item: Option) => item.id,
        },
        rules: { required: 'Choose at least one system' },
    },
    {
        accessor: 'policyAccepted',
        type: 'checkbox',
        properties: { label: 'The onboarding details have been reviewed' },
        rules: { required: 'Review the onboarding details' },
    },
    {
        accessor: 'notes',
        type: 'text',
        properties: {
            label: 'Notes for IT and People teams',
            multiline: true,
            minRows: 3,
            fullWidth: true,
        },
        rules: { maxLength: { value: 500, message: 'Use at most 500 characters' } },
    },
])

const groups = [
    {
        fields: ['firstName', 'lastName', 'preferredName', 'workEmail', 'phone', 'employeeId'],
        columns: { xs: 1, sm: 2 },
        gap: 2,
    },
    {
        fields: [
            'jobTitle',
            'startDate',
            'employmentType',
            'department',
            'team',
            'office',
            'manager',
            'costCenter',
            'salary',
            'weeklyHours',
        ],
        columns: { xs: 1, sm: 2 },
        gap: 2,
    },
    { fields: ['equipment', 'accessGroups'], columns: { xs: 1, sm: 2 }, gap: 2 },
] satisfies FieldGroup<(typeof config)[number]['accessor']>[]

export function EmployeeOnboardingForm({ onSubmit, onInvalid }: FormCallbacks) {
    return (
        <FormBuilder
            config={config}
            groups={groups}
            defaultValues={employeeOnboardingDefaults}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    )
}
