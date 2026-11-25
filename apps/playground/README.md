# Form Builder Playground

Run `pnpm dev` from the repository root, then open the local Vite URL. Each case has its own route:

| Route                  | Scenario                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `/basic`               | Required fields and selected domain objects                                             |
| `/select-cases`        | Editing and clearing saved single and multiple selections                               |
| `/async-options`       | Creating and editing with asynchronously loaded team options                            |
| `/all-fields`          | Every supported field type in one 11-field form                                         |
| `/employee-onboarding` | A 20-field saved employee draft with identity, placement, compensation and access rules |
| `/supplier-onboarding` | A 30-field saved supplier draft with company, contact, billing and compliance rules     |

Each example has a source panel showing the form and its supporting files. The field and group configs live with the components in [src/examples](src/examples). The mock options are in [catalog.ts](src/variables/catalog.ts), and the saved records and initial values are in [defaultValues.ts](src/variables/defaultValues.ts).

Submit a form to inspect its values, including selected objects. The onboarding drafts leave a few required fields empty so you can see the validation errors on submit.
