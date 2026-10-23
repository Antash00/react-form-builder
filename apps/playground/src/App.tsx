import { VERSION } from '@antash00/form-builder-mui'
import { Link, NavLink, Route, Routes } from 'react-router'
import { BasicForm } from './examples/BasicForm.tsx'
import { SelectCasesForm } from './examples/SelectCasesForm.tsx'
import { AllFieldsForm } from './examples/AllFieldsForm.tsx'
import { EmployeeOnboardingForm } from './examples/EmployeeOnboardingForm.tsx'
import { SupplierOnboardingForm } from './examples/SupplierOnboardingForm.tsx'

const cases = [
    {
        path: '/basic',
        title: 'Basic form',
        description: 'A compact example of required fields, object selections and form results.',
        form: <BasicForm />,
    },
    {
        path: '/select-cases',
        title: 'Select cases',
        description: 'Edit saved single and multiple selections from a longer team list.',
        form: <SelectCasesForm />,
    },
    {
        path: '/all-fields',
        title: 'All fields',
        description: 'Every supported field type together with validation and defaults.',
        form: <AllFieldsForm />,
    },
    {
        path: '/employee-onboarding',
        title: 'Employee onboarding',
        description: '20 fields for employee details, placement, compensation and access.',
        form: <EmployeeOnboardingForm />,
    },
    {
        path: '/supplier-onboarding',
        title: 'Supplier onboarding',
        description: '30 fields for supplier identity, contacts, billing and compliance.',
        form: <SupplierOnboardingForm />,
    },
]

export default function App() {
    return (
        <main>
            <h1>Form Builder Playground</h1>
            <p>Library version: {VERSION}</p>
            <nav aria-label="Playground pages" className="playground-nav">
                <NavLink to="/" end>
                    Overview
                </NavLink>
                {cases.map(({ path, title }) => (
                    <NavLink key={path} to={path}>
                        {title}
                    </NavLink>
                ))}
            </nav>
            <Routes>
                <Route
                    path="/"
                    element={
                        <section aria-labelledby="overview-heading" className="playground-panel">
                            <h2 id="overview-heading">Explore the form cases</h2>
                            <p>Open a focused example or a larger product form.</p>
                            <ul className="case-list">
                                {cases.map(({ path, title, description }) => (
                                    <li key={path}>
                                        <Link to={path}>{title}</Link>
                                        <p>{description}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    }
                />
                {cases.map(({ path, title, form }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <section aria-label={title} className="playground-panel">
                                <h2>{title}</h2>
                                {form}
                            </section>
                        }
                    />
                ))}
            </Routes>
        </main>
    )
}
