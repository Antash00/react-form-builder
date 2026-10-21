import { VERSION } from '@antash00/form-builder-mui'
import { BasicForm } from './examples/BasicForm.tsx'
import { SelectCasesForm } from './examples/SelectCasesForm.tsx'
import { AllFieldsForm } from './examples/AllFieldsForm.tsx'

export default function App() {
    const isAllFieldsPage = window.location.pathname === '/all-fields'

    return (
        <main>
            <h1>Form Builder Playground</h1>
            <p>Library version: {VERSION}</p>
            <nav aria-label="Playground pages" className="playground-nav">
                <a href="/" aria-current={isAllFieldsPage ? undefined : 'page'}>
                    Examples
                </a>
                <a href="/all-fields" aria-current={isAllFieldsPage ? 'page' : undefined}>
                    All fields
                </a>
            </nav>
            {isAllFieldsPage ? (
                <section aria-labelledby="all-fields-heading" className="playground-panel">
                    <h2 id="all-fields-heading">All fields</h2>
                    <AllFieldsForm />
                </section>
            ) : (
                <>
                    <section aria-labelledby="basic-form-heading" className="playground-panel">
                        <h2 id="basic-form-heading">Basic form</h2>
                        <BasicForm />
                    </section>
                    <section aria-labelledby="select-cases-heading" className="playground-panel">
                        <h2 id="select-cases-heading">Select cases</h2>
                        <SelectCasesForm />
                    </section>
                </>
            )}
        </main>
    )
}
