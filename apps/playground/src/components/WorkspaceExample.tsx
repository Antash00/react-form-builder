import { FormBuilder } from '@antash00/form-builder-mui'
import { CodePanel } from './CodePanel'
import { config } from './workspaceConfig'
import { workspaceDefaults } from '../variables/defaultValues'
import source from './workspaceConfig.ts?raw'
import { useFormOutput } from '../useFormOutput'

export function WorkspaceExample() {
    const { output, onSubmit, onInvalid } = useFormOutput()
    return (
        <section className="workshop">
            <div className="section-head">
                <div>
                    <div className="eyebrow">Interactive example</div>
                    <h2>Workspace settings</h2>
                </div>
                <a href="#examples">Example catalog ↓</a>
            </div>
            <div className="bench">
                <CodePanel compact files={[{ name: 'workspaceConfig.ts', source }]} />
                <div className="preview">
                    <div className="preview-head">
                        <span className="indicator" />
                        Live preview
                    </div>
                    <div className="preview-body">
                        <FormBuilder
                            config={config}
                            defaultValues={workspaceDefaults}
                            onSubmit={onSubmit}
                            onInvalid={onInvalid}
                            resetButtonProps={false}
                            submitButtonProps={{ children: 'Save workspace' }}
                        />
                    </div>
                    <div className="console">
                        <div className="console-title">
                            <b aria-hidden="true">›_</b> Callback output{' '}
                            <code>{output?.errors ? 'onInvalid' : 'onSubmit'}</code>
                        </div>
                        <pre role="status">
                            {output?.errors ?? output?.values ?? '// Waiting for submission'}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    )
}
