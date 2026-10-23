import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'
import {
    type Choice,
    accessGroups,
    costCenters,
    departments,
    equipment,
    getId,
    getName,
    managers,
    offices,
    sameChoice,
    teams,
} from './catalog'

const employmentTypes: Choice[] = [
    { id: 'full-time', name: 'Full-time employee' },
    { id: 'part-time', name: 'Part-time employee' },
    { id: 'contractor', name: 'Contractor' },
    { id: 'intern', name: 'Intern' },
]

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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getOptionLabel: getName,
            isOptionEqualToValue: sameChoice,
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
            getItemLabel: getName,
            getItemKey: getId,
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
            getOptionLabel: getName,
            isOptionEqualToValue: sameChoice,
        },
    },
    {
        accessor: 'accessGroups',
        type: 'checkboxGroup',
        properties: {
            label: 'Systems to provision',
            items: accessGroups,
            getItemLabel: getName,
            getItemKey: getId,
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

export function EmployeeOnboardingForm() {
    const [submitted, setSubmitted] = useState<string | null>(null)

    return (
        <>
            <p>
                Complete a saved employee draft. This 20-field form covers identity, placement,
                compensation and access provisioning.
            </p>
            <FormBuilder
                config={config}
                defaultValues={{
                    lastName: 'Rivera',
                    workEmail: 'sam.rivera@example.com',
                    phone: '+1 202 555 0187',
                    employeeId: 'HR-2048',
                    jobTitle: 'Operations Analyst',
                    startDate: '2026-11-03',
                    employmentType: employmentTypes[0],
                    department: departments[3],
                    team: teams[0],
                    office: offices[7],
                    manager: managers[0],
                    costCenter: costCenters[3],
                    salary: 85000,
                    weeklyHours: 40,
                    equipment: [equipment[0], equipment[1]],
                    accessGroups: [accessGroups[0]],
                }}
                onSubmit={(values, result) => {
                    console.log('Employee onboarding submit', { values, result })
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
