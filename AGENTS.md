# Agent Notes

## Sanity Studio browser QA

- Do not use the default headless browser for Sanity Studio UI checks. It uses a separate browser profile and will not have the user's Studio auth.
- Prefer a real signed-in browser tab when checking Studio behavior, especially Presentation mode, mobile tabs, and click-to-edit.
- If a real authenticated tab is not available, run source/build/type/lint checks and clearly state that browser QA still needs a signed-in browser session.
- Do not work around this by injecting CLI auth tokens into headless browser storage.

## Clark (editing from Telegram)

- The DelGrosso staff edit both websites by chatting with Clark, the Telegram editing bot. Read `docs/agents/clark.md` before you change the Sanity schema, the draft-mode routes or the Studio deploy workflow.
- Clark follows one editing guide per website: `docs/agents/editing-dgf.md` and `docs/agents/editing-lfd.md`. When a content type, field, section or site rule changes, update both guides in the same pull request and store them again in Clark's registry (the command is in `docs/agents/clark.md`).
