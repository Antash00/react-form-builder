import { VERSION } from '@antash00/form-builder-mui'
import { Link } from 'react-router'
import { categories, examples } from '../variables/examples'
import { docs, install } from '../variables/site'
import { CopyButton } from '../components/CopyButton'
import { Glyph } from '../components/Glyph'
import { WorkspaceExample } from '../components/WorkspaceExample'

export function Home() {
    return (
        <div className="wrap home">
            <section className="intro">
                <div>
                    <div className="eyebrow">Developer playground</div>
                    <h1>FormBuilder for MUI</h1>
                    <p>
                        Build everyday forms from typed field configs. FormBuilder connects Material
                        UI inputs to React Hook Form and returns typed values on submit.
                    </p>
                </div>
                <div className="setup">
                    <div className="setup-label">
                        <span>Install package</span>
                        <code>v{VERSION}</code>
                    </div>
                    <div className="install">
                        <code>
                            <b>$</b> {install}
                        </code>
                        <CopyButton text={install} label="Copy install command" />
                    </div>
                    <a href={docs}>Documentation ↗</a>
                </div>
            </section>
            <WorkspaceExample />
            <section className="catalog" id="examples">
                <div className="section-head">
                    <h2>Example catalog</h2>
                    <span className="count">{examples.length} examples</span>
                </div>
                <div className="catalog-grid">
                    {categories.map((category) => (
                        <div key={category.title}>
                            <h3>{category.title}</h3>
                            {category.examples.map((item) => (
                                <Link key={item.path} to={item.path}>
                                    <strong>
                                        {item.title}
                                        <Glyph name="arrow" />
                                    </strong>
                                    <span>{item.description}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
