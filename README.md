# TOKI Landing

Public marketing website for [TOKI](https://github.com/JGuilherme2005/Toki), the Windows desktop focus application.

This repository is operationally independent from the Electron application. It contains the landing source, website media, SEO metadata, optional analytics configuration, and GitHub Pages deployment workflow.

## Local development

Requires [Bun](https://bun.sh/).

```sh
bun install
bun run dev
```

## Verification and production build

```sh
bun run test
bun run preview
```

The production site is written to `dist/`.

## Analytics

Analytics are disabled by default. To enable Plausible without committing credentials:

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_PLAUSIBLE_DOMAIN` to the public site domain.
3. Configure the same value as a repository/environment variable in the deployment platform.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`. Enable GitHub Pages with **Source: GitHub Actions** in the repository settings. The configured canonical URL is:

https://jguilherme2005.github.io/Toki-Landing/

## Desktop installer

Download buttons use the `v1.0.0` GitHub Release asset named `toki-setup-1.0.0.exe`. The installer is intentionally stored as a release asset instead of normal Git history because it exceeds GitHub's 100 MiB Git-object limit.
