import { VERSION } from '@antash00/form-builder-mui'
import { BasicForm } from "./examples/BasicForm.tsx";

export default function App() {
    return (
        <main>
            <h1>Form Builder Playground</h1>
            <p>Library version: {VERSION}</p>
            <BasicForm/>
        </main>
    )
}