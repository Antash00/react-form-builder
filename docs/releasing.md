# Releasing `@antash00/form-builder-mui`

The package is published from `packages/mui`. The GitHub release tag must match its version exactly: version `0.1.1` uses tag `v0.1.1`.

## First release (`0.1.0`)

An npm trusted publisher is configured from the package's settings page, so the first version must create that package. Sign in to the npm account that owns the `@antash00` scope and enable two-factor authentication. On a clean checkout of the release commit:

```bash
pnpm install --frozen-lockfile
pnpm --filter playground exec playwright install chromium
pnpm check
cd packages/mui
npm pack --dry-run
npm login
npm publish --access public
```

Check the package page on npm after publication. Then create and publish a GitHub release for tag `v0.1.0` from the same commit, using the `0.1.0` section of `CHANGELOG.md` as release notes. The workflow will repeat its checks and skip publication because `0.1.0` already exists.

## Configure trusted publishing

In the npm package settings, add a **GitHub Actions** trusted publisher with:

- Organization or user: `antash00`
- Repository: `react-form-builder`
- Workflow filename: `publish.yml`
- Environment: leave empty
- Allowed action: allow direct `npm publish`

The workflow uses GitHub's OIDC identity, so it does not need an npm token or GitHub secret. Configure the trusted publisher shortly before the next release: npm requires a newly configured publisher to complete its first successful publication within two days.

## Later releases

Update the version in `packages/mui/package.json` and `VERSION` in `packages/mui/src/index.ts`, then add a section to `CHANGELOG.md`. After the changes pass CI on the release commit, publish a GitHub release with the matching `v` tag. `.github/workflows/publish.yml` installs from the lockfile, runs `pnpm check`, inspects the npm archive, and publishes from `packages/mui` with public access. It skips publication when that version is already present in npm.

The workflow runs on GitHub-hosted runners with `contents: read` and `id-token: write`. It does not publish prereleases. To publish a prerelease, update this policy deliberately before creating the GitHub release.
