# Security policy

art-motion is a local animation toolkit that runs Python scripts, JavaScript scenes, Chromium and FFmpeg. Its intended workflow uses code and assets that you have reviewed and trust.

## Supported code

Security fixes target the current `main` branch. Older releases, copied engine directories and modified forks should be updated or have relevant fixes applied separately; this project does not define a maintenance schedule for historical versions.

## Report a vulnerability

Use the repository's [Security page](https://github.com/Hostlife22/art-motion/security). If **Report a vulnerability** is available, submit a private report there. The feature must be enabled in GitHub; adding this policy does not enable it. See [GitHub's private-reporting instructions](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).

If private reporting is unavailable, open an [issue](https://github.com/Hostlife22/art-motion/issues) titled **Private security contact request** and ask for a private reporting channel. Include no vulnerability details in that public request. Do not publish exploit code, credentials or sensitive files in an issue or pull request.

In the private report, include:

- The affected commit, script or scene and your operating system.
- The expected behavior, actual behavior and security impact.
- Minimal reproduction steps using non-sensitive sample data.
- Any proposed fix or workaround, if you have one.

Coordinate publication of technical details with the maintainers while a fix is reviewed. There is no guaranteed response or resolution deadline.

## Running the toolkit

- Review third-party scripts, scene code and dependencies before execution. Loading a scene executes JavaScript; Python tools execute with your local account's permissions.
- Run previews on loopback, as in `python -m http.server 8000 --bind 127.0.0.1 --directory scripts/engine`. The bundled servers are development tools with no authentication.
- The video renderer relaxes Chromium's web-security checks for local asset handling. Treat it as a local tool for trusted projects, rather than a service for untrusted uploads.
- Review clip specifications and image paths. A specification can reference local files or remote images; remote resources can make network requests.
- Keep Python, Chromium, FFmpeg and their dependencies updated. Keep secrets and private source media outside directories served by preview tools.

## Scope

Reports about unexpected file access, unintended command execution, script injection, exposed secrets or dependency vulnerabilities are relevant. Running deliberately malicious scene code is outside the intended trust model, but bypasses of validation or file-serving boundaries should still be reported.

Ordinary rendering bugs, animation timing and visual-accessibility issues can be reported through public issues. See [CONTRIBUTING.md](CONTRIBUTING.md) and [ACCESSIBILITY.md](ACCESSIBILITY.md).
