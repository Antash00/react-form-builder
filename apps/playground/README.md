# Form Builder Playground

Run `pnpm dev` from the repository root, then open the local Vite URL. Each case has its own route:

| Route                  | Scenario                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `/basic`               | Required fields and selected domain objects                                             |
| `/select-cases`        | Editing and clearing saved single and multiple selections                               |
| `/all-fields`          | Every supported field type in one 11-field form                                         |
| `/employee-onboarding` | A 20-field saved employee draft with identity, placement, compensation and access rules |
| `/supplier-onboarding` | A 30-field saved supplier draft with company, contact, billing and compliance rules     |

The large forms intentionally use only the package's public API. Submit a form to inspect its full values, including selected objects. The saved drafts leave a few required fields incomplete so validation is visible immediately.
