# Changelog

## 0.2.0 — Typed validation errors

- Add an optional `onInvalid` callback with validation errors inferred from the field config.
- Tighten field configuration types: reject form-controlled group props and remove the arbitrary autocomplete property index signature. `defineConfig` remains optional.
- Initialize default values once per mounted form and simplify selection matching and field-group resolution without changing their intended behavior.
- Expand peer dependency support to React 18 and 19, MUI 9.2+, and React Hook Form 7.84+.

## 0.1.1 — Live Playground

- Publish the existing Playground on GitHub Pages with working example links and direct-page reloads.
- Update the package version and exported `VERSION` to `0.1.1`. The library API and form behavior are unchanged.

## 0.1.0 — First public release

- Add a standalone `FormBuilder` that connects typed field configuration to React Hook Form and MUI.
- Add `defineConfig`, `InferFieldValue`, and `InferFormValues` so field accessors and submitted values retain their TypeScript types.
- Support text, number, checkbox, checkbox group, radio group, select, and autocomplete fields with validation and default values.
- Preserve domain objects in selection values. Support single and multiple selection where applicable.
- Add optional responsive field groups, form reset, and a typed submit callback.
- Keep `config` fixed for each mounted form; remount `FormBuilder` to switch configurations.
- Reject reserved object keys as field accessors and prevent duplicate asynchronous submissions.
- Publish ESM and CommonJS builds with NodeNext-compatible TypeScript declarations from the package root.

This release provides the standalone form API. Rendering configured fields inside an existing React Hook Form context is planned for a later release. The API may change before `1.0`.
