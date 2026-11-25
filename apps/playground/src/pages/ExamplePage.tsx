import { Link, NavLink } from 'react-router'
import { categories, type Example } from '../variables/examples'
import { useFormOutput } from '../useFormOutput'
import { ExampleSource } from '../components/ExampleSource'
import { FormOutput } from '../components/FormOutput'

export function ExamplePage({ example, category }: { example: Example; category: string }) {
    const Form = example.component
    const { output, ...callbacks } = useFormOutput()
    return (
        <div className="wrap demo-layout">
            <aside>
                <nav aria-label="Playground pages">
                    <NavLink end to="/">
                        Overview
                    </NavLink>
                    {categories.map((category) => (
                        <div key={category.title}>
                            <h2>{category.title}</h2>
                            {category.examples.map((item) => (
                                <NavLink key={item.path} to={item.path}>
                                    {item.title}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
            <section aria-label={example.title} className="demo">
                <div className="crumb">
                    <Link to="/">Overview</Link> / {category}
                </div>
                <h1>{example.title}</h1>
                <p className="lead">{example.description}</p>
                <nav className="jump" aria-label="Example sections">
                    <a href="#live">Form</a>
                    <a href="#source">Code</a>
                    <a href="#output">Output</a>
                </nav>
                <div className="example-grid">
                    <div className="form-panel" id="live">
                        <div className="preview-head">
                            <span className="indicator" />
                            Live form
                        </div>
                        <div className="form-body">
                            <p className="detail">{example.detail}</p>
                            <Form {...callbacks} />
                        </div>
                    </div>
                    <div className="inspector">
                        <div id="source">
                            <ExampleSource file={example.file} />
                        </div>
                        <div id="output">
                            <FormOutput output={output} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
