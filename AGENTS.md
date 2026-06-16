# Agent Notes

## Sanity Studio browser QA

- Do not use the default headless browser for Sanity Studio UI checks. It uses a separate browser profile and will not have the user's Studio auth.
- Prefer a real signed-in browser tab when checking Studio behavior, especially Presentation mode, mobile tabs, and click-to-edit.
- If a real authenticated tab is not available, run source/build/type/lint checks and clearly state that browser QA still needs a signed-in browser session.
- Do not work around this by injecting CLI auth tokens into headless browser storage.
