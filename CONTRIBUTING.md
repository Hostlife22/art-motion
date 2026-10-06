# Contributing to art-motion

Contributions are welcome: new art styles, clearer documentation, animation fixes, explainer formats and accessibility improvements. Keep changes focused and include enough context for another person to reproduce and review them.

## Before you start

Check the [open issues](https://github.com/Hostlife22/art-motion/issues) for related work. For a substantial new format, dependency or change to the shared engine, open an issue describing the problem and proposed approach first. Small fixes can go straight to a pull request.

Report security vulnerabilities through [SECURITY.md](SECURITY.md). For accessibility issues, follow [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Local setup

Fork the repository, clone your fork and create a branch for your change. Install [uv](https://docs.astral.sh/uv/), FFmpeg and the browser used by the renderer:

```sh
uv run --with playwright playwright install chromium
uv run python -m http.server 8000 --bind 127.0.0.1 --directory scripts/engine
```

Open `http://127.0.0.1:8000/index.html?film=gallery` or select a demo from the [README](README.md#quick-start).

## Project conventions

- Write documentation, comments, example text and visible captions in English. Use ASCII names for new files and directories.
- Reuse the shared libraries before adding a new helper. Seed randomness so the same timestamp produces the same frame.
- Cache static drawing work and keep changes to shared APIs compatible with existing scenes.
- Keep Milo's dark curls, yellow jacket and small teal backpack consistent across poses and styles. See the [character guide](references/10-characters.md).
- Include asset sources, licenses and generation prompts where applicable. Keep copyright and third-party license notices with redistributed material.
- Keep credentials, private assets and generated video/audio exports out of pull requests. Include tracked showcase images only when they help document the change.
- Follow the [accessibility contribution guidance](ACCESSIBILITY.md#contribution-guidance) for controls, captions, motion and visual explanations.

## Adding an art style

Start with the [style index](references/style-recipes/INDEX.md), the [authoring guide](references/08-style-authoring-guide.md) and the closest existing scene.

Add a scene in `scripts/engine/scenes/` and register its drawing function as `SCENES['<id>']`. Add its entry to `scripts/engine/eras_gallery.js`; the scene loader reads files from that sequence automatically. Add a recipe card describing its palette, materials, main action, motif loops, transition, performance and limitations; update the style index. Preserve the shared gallery composition when adding a gallery scene.

Design and inspect a still before developing the full animation. Include at least one main action and two motif loops that are visible during the scene's actual duration. Rebuild the gallery overview when its contents change:

```sh
uv run scripts/build_overviews.py --gallery-only
```

## Validate your change

Choose checks that exercise the behavior you changed. Documentation edits need link and command checks; scene and engine changes also need rendering and visual review.

Run the source and local-link checks used by CI:

```sh
python scripts/check_repository.py
```

This check requires Node.js. GitHub Actions also smoke-renders the gallery, Milo adventure and a configurable chart clip, then checks that the committed project can be packaged.

For an existing scene, these commands provide stills and a focused QA report. Replace `09_postimp` with your scene ID:

```sh
uv run --with playwright python scripts/engine/render.py --film gallery --solo 09_postimp --stills 0.3,0.6,0.9 --out renders/review
uv run scripts/qa.py --project scripts/engine --film gallery --ids 09_postimp --out renders/qa
git diff --check
```

For a configurable clip, render and check the relevant specification:

```sh
uv run --with playwright python scripts/engine/render.py --spec scripts/engine/examples/t3_finance_chart.json --out renders/review.mp4
uv run scripts/qa.py --spec scripts/engine/examples/t3_finance_chart.json --out renders/qa-clip
```

Inspect the film as well as the measurements. Check identity, movement, text readability, framing, occlusion and transitions. Explain intentional pauses or flicker in your pull request. Shared-library changes should also be checked against the demos that use them.

## Submit a pull request

Describe the concrete problem, the resulting behavior and how you verified it. Include a before/after frame or short clip for visual changes, and relevant QA findings. Update affected guides, examples and overview assets; add a changelog entry for a user-visible change.

Contribute only material you can submit under the project's [MIT license](LICENSE), with any separately licensed assets clearly identified. Review feedback should be specific, respectful and focused on the work.

## Releases

The [CI and release workflow](.github/workflows/release.yml) runs on pull requests, pushes to `main` and all pushed tags. A tag creates a GitHub Release only after validation, smoke rendering and packaging succeed.

After merging the release changes and updating your checkout, create and push a tag:

```sh
git tag -a v1.0.0 -m "art-motion v1.0.0"
git push origin v1.0.0
```

Use your next version number. Tags such as `v1.0.0-rc.1` are marked as prereleases. A local tag alone does not start the workflow; it must be pushed, and its commit must include the workflow and complete project files.

Release assets are `art-motion.zip`, `art-motion.tar.gz` and `SHA256SUMS`, built from the tagged commit. Each archive contains an `art-motion/` directory with the skill, documentation, engine and tracked assets. Rendered MP4s are not built for releases. GitHub generates the release notes, and the workflow uses its built-in `GITHUB_TOKEN` with write permission only in the publishing job.

To check packaging locally, first commit your release files, then run:

```sh
python scripts/build_release.py --ref HEAD --out dist
```

The packager reads committed files rather than uncommitted edits. Rerunning a successful release leaves it unchanged; an incomplete draft has its assets uploaded again before publication. Inspect failures in the repository's Actions tab.
