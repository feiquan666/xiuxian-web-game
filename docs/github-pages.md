# GitHub Pages Deployment

This project is a static web game. It runs from the repository root and deploys with `.github/workflows/pages.yml`.

## Local Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## New Repository Push

After creating an empty GitHub repository:

```bash
git remote add origin <repository-url>
git push -u origin codex/xian-ni-cultivation-pages
```

To publish directly from this branch, make it the default branch or merge it into `main`/`master`. The workflow deploys on pushes to `main` and `master`, and can also be run manually from the Actions tab.

If GitHub Pages is not already configured, set Pages Source to `GitHub Actions` in the repository settings.
